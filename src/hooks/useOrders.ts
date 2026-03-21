import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  shipping_address: any;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  customization_data: Json | null;
  id: string;
  is_custom: boolean;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  created_at: string;
}

export const useOrders = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getOrders = useCallback(async (): Promise<Order[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) { console.error('getOrders error:', error); return []; }
    return (data || []) as Order[];
  }, []);

  const getOrderItems = useCallback(async (orderId: string): Promise<OrderItem[]> => {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    if (error) { console.error('getOrderItems error:', error); return []; }
    return (data || []) as OrderItem[];
  }, []);

  const createOrder = useCallback(async (
    items: {
      product_id: string;
      product_name: string;
      product_image?: string;
      quantity: number;
      price: number;
      is_custom?: boolean;
      customization_data?: Json | null;
    }[],
    shippingAddress: any
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be logged in to place an order.', variant: 'destructive' });
      return { error: 'Not authenticated', order: null };
    }

    setLoading(true);
    try {
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const orderNumber = `ORD-${Date.now()}`;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: totalAmount,
          status: 'pending',
          shipping_address: shippingAddress,
          payment_status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image || null,
        quantity: item.quantity,
        price: item.price,
        is_custom: item.is_custom === true,
        customization_data: item.customization_data || null,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // Get user profile for email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', user.id)
        .single();

      // Send confirmation email
      if (profile?.email) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-email`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session?.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'order_confirmation',
              orderNumber,
              customerEmail: profile.email,
              customerName: profile.full_name || 'Valued Customer',
              items,
              total: totalAmount,
            }),
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
        }
      }

      toast({
        title: 'Thank you for your order!',
        description: `Order ${orderNumber} is confirmed. You can track live progress in My Orders.`,
      });

      return { error: null, order };
    } catch (error: any) {
      console.error('createOrder error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error: error.message, order: null };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { loading, getOrders, getOrderItems, createOrder };
};
