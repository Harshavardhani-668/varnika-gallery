
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL UNIQUE,
  product_name TEXT NOT NULL,
  short_description TEXT DEFAULT '',
  long_description TEXT DEFAULT '',
  brand TEXT DEFAULT 'Varnika',
  model_number TEXT DEFAULT '',
  category TEXT DEFAULT '',
  subcategory TEXT DEFAULT '',
  tags TEXT DEFAULT '',
  color_variant TEXT DEFAULT '',
  regular_price NUMERIC NOT NULL DEFAULT 0,
  sale_price NUMERIC,
  cost_price NUMERIC DEFAULT 0,
  image_url_1 TEXT NOT NULL DEFAULT '',
  image_url_2 TEXT,
  image_url_3 TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  customizable BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable (it's an e-commerce catalog)
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT TO anon, authenticated
  USING (true);

-- Only admins can modify products
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
