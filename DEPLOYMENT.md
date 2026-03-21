# Deployment Instructions for Email Notifications

## Status: Ready to Deploy ✅

All code has been committed and pushed to the main branch. Email notification system is implemented and ready for deployment.

---

## Quick Deployment Steps

### Step 1: Deploy Frontend (Automatic)
✅ **Already Done** - Commit 744e390 pushed to main branch
- Vercel will auto-deploy within 2-3 minutes
- Check deployment status at: https://vercel.com/dashboard

### Step 2: Deploy Edge Function (Manual)

#### Option A: Via Supabase Dashboard (Recommended)

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select project: **ynlsxcpkcnleudavomkb**
3. Go to **Edge Functions**
4. Click **Create a new function**
5. Name it: `send-order-email`
6. Copy contents from: `supabase/functions/send-order-email/index.ts`
7. Paste the code into the editor
8. Click **Deploy**

#### Option B: Via Supabase CLI (if Docker is running)

```bash
npx supabase functions deploy send-order-email
```

---

### Step 3: Configure Secrets

1. In Supabase Dashboard, select the **send-order-email** function
2. Click **Settings** (gear icon)
3. Under "Secrets", add:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
APP_URL=https://varnika-gallery.vercel.app
```

**Note:** Get RESEND_API_KEY from [Resend Dashboard](https://resend.com/api-tokens)

---

### Step 4: Verify Deployment

1. Go to Edge Functions list
2. Look for `send-order-email`
3. Status should show: **ACTIVE** ✓
4. Test by placing an order on the website

---

## What's New

### Frontend Changes (auto-deployed via Vercel):
- ✅ Order confirmation email sent on checkout
- ✅ Admin Orders page with email notification toggle
- ✅ New useAdminOrders hook for email-enabled status updates
- ✅ Updated useOrders hook to send confirmation emails

### Backend Changes (need manual deployment):
- 📦 New Edge Function: `send-order-email`
- 📧 Email templates for: confirmation, processing, shipped, delivered
- 🔗 Integration with Resend for email delivery

---

## Email Sender

**From:** varnika.atelier@gmail.com

This is the sender email address on all order notifications. Customers will reply to this email if they have questions.

---

## Testing Checklist

After deployment:

- [ ] Place test order → Check email for confirmation
- [ ] Admin updates status to "processing" → Email sent to customer
- [ ] Admin updates status to "shipped" → Email sent with encouragement
- [ ] Admin updates status to "delivered" → Email sent with thank you message
- [ ] Check that emails appear in customer inbox (not spam)
- [ ] Verify order number and details are correct in emails
- [ ] Test with multiple customer emails (test different email providers)

---

## Troubleshooting

### Function not deploying?
1. Clear browser cache and reload Supabase Dashboard
2. Try creating function with simpler name: `email`
3. Check browser console for errors

### Emails not sending?
1. Verify RESEND_API_KEY is correct and active
2. Check Edge Function logs for errors
3. Ensure customer has valid email in database
4. Check spam folder in test email account

### CORS errors?
- Already configured in Edge Function with open CORS headers
- Should work cross-origin

---

## Timeline

- **Frontend**: Deployed via Vercel (auto)
- **Backend**: Pending manual Edge Function deployment
- **Emails**: Ready once secrets are configured

**Estimated completion:** ~30 minutes (once manual steps complete)

---

## Next Steps

1. Get Resend API key (free at resend.com)
2. Deploy send-order-email function via Supabase Dashboard
3. Add RESEND_API_KEY and APP_URL secrets
4. Test by placing an order
5. Verify email received
6. Done! ✨

---

**Support Files:**
- [EMAIL_SETUP.md](../EMAIL_SETUP.md) - Full setup guide
- Implementation files:
  - `supabase/functions/send-order-email/index.ts` - Email function
  - `src/hooks/useAdminOrders.ts` - Admin order management with emails
  - `src/pages/admin/AdminOrders.tsx` - Enhanced orders page
  - `src/hooks/useOrders.ts` - Updated with confirmation emails
