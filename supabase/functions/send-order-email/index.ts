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

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "varnika.atelier@gmail.com";

interface EmailTemplate {
  subject: string;
  html: string;
}

function getOrderConfirmationEmail(orderNumber: string, customerName: string, items: any[], total: number): EmailTemplate {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; text-align: left;">${item.product_name}</td>
          <td style="padding: 12px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return {
    subject: `Order Confirmation: ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #d4af37 0%, #f0e68c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 20px; }
            .order-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .order-info p { margin: 8px 0; }
            .label { font-weight: bold; color: #d4af37; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #d4af37; color: white; padding: 12px; text-align: left; }
            .total-row { background: #f5f5f5; font-weight: bold; font-size: 16px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; margin-top: 20px; }
            .cta-button { display: inline-block; background: #d4af37; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Order Confirmed!</h1>
              <p>Thank you for shopping with Varnika Gallery</p>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p>Your order has been successfully placed! We're thrilled you chose Varnika Gallery for your special moments.</p>
              
              <div class="order-info">
                <p><span class="label">Order Number:</span> ${orderNumber}</p>
                <p><span class="label">Status:</span> <span style="color: #ff9800;">Pending</span></p>
                <p><span class="label">Order Date:</span> ${new Date().toLocaleDateString()}</p>
              </div>

              <h3 style="color: #d4af37; margin-top: 25px;">Order Summary</h3>
              <table>
                <tr>
                  <th style="width: 50%;">Product</th>
                  <th style="width: 15%;">Quantity</th>
                  <th style="width: 35%;">Price</th>
                </tr>
                ${itemsHtml}
                <tr class="total-row">
                  <td colspan="2" style="padding: 12px;">Total Amount</td>
                  <td style="padding: 12px; text-align: right; color: #d4af37;">₹${total.toFixed(2)}</td>
                </tr>
              </table>

              <p style="color: #666; line-height: 1.6;">
                <strong>What happens next?</strong><br>
                • We'll prepare your order with utmost care<br>
                • You'll receive a shipping notification once dispatched<br>
                • Track your order anytime in "My Orders"<br>
              </p>

              <center>
                <a href="${Deno.env.get("APP_URL") || "https://varnika-gallery.vercel.app"}/orders" class="cta-button">Track Your Order</a>
              </center>

              <p style="color: #666; font-size: 14px; margin-top: 25px;">
                Have questions? Reply to this email or contact us at <strong>varnika.atelier@gmail.com</strong>
              </p>
            </div>
            <div class="footer">
              <p>© 2026 Varnika Gallery. All rights reserved.</p>
              <p>This is an automated message. Please do not reply with sensitive information.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

function getOrderStatusEmail(orderNumber: string, customerName: string, status: string): EmailTemplate {
  const statusMap: Record<string, { title: string; message: string; color: string }> = {
    processing: {
      title: "🎁 Your Order is Being Prepared",
      message: "We're carefully packing your beautiful items with love. Your order will be shipped soon!",
      color: "#2196F3",
    },
    shipped: {
      title: "📦 Your Order Has Shipped!",
      message: "Your order is on its way! You'll receive it soon. Track the shipment in your My Orders section.",
      color: "#4CAF50",
    },
    delivered: {
      title: "✨ Your Order Has Arrived!",
      message: "We hope you love your Varnika Gallery pieces! Please share your love on social media. ❤️",
      color: "#4CAF50",
    },
    pending: {
      title: "⏳ Order Received",
      message: "Thank you for your order! We're getting everything ready for you.",
      color: "#FF9800",
    },
  };

  const info = statusMap[status.toLowerCase()] || statusMap.pending;

  return {
    subject: `Order ${orderNumber} - ${info.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, ${info.color} 0%, ${info.color}cc 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 26px; }
            .content { padding: 20px; }
            .status-box { background: #f5f5f5; border-left: 4px solid ${info.color}; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .order-number { font-size: 14px; color: #999; margin-top: 10px; }
            .message { font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; margin-top: 20px; }
            .cta-button { display: inline-block; background: ${info.color}; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${info.title}</h1>
              <p class="order-number">Order ${orderNumber}</p>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              
              <div class="status-box">
                <p style="margin: 0; font-size: 16px; color: #333;">${info.message}</p>
              </div>

              <p style="color: #666; line-height: 1.6;">
                <strong>Order Details:</strong><br>
                Order Number: <span style="font-family: monospace; background: #f5f5f5; padding: 0 5px;">${orderNumber}</span><br>
                Updated: ${new Date().toLocaleString()}
              </p>

              <center>
                <a href="${Deno.env.get("APP_URL") || "https://varnika-gallery.vercel.app"}/orders" class="cta-button">View Order Details</a>
              </center>

              <p style="color: #666; font-size: 14px; margin-top: 25px;">
                Questions? Email us at <strong>varnika.atelier@gmail.com</strong><br>
                We're here to help! 💌
              </p>
            </div>
            <div class="footer">
              <p>© 2026 Varnika Gallery. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: to,
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return false;
    }

    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const { action, orderNumber, customerEmail, customerName, items, total, status } = body;

    if (action === "order_confirmation") {
      const template = getOrderConfirmationEmail(orderNumber, customerName, items, total);
      const success = await sendEmail(customerEmail, template.subject, template.html);
      return json({ success, message: success ? "Email sent" : "Failed to send email" });
    }

    if (action === "order_status_update") {
      const template = getOrderStatusEmail(orderNumber, customerName, status);
      const success = await sendEmail(customerEmail, template.subject, template.html);
      return json({ success, message: success ? "Status email sent" : "Failed to send email" });
    }

    return json({ error: "Invalid action" }, 400);
  } catch (error: any) {
    console.error("Error:", error);
    return json({ error: error.message }, 500);
  }
});
