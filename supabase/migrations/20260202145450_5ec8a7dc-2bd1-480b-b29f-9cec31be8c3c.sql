-- Create reviews table
CREATE TABLE public.reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(order_id) -- One review per order
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Customers can create reviews for their own delivered orders
CREATE POLICY "Customers can create reviews for their delivered orders"
ON public.reviews
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_id
        AND orders.status = 'delivered'
        AND orders.customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
);

-- Customers can view their own reviews
CREATE POLICY "Customers can view their own reviews"
ON public.reviews
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_id
        AND orders.customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
);

-- Staff can view all reviews
CREATE POLICY "Staff can view all reviews"
ON public.reviews
FOR SELECT
USING (is_staff(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for reviews
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;