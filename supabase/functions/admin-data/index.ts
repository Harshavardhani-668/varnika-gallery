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
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: "Unauthorized" }, 401);

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: roleData } = await supabaseAdmin
      .from("user_roles").select("role")
      .eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleData) return json({ error: "Forbidden" }, 403);

    const body = await req.json();
    const { action } = body;

    if (action === "check_admin") {
      return json({ isAdmin: true });
    }

    if (action === "dashboard_stats") {
      const [usersRes, ordersRes, revenueRes, recentRes, productsRes] = await Promise.all([
        supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("orders").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("orders").select("total_amount").eq("payment_status", "paid"),
        supabaseAdmin.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(10),
        supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
      ]);
      const revenue = (revenueRes.data || []).reduce((sum: number, o: any) => sum + Number(o.total_amount), 0);
      return json({
        totalUsers: usersRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalRevenue: revenue,
        totalProducts: productsRes.count || 0,
        recentOrders: recentRes.data || [],
      });
    }

    if (action === "all_orders") {
      const { data } = await supabaseAdmin
        .from("orders").select("*, order_items(*)")
        .order("created_at", { ascending: false });
      return json({ orders: data || [] });
    }

    if (action === "update_order") {
      const { orderId, status, payment_status, sendEmail: shouldSendEmail } = body;
      const updates: Record<string, string> = {};
      if (status) updates.status = status;
      if (payment_status) updates.payment_status = payment_status;
      updates.updated_at = new Date().toISOString();

      // Get order details for email
      const { data: order } = await supabaseAdmin
        .from("orders").select("*, order_items(*)").eq("id", orderId).maybeSingle();

      const { error } = await supabaseAdmin
        .from("orders").update(updates).eq("id", orderId);
      if (error) return json({ error: error.message }, 400);

      // Send status update email if requested and status changed
      if (shouldSendEmail && status && order) {
        try {
          const { data: profile } = await supabaseAdmin
            .from("profiles").select("email, full_name").eq("id", order.user_id).maybeSingle();
          
          if (profile?.email) {
            const emailRes = await fetch(new URL("/functions/v1/send-order-email", supabaseUrl), {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${serviceRoleKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                action: "order_status_update",
                orderNumber: order.order_number,
                customerEmail: profile.email,
                customerName: profile.full_name || "Valued Customer",
                status: status,
              }),
            });
            if (!emailRes.ok) console.error("Failed to send status email:", await emailRes.text());
          }
        } catch (emailError) {
          console.error("Error sending status update email:", emailError);
        }
      }

      return json({ success: true });
    }

    if (action === "all_users") {
      const { data: profiles } = await supabaseAdmin
        .from("profiles").select("*").order("created_at", { ascending: false });
      const { data: roles } = await supabaseAdmin.from("user_roles").select("*");
      const usersWithRoles = (profiles || []).map((p: any) => ({
        ...p,
        roles: (roles || []).filter((r: any) => r.user_id === p.id).map((r: any) => r.role),
      }));
      return json({ users: usersWithRoles });
    }

    if (action === "promote_to_admin") {
      const { userId } = body;
      const { data: existing } = await supabaseAdmin
        .from("user_roles").select("id")
        .eq("user_id", userId).eq("role", "admin").maybeSingle();
      if (existing) return json({ success: true, message: "Already admin" });

      const { error } = await supabaseAdmin
        .from("user_roles").insert({ user_id: userId, role: "admin" });
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    if (action === "order_detail") {
      const { orderId } = body;
      const { data } = await supabaseAdmin
        .from("orders").select("*, order_items(*)").eq("id", orderId).maybeSingle();
      if (!data) return json({ error: "Order not found" }, 404);
      return json({ order: data });
    }

    // ---- Product Management ----

    if (action === "all_products") {
      const { data } = await supabaseAdmin
        .from("products").select("*").order("created_at", { ascending: false });
      return json({ products: data || [] });
    }

    if (action === "create_product") {
      const { product } = body;
      const { error } = await supabaseAdmin.from("products").insert({
        product_id: product.product_id,
        product_name: product.product_name,
        short_description: product.short_description || '',
        long_description: product.long_description || '',
        brand: product.brand || 'Varnika',
        category: product.category || '',
        subcategory: product.subcategory || '',
        tags: product.tags || '',
        color_variant: product.color_variant || '',
        regular_price: product.regular_price || 0,
        sale_price: product.sale_price,
        cost_price: product.cost_price || 0,
        image_url_1: product.image_url_1 || '',
        image_url_2: product.image_url_2 || null,
        image_url_3: product.image_url_3 || null,
        stock: product.stock || 0,
        customizable: product.customizable || false,
        featured: product.featured || false,
      });
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    if (action === "update_product") {
      const { productId, product } = body;
      const { error } = await supabaseAdmin.from("products").update({
        product_name: product.product_name,
        short_description: product.short_description,
        long_description: product.long_description,
        brand: product.brand,
        category: product.category,
        subcategory: product.subcategory,
        tags: product.tags,
        color_variant: product.color_variant,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        cost_price: product.cost_price,
        image_url_1: product.image_url_1,
        image_url_2: product.image_url_2 || null,
        image_url_3: product.image_url_3 || null,
        stock: product.stock,
        customizable: product.customizable,
        featured: product.featured,
        updated_at: new Date().toISOString(),
      }).eq("id", productId);
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    if (action === "delete_product") {
      const { productId } = body;
      const { error } = await supabaseAdmin.from("products").delete().eq("id", productId);
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    // ---- Review Moderation ----

    if (action === "all_reviews") {
      const { data, error } = await supabaseAdmin
        .from("reviews")
        .select("id, user_id, order_id, product_id, rating, review_text, review_image_url, created_at, updated_at, is_visible")
        .order("created_at", { ascending: false });

      if (error) return json({ error: error.message }, 400);

      const userIds = [...new Set((data || []).map((r: any) => r.user_id))];
      let profileMap: Record<string, string> = {};

      if (userIds.length > 0) {
        const { data: profiles } = await supabaseAdmin
          .from("profiles")
          .select("id, full_name, email")
          .in("id", userIds);

        profileMap = (profiles || []).reduce((acc: Record<string, string>, p: any) => {
          acc[p.id] = p.full_name || p.email || "Anonymous";
          return acc;
        }, {});
      }

      const reviews = (data || []).map((r: any) => ({
        ...r,
        reviewer_name: profileMap[r.user_id] || "Anonymous",
      }));

      return json({ reviews });
    }

    if (action === "update_review_visibility") {
      const { reviewId, isVisible } = body;
      const { error } = await supabaseAdmin
        .from("reviews")
        .update({ is_visible: Boolean(isVisible), updated_at: new Date().toISOString() })
        .eq("id", reviewId);

      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    if (action === "delete_review") {
      const { reviewId } = body;
      const { error } = await supabaseAdmin.from("reviews").delete().eq("id", reviewId);
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});
