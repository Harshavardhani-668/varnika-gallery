# 🚀 Quick Setup: Email Notifications (5 minutes)

## ✅ What's Done
- Frontend code deployed to Vercel (commit 744e390)
- Email function ready to deploy
- Admin panel updated with email controls
- Confirmation emails automatic on checkout

---

## 📋 SETUP (Just 3 Steps)

### STEP 1: Get Resend API Key (2 min)
1. Go: https://resend.com
2. Sign up (free)
3. Get API Token (copy starts with `re_`)

### STEP 2: Create Email Function in Supabase (2 min)
1. Open: https://app.supabase.com
2. Select: **ynlsxcpkcnleudavomkb** project
3. Go: **Edge Functions** → **Create new function**
4. Name: **send-order-email**
5. Replace code with contents from: `supabase/functions/send-order-email/index.ts`
6. Click: **Deploy**

### STEP 3: Add Secrets (1 min)
1. Click the **send-order-email** function
2. Click Settings (gear icon)
3. Under "Secrets" add:

```
RESEND_API_KEY = re_xxxxxxxxxxxx
APP_URL = https://varnika-gallery.vercel.app
```

**DONE!** ✨

---

## 📧 What Works Now

✅ Customers get email when they place order  
✅ Admins can send status updates (click mail icon)  
✅ Customers see: order number, items, total, tracking link  
✅ From: varnika.atelier@gmail.com

---

## 🧪 TEST IT

1. Place test order
2. Check email (check spam)
3. In Admin Orders, toggle mail icon + change status
4. Verify customer gets email

---

## Files Modified

```
✨ NEW:
  - supabase/functions/send-order-email/index.ts
  - src/hooks/useAdminOrders.ts
  - EMAIL_SETUP.md
  - DEPLOYMENT.md

📝 UPDATED:
  - src/pages/admin/AdminOrders.tsx
  - src/hooks/useOrders.ts
```

---

## 🎯 Email Triggers

| Event | Template | Recipient |
|-------|----------|-----------|
| Order Placed | Confirmation | Customer |
| Status → Processing | "Preparing items" | Customer |
| Status → Shipped | "On the way" | Customer |
| Status → Delivered | "Arrived! Review?" | Customer |

---

**Questions?** See `EMAIL_SETUP.md` for full details.
