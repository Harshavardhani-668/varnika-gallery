import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const CANCELLABLE_STATUSES = ["pending", "processing", "confirmed"];

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // ===== STEP 1: Validate environment variables =====
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      console.error("Missing Supabase credentials");
      return json({ error: "Internal server error: missing configuration" }, 500);
    }

    // ===== STEP 2: Validate authentication header =====
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
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

    const { action, orderId, reason } = body;

    // Validate action
    if (!action) {
      return json({ error: "Missing required field: action" }, 400);
    }
    if (action !== "cancel_order") {
      return json({ error: `Invalid action: '${action}'. Only 'cancel_order' is supported.` }, 400);
    }

    // Validate orderId
    if (!orderId || typeof orderId !== "string") {
      return json({ error: "Missing or invalid required field: orderId (must be string)" }, 400);
    }

    // Validate reason
    if (!reason || String(reason).trim().length === 0) {
      return json({ error: "Missing or invalid required field: reason (must be non-empty string)" }, 400);
    }

    // ===== STEP 4: Authenticate user =====
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError.message);
      return json({ error: "Unauthorized: failed to verify user" }, 401);
    }

    if (!user?.id) {
      return json({ error: "Unauthorized: invalid user token" }, 401);
    }

    // ===== STEP 5: Initialize admin client and fetch order =====
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status, shipping_address, order_number")
      .eq("id", orderId)
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
      console.warn(`User ${user.id} attempted to cancel order ${orderId} owned by ${order.user_id}`);
      return json({ error: "Forbidden: order does not belong to this user" }, 403);
    }

    // ===== STEP 6: Validate order is cancellable =====
    const currentStatus = String(order.status || "").toLowerCase().trim();

    if (currentStatus === "cancelled") {
      return json({ error: "Order already cancelled" }, 400);
    }

    if (!CANCELLABLE_STATUSES.includes(currentStatus)) {
      return json({
        error: `Cannot cancel order with status '${order.status}'. Only orders in ${CANCELLABLE_STATUSES.join(", ")} status can be cancelled.`,
      }, 400);
    }

    // ===== STEP 7: Update order to cancelled =====
    const nextShippingAddress = {
      ...(order.shipping_address || {}),
      cancellation_reason: String(reason).trim(),
      cancelled_at: new Date().toISOString(),
    };

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: "cancelled",
        shipping_address: nextShippingAddress,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("user_id", user.id)
      .select("id, order_number, status, shipping_address, total_amount")
      .single();

    if (updateError) {
      console.error("Order update error:", updateError.message);
      return json({ error: `Failed to cancel order: ${updateError.message}` }, 500);
    }

    if (!updatedOrder) {
      console.error("Updated order not returned after update");
      return json({ error: "Order was not updated properly" }, 500);
    }

    // ===== STEP 8: Successful response =====
    console.log(`Order ${orderId} cancelled by user ${user.id}`);
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
