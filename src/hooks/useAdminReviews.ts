import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ReviewWithOrder {
  id: string;
  order_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  order: {
    order_number: string;
    customer_name: string;
    customer_email: string;
    product_name: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  distribution: Record<number, number>;
}

export function useAdminReviews() {
  const [reviews, setReviews] = useState<ReviewWithOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  const fetchReviews = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        order_id,
        rating,
        comment,
        created_at,
        order:orders!inner(
          order_number,
          customer_name,
          customer_email,
          product_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      setIsLoading(false);
      return;
    }

    const formattedReviews = (data || []).map((item: any) => ({
      id: item.id,
      order_id: item.order_id,
      rating: item.rating,
      comment: item.comment,
      created_at: item.created_at,
      order: {
        order_number: item.order.order_number,
        customer_name: item.order.customer_name,
        customer_email: item.order.customer_email,
        product_name: item.order.product_name,
      },
    }));

    setReviews(formattedReviews);

    // Calculate stats
    const totalReviews = formattedReviews.length;
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    formattedReviews.forEach((review) => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
      totalRating += review.rating;
    });

    setStats({
      totalReviews,
      averageRating: totalReviews > 0 ? totalRating / totalReviews : 0,
      distribution,
    });

    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();

    // Subscribe to changes
    const channel = supabase
      .channel('admin-reviews')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
        },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { reviews, stats, isLoading, refetch: fetchReviews };
}
