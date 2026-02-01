-- Add RLS policy for customers to view their own orders by email
CREATE POLICY "Customers can view their own orders by email" 
ON public.orders 
FOR SELECT 
USING (
  customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Enable realtime for orders table so customers can track status changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;