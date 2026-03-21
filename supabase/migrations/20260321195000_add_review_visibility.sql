-- Add moderation visibility flag for customer-facing reviews
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT TRUE;

-- Backfill in case existing rows had NULL from older schemas
UPDATE public.reviews
SET is_visible = TRUE
WHERE is_visible IS NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_is_visible
ON public.reviews(is_visible);
