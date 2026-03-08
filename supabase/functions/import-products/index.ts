import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxSs1egVeB7AQkWt8ijyl9Zwt34sMW3DaJDk1NyCUBBBB_D9aKY5pPKe7luO3pAIBGmKg/exec";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch from Google Sheets
    const response = await fetch(SHEET_API_URL);
    if (!response.ok) throw new Error("Failed to fetch from Google Sheets");
    const products = await response.json();

    console.log(`Fetched ${products.length} products from Google Sheets`);

    // Map and upsert into Supabase
    const rows = products.map((p: any) => ({
      product_id: String(p["Product ID"] || ""),
      product_name: String(p["Product Name"] || ""),
      short_description: String(p["Short Description"] || ""),
      long_description: String(p["Long Description"] || ""),
      brand: String(p["Brand"] || "Varnika"),
      model_number: String(p["Model Number"] || ""),
      category: String(p["Category"] || ""),
      subcategory: String(p["Subcategory"] || ""),
      tags: String(p["Tags/Keywords"] || ""),
      color_variant: String(p["Color/Variant"] || ""),
      regular_price: Number(p["Regular Price"]) || 0,
      sale_price: p["Sale Price"] ? Number(p["Sale Price"]) : null,
      cost_price: Number(p["Cost Price"]) || 0,
      image_url_1: String(p["Image URL 1"] || ""),
      image_url_2: p["Image URL 2"] ? String(p["Image URL 2"]) : null,
      image_url_3: p["Image URL 3"] ? String(p["Image URL 3"]) : null,
      stock: Number(p["Stock"]) || 0,
      rating: Number(p["Rating"]) || 0,
      review_count: Number(p["Review Count"]) || 0,
      customizable: p["Customizable"] === true || String(p["Customizable"]).toUpperCase() === "TRUE",
      featured: p["Featured"] === true || String(p["Featured"]).toUpperCase() === "TRUE",
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("products")
      .upsert(rows, { onConflict: "product_id" });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, imported: rows.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Import error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
