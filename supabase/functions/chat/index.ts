import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { message } = await req.json();

    // Fetch products from Google Sheets to provide context
    let productContext = "";
    try {
      const productsResponse = await fetch(SHEET_API_URL);
      if (productsResponse.ok) {
        const products = await productsResponse.json();
        productContext = products.slice(0, 20).map((p: any) => 
          `- ${p["Product Name"]}: ${p["Short Description"]} | Category: ${p["Category"]} | Price: ₹${p["Regular Price"]}${p["Sale Price"] ? ` (Sale: ₹${p["Sale Price"]})` : ""} | ${p["Customizable"] === true || p["Customizable"] === "TRUE" ? "Customizable" : ""}`
        ).join("\n");
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }

    const systemPrompt = `You are the virtual curator for Varnika - "Art That Holds Your Stories". We are a premium handmade art gallery selling unique, handcrafted pieces.

Your personality:
- Warm, knowledgeable, and passionate about art
- You speak eloquently but accessibly
- You help customers find pieces that resonate with their stories
- You're familiar with traditional Indian art techniques and modern interpretations

Our current catalog:
${productContext || "Our collection features handmade paintings, sculptures, textiles, and ceramics from artisans across India."}

Guidelines:
- Help users find the right piece based on their preferences, space, or occasion
- Explain the artistry and story behind pieces when relevant
- If asked about customization, let them know they can contact us via WhatsApp
- For pricing or availability, refer to the catalog above
- Keep responses concise but meaningful (2-3 sentences unless more detail is requested)
- If asked about topics unrelated to art or our gallery, politely redirect the conversation`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I apologize, I'm having trouble responding. Please try again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process request",
        reply: "I apologize, I'm having a moment. Please try again shortly."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
