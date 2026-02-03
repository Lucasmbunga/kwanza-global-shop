-- Drop existing problematic policies
DROP POLICY IF EXISTS "Customers can view their own orders by email" ON public.orders;
DROP POLICY IF EXISTS "Customers can create reviews for their delivered orders" ON public.reviews;
DROP POLICY IF EXISTS "Customers can view their own reviews" ON public.reviews;

-- Recreate policies using auth.jwt() instead of querying auth.users table
CREATE POLICY "Customers can view their own orders by email"
ON public.orders
FOR SELECT
TO authenticated
USING (customer_email = (auth.jwt() ->> 'email')::text);

CREATE POLICY "Customers can create reviews for their delivered orders"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.id = reviews.order_id
      AND orders.status = 'delivered'::order_status
      AND orders.customer_email = (auth.jwt() ->> 'email')::text
  )
);

CREATE POLICY "Customers can view their own reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.id = reviews.order_id
      AND orders.customer_email = (auth.jwt() ->> 'email')::text
  )
);