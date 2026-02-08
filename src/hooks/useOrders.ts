import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  created_at: string;
}

// Local storage-based orders (no Supabase tables needed)
const ORDERS_KEY = 'varnika_orders';
const ORDER_ITEMS_KEY = 'varnika_order_items';

function loadOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function loadOrderItems(): OrderItem[] {
  try {
    const stored = localStorage.getItem(ORDER_ITEMS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const useOrders = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getOrders = useCallback(async (): Promise<Order[]> => {
    return loadOrders();
  }, []);

  const getOrderItems = useCallback(async (orderId: string): Promise<OrderItem[]> => {
    return loadOrderItems().filter(item => item.order_id === orderId);
  }, []);

  const createOrder = useCallback(async (
    items: { product_id: string; product_name: string; product_image?: string; quantity: number; price: number }[],
    shippingAddress: any
  ) => {
    setLoading(true);
    try {
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const orderNumber = `ORD-${Date.now()}`;
      const orderId = crypto.randomUUID();

      const order: Order = {
        id: orderId,
        order_number: orderNumber,
        total_amount: totalAmount,
        status: 'pending',
        shipping_address: shippingAddress,
        payment_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const orderItems: OrderItem[] = items.map(item => ({
        id: crypto.randomUUID(),
        order_id: orderId,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image || null,
        quantity: item.quantity,
        price: item.price,
        created_at: new Date().toISOString(),
      }));

      const existingOrders = loadOrders();
      existingOrders.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(existingOrders));

      const existingItems = loadOrderItems();
      existingItems.push(...orderItems);
      localStorage.setItem(ORDER_ITEMS_KEY, JSON.stringify(existingItems));

      toast({
        title: 'Order placed!',
        description: `Your order ${orderNumber} has been placed successfully.`,
      });

      return { error: null, order };
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { loading, getOrders, getOrderItems, createOrder };
};