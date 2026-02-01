import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Order, OrderStatus } from './useOrders';

export function useCustomerOrders() {
  return useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    }
  });
}

export function useCustomerOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Não autenticado');

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .eq('customer_email', user.email)
          .maybeSingle();
        
        if (error) throw error;
        setOrder(data as Order | null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();

    // Subscribe to realtime updates for this order
    const channel = supabase
      .channel(`order-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`
        },
        (payload) => {
          setOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { order, isLoading, error };
}

export function useRealtimeCustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setOrders(data as Order[]);
      }
      setIsLoading(false);

      // Subscribe to realtime updates
      const channel = supabase
        .channel('customer-orders-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          async (payload) => {
            // Refetch to ensure we only show customer's orders
            const { data: refreshedData } = await supabase
              .from('orders')
              .select('*')
              .eq('customer_email', user.email)
              .order('created_at', { ascending: false });
            
            if (refreshedData) {
              setOrders(refreshedData as Order[]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    fetchOrders();
  }, []);

  return { orders, isLoading };
}
