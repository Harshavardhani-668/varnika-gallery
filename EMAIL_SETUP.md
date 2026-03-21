# Email Notifications Setup Guide

## Overview
This guide walks through setting up email notifications for orders in Varnika Gallery. Emails are sent automatically when:
1. **Order Confirmation** - When customer places an order
2. **Order Status Updates** - When admin changes order status (processing, shipped, delivered)

---

## Step 1: Get Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Create a free account or sign in
3. Go to **API Tokens** section
4. Create a new API token
5. Copy the token (starts with `re_`)

---

## Step 2: Configure Supabase Edge Function Secrets

### Via Supabase Dashboard:

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select project: **ynlsxcpkcnleudavomkb**
3. Go to **Edge Functions** → **send-order-email**
4. Click **Settings** (gear icon)
5. Under "Secrets", add:

| Key | Value |
|-----|-------|
| RESEND_API_KEY | re_xxxxxxxxxxxxx (your token) |
| APP_URL | https://varnika-gallery.vercel.app |

### Via CLI (Alternative):

```bash
npx supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
npx supabase secrets set APP_URL=https://varnika-gallery.vercel.app
```

---

## Step 3: Email Settings

**From Email:** `varnika.atelier@gmail.com`

### Email Templates Available:

#### Order Confirmation Email
- Triggers when: Order is placed
- Includes: Order summary, items, total, tracking link
- Recipient: Customer email

#### Order Status Update Emails
- **Processing**: "We're carefully packing your items"
- **Shipped**: "Your order is on its way!"
- **Delivered**: "Your order has arrived!"
- Recipients: Customers whose orders changed status

---

## Step 4: Using Email Notifications

### For Customers:
- ✅ Automatic - No action needed
- Confirmation email sent when order placed
- Status update emails sent automatically when admin changes status

### For Admins:
1. Go to **Admin Dashboard** → **Orders**
2. Click the **📧 Mail icon** next to order status
3. Select new status from dropdown
4. Update will send status email to customer

---

## Step 5: Testing

### Test Order Confirmation:
1. Place a test order with valid email
2. Check email (spam folder if using Gmail)
3. Verify: Order number, items, total amount visible

### Test Status Updates:
1. Go to Admin Orders page
2. Toggle mail icon (should be highlighted)
3. Change status to "processing" → "shipped" → "delivered"
4. Check customer email for each status change
5. Verify: Personalized message, order number, update time

---

## Troubleshooting

### Emails not sending?

1. **Check RESEND_API_KEY is set:**
   ```bash
   npx supabase secrets list
   ```

2. **Check Edge Function logs:**
   - Supabase Dashboard → Edge Functions → send-order-email → Logs

3. **Verify Resend API Key:**
   - Make sure token starts with `re_`
   - Check token is active in Resend dashboard

4. **Check email address:**
   - Verify customer has valid email in profile
   - Some Gmail addresses might filter emails as spam

### Function returning 500 error?
- Check that APP_URL is set correctly (no trailing slash)
- Verify RESEND_API_KEY format
- Check Edge Function logs for specific error

---

## Email Content Customization

To modify email templates, edit:
```
supabase/functions/send-order-email/index.ts
```

Templates are in functions:
- `getOrderConfirmationEmail()` - Confirmation email HTML
- `getOrderStatusEmail()` - Status update email HTML

---

## Support

For issues with:
- **Resend integration**: Check [Resend docs](https://resend.com/docs)
- **Supabase Edge Functions**: Check [Supabase docs](https://supabase.com/docs/guides/functions)
- **Email deliverability**: Check sender reputation on [Resend dashboard](https://resend.com/dashboard)

---

**Last Updated:** March 21, 2026
**Status:** ✅ Production Ready
