-- Add customization metadata support without breaking existing order flow
ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS customization_data JSONB;

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS customization_data JSONB;

CREATE INDEX IF NOT EXISTS idx_cart_items_is_custom ON public.cart_items(is_custom);
CREATE INDEX IF NOT EXISTS idx_order_items_is_custom ON public.order_items(is_custom);
