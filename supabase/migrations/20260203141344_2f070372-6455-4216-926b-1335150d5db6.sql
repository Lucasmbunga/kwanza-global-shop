-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_usd NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can view active products
CREATE POLICY "Anyone can view active products"
ON public.products
FOR SELECT
USING (is_active = true);

-- Staff can view all products
CREATE POLICY "Staff can view all products"
ON public.products
FOR SELECT
TO authenticated
USING (is_staff(auth.uid()));

-- Staff can insert products
CREATE POLICY "Staff can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (is_staff(auth.uid()));

-- Staff can update products
CREATE POLICY "Staff can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (is_staff(auth.uid()));

-- Staff can delete products
CREATE POLICY "Staff can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (is_staff(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();