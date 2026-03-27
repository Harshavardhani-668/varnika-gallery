import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const CANCELLABLE_STATUSES = ["pending", "processing", "confirmed", "placed"];

function getBearerToken(authHeader: string | null) {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return token.trim();
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // ===== STEP 1: Validate environment variables =====
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase credentials");
      return json({ error: "Internal server error: missing configuration" }, 500);
    }

    // ===== STEP 2: Validate authentication header =====
    const authHeader = req.headers.get("Authorization");
    const accessToken = getBearerToken(authHeader);
    if (!accessToken) {
      return json({ error: "Unauthorized: missing Authorization header" }, 401);
    }

    // ===== STEP 3: Parse and validate request body =====
    let body: any;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return json({ error: "Invalid request body: expected valid JSON" }, 400);
    }

    if (!body || typeof body !== "object") {
      return json({ error: "Invalid request body: must be a JSON object" }, 400);
    }

    const action = String(body?.action || "").trim();
    const orderId = body?.orderId ?? body?.order_id;
    const reason = body?.reason ?? body?.cancellationReason ?? body?.cancellation_reason;

    // Validate action
    if (!action) {
      return json({ error: "Missing required field: action" }, 400);
    }
    if (!["cancel_order", "cancel-order", "cancel"].includes(action)) {
      return json({ error: `Invalid action: '${action}'. Only 'cancel_order' is supported.` }, 400);
    }

    // Validate orderId
    const normalizedOrderId = String(orderId || "").trim();
    if (!normalizedOrderId) {
      return json({ error: "Missing or invalid required field: orderId (must be string)" }, 400);
    }

    // Validate reason
    if (!reason || String(reason).trim().length === 0) {
      return json({ error: "Missing or invalid required field: reason (must be non-empty string)" }, 400);
    }

    // ===== STEP 4: Authenticate user =====
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError) {
      console.error("Auth error:", authError.message);
      return json({ error: "Unauthorized: failed to verify user" }, 401);
    }

    if (!user?.id) {
      return json({ error: "Unauthorized: invalid user token" }, 401);
    }

    // ===== STEP 5: Fetch order =====

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status, shipping_address, order_number")
      .eq("id", normalizedOrderId)
      .maybeSingle();

    if (orderError) {
      console.error("Order fetch error:", orderError.message);
      return json({ error: `Failed to fetch order: ${orderError.message}` }, 500);
    }

    // Order not found or belongs to different user
    if (!order) {
      return json({ error: "Order not found" }, 404);
    }

    if (order.user_id !== user.id) {
      console.warn(`User ${user.id} attempted to cancel order ${normalizedOrderId} owned by ${order.user_id}`);
      return json({ error: "Forbidden: order does not belong to this user" }, 403);
    }

    // ===== STEP 6: Validate order is cancellable =====
    const currentStatus = String(order.status || "").toLowerCase().trim();

    if (currentStatus === "cancelled") {
      return json({
        success: true,
        message: "Order already cancelled",
        order: {
          id: order.id,
          order_number: order.order_number,
          status: order.status,
          cancelled_at: order.shipping_address?.cancelled_at,
          cancellation_reason: order.shipping_address?.cancellation_reason,
        },
      }, 200);
    }

    if (!CANCELLABLE_STATUSES.includes(currentStatus)) {
      return json({
        error: `Cannot cancel order with status '${order.status}'. Only orders in ${CANCELLABLE_STATUSES.join(", ")} status can be cancelled.`,
      }, 400);
    }

    // ===== STEP 7: Update order to cancelled =====
    const existingShippingAddress =
      order.shipping_address && typeof order.shipping_address === "object" && !Array.isArray(order.shipping_address)
        ? order.shipping_address
        : {};

    const nextShippingAddress = {
      ...existingShippingAddress,
      cancellation_reason: String(reason).trim(),
      cancelled_at: new Date().toISOString(),
    };

    const nowIso = new Date().toISOString();

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: "cancelled",
        shipping_address: nextShippingAddress,
        updated_at: nowIso,
      })
      .eq("id", normalizedOrderId)
      .eq("user_id", user.id)
      .select("id, order_number, status, shipping_address, total_amount")
      .maybeSingle();

    if (updateError) {
      console.error("Order update error:", updateError.message);
      return json({ error: `Failed to cancel order: ${updateError.message}` }, 500);
    }

    if (!updatedOrder) {
      // Defensive fallback for cases where UPDATE succeeds but rows are not returned.
      const { data: reloadedOrder, error: reloadError } = await supabaseAdmin
        .from("orders")
        .select("id, order_number, status, shipping_address, total_amount")
        .eq("id", normalizedOrderId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (reloadError) {
        console.error("Order reload error after update:", reloadError.message);
        return json({ error: `Failed to verify cancelled order: ${reloadError.message}` }, 500);
      }

      if (!reloadedOrder || String(reloadedOrder.status || "").toLowerCase() !== "cancelled") {
        console.error("Order update returned no row and cancellation could not be verified", {
          orderId: normalizedOrderId,
          userId: user.id,
        });
        return json({ error: "Order was not updated properly" }, 500);
      }

      console.log(`Order ${normalizedOrderId} cancelled by user ${user.id} (verified by reload)`);
      return json({
        success: true,
        message: "Order cancelled successfully",
        order: {
          id: reloadedOrder.id,
          order_number: reloadedOrder.order_number,
          status: reloadedOrder.status,
          cancelled_at: reloadedOrder.shipping_address?.cancelled_at,
          cancellation_reason: reloadedOrder.shipping_address?.cancellation_reason,
        },
      }, 200);
    }

    // ===== STEP 8: Successful response =====
    console.log(`Order ${normalizedOrderId} cancelled by user ${user.id}`);
    return json({
      success: true,
      message: "Order cancelled successfully",
      order: {
        id: updatedOrder.id,
        order_number: updatedOrder.order_number,
        status: updatedOrder.status,
        cancelled_at: updatedOrder.shipping_address?.cancelled_at,
        cancellation_reason: updatedOrder.shipping_address?.cancellation_reason,
      },
    }, 200);
  } catch (error: any) {
    console.error("Unexpected error in order-actions:", error);
    return json({
      error: "Internal server error",
      details: error?.message || "Unknown error occurred",
    }, 500);
  }
});
