import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface AdminOrder {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  payment_status: 'pending' | 'paid' | 'failed';
  shipping_address: any;
  created_at: string;
  updated_at: string;
  order_items?: any[];
}

export const useAdminOrders = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateOrderStatus = useCallback(async (
    orderId: string,
    newStatus: 'pending' | 'processing' | 'shipped' | 'delivered',
    sendEmail: boolean = true
  ) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'update_order',
            orderId,
            status: newStatus,
            sendEmail,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update order');

      const data = await response.json();

      toast({
        title: 'Order Updated',
        description: `Order status changed to ${newStatus}${sendEmail ? ' and customer notified' : ''}`,
      });

      return { error: null, data };
    } catch (error: any) {
      console.error('updateOrderStatus error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error: error.message, data: null };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateOrderPaymentStatus = useCallback(async (
    orderId: string,
    paymentStatus: 'pending' | 'paid' | 'failed',
    newOrderStatus?: string
  ) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'update_order',
            orderId,
            payment_status: paymentStatus,
            status: newOrderStatus,
            sendEmail: !!newOrderStatus,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update payment status');

      toast({
        title: 'Payment Status Updated',
        description: `Payment marked as ${paymentStatus}`,
      });

      return { error: null };
    } catch (error: any) {
      console.error('updateOrderPaymentStatus error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { loading, updateOrderStatus, updateOrderPaymentStatus };
};
