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
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "No auth header" }, 401);

    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();

    if (authError || !user) return json({ error: "Unauthorized" }, 401);

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const { action } = body;

    if (action !== "cancel_order") return json({ error: "Invalid action" }, 400);

    const { orderId, reason } = body;
    if (!orderId) return json({ error: "orderId is required" }, 400);
    if (!reason || String(reason).trim().length === 0) return json({ error: "reason is required" }, 400);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status, shipping_address, order_number")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError) return json({ error: orderError.message }, 400);
    if (!order || order.user_id !== user.id) return json({ error: "Order not found" }, 404);

    const currentStatus = String(order.status || "").toLowerCase();
    if (!CANCELLABLE_STATUSES.includes(currentStatus)) {
      return json({ error: `Order cannot be cancelled from status '${order.status}'.` }, 400);
    }

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
      .select("id, order_number, status, shipping_address")
      .single();

    if (updateError) return json({ error: updateError.message }, 400);

    return json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return json({ error: error.message || "Unexpected error" }, 500);
  }
});
