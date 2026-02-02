import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  order_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export function useOrderReview(orderId: string) {
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!orderId) return;

    const fetchReview = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching review:', error);
      } else {
        setReview(data);
      }
      setIsLoading(false);
    };

    fetchReview();

    // Subscribe to changes
    const channel = supabase
      .channel(`review-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setReview(payload.new as Review);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const submitReview = async (rating: number, comment: string) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          order_id: orderId,
          rating,
          comment: comment.trim() || null,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Avaliação já existe',
            description: 'Você já avaliou este pedido.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
      } else {
        setReview(data);
        toast({
          title: 'Avaliação enviada!',
          description: 'Obrigado pelo seu feedback.',
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Erro ao enviar avaliação',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { review, isLoading, isSubmitting, submitReview };
}
