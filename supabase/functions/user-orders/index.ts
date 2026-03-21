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

    if (action === "cancel_order") {
      const { orderId, reason } = body;
      if (!orderId || !reason) return json({ error: "orderId and reason are required" }, 400);

      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .select("id, user_id, order_number, status, shipping_address")
        .eq("id", orderId)
        .maybeSingle();

      if (orderError) return json({ error: orderError.message }, 400);
      if (!order) return json({ error: "Order not found" }, 404);
      if (order.user_id !== user.id) return json({ error: "Forbidden" }, 403);

      const normalized = String(order.status || "").toLowerCase().trim();
      if (!["pending", "processing", "confirmed"].includes(normalized)) {
        return json({ error: "This order can no longer be cancelled." }, 400);
      }

      const safeShippingAddress =
        order.shipping_address && typeof order.shipping_address === "object" ? order.shipping_address : {};

      const nextShippingAddress = {
        ...safeShippingAddress,
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
      };

      const { data: updatedOrder, error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          status: "cancelled",
          shipping_address: nextShippingAddress,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id)
        .select("id, status, shipping_address")
        .maybeSingle();

      if (updateError) return json({ error: updateError.message }, 400);
      if (!updatedOrder) return json({ error: "Failed to cancel order" }, 400);

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("email, full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.email) {
        try {
          await fetch(new URL("/functions/v1/send-order-email", supabaseUrl), {
            method: "POST",
            headers: {
              Authorization: `Bearer ${serviceRoleKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "order_status_update",
              orderNumber: order.order_number,
              customerEmail: profile.email,
              customerName: profile.full_name || "Valued Customer",
              status: "cancelled",
              cancellationReason: reason,
            }),
          });
        } catch (emailError) {
          console.error("Failed to send cancellation email", emailError);
        }
      }

      return json({ success: true, order: updatedOrder });
    }

    return json({ error: "Invalid action" }, 400);
  } catch (error: any) {
    return json({ error: error.message || "Unexpected error" }, 500);
  }
});
