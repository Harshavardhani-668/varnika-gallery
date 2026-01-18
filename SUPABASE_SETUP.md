# Supabase Setup Instructions

## Database Migration

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migration file: `supabase/migrations/20260118000000_create_user_tables.sql`

This will create:
- `profiles` table for user information
- `cart_items` table for shopping cart
- `orders` table for order management
- `order_items` table for order details
- Row Level Security policies
- Automatic user profile creation trigger

## Google OAuth Setup

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list and click to configure
4. Enable Google provider
5. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
   
### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth Client ID**
5. Configure OAuth consent screen if not done
6. Select **Web application** as application type
7. Add Authorized redirect URIs:
   - `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
8. Copy Client ID and Client Secret to Supabase

## Environment Variables

Make sure your `.env` file contains:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

## Testing Authentication

1. Try signing up with email/password
2. Check your email for confirmation link
3. Try signing in with Google OAuth
4. Test adding items to cart
5. Test placing an order

## Features Implemented

✅ Email/Password Authentication
✅ Google OAuth Login
✅ User Profile Management
✅ Shopping Cart (Add, Update, Remove items)
✅ Order Management
✅ Order History
✅ Row Level Security (users can only access their own data)

## Database Schema

### profiles
- `id` (UUID, references auth.users)
- `email` (TEXT)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- Timestamps

### cart_items
- `id` (UUID)
- `user_id` (UUID, references auth.users)
- `product_id` (TEXT)
- `product_name` (TEXT)
- `product_image` (TEXT)
- `quantity` (INTEGER)
- `price` (DECIMAL)
- Timestamps

### orders
- `id` (UUID)
- `user_id` (UUID, references auth.users)
- `order_number` (TEXT, unique)
- `total_amount` (DECIMAL)
- `status` (TEXT: pending, processing, completed, cancelled)
- `shipping_address` (JSONB)
- `payment_status` (TEXT)
- Timestamps

### order_items
- `id` (UUID)
- `order_id` (UUID, references orders)
- `product_id` (TEXT)
- `product_name` (TEXT)
- `product_image` (TEXT)
- `quantity` (INTEGER)
- `price` (DECIMAL)
- Timestamp
