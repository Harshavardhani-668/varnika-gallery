import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface CartItem {
  customization_data: Json | null;
  id: string;
  is_custom: boolean;
  user_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export const useCart = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getCart = useCallback(async (): Promise<CartItem[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) { console.error('getCart error:', error); return []; }
    return (data || []) as CartItem[];
  }, []);

  const addToCart = useCallback(async (
    productId: string,
    productName: string,
    price: number,
    quantity: number = 1,
    productImage?: string,
    options?: {
      is_custom?: boolean;
      customization_data?: Json;
    }
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be logged in to add items to cart.', variant: 'destructive' });
      return { error: 'Not authenticated' };
    }
    setLoading(true);
    try {
      // Check if item exists
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            product_name: productName,
            product_image: productImage || null,
            quantity,
            price,
            is_custom: options?.is_custom === true,
            customization_data: options?.customization_data || null,
          });
        if (error) throw error;
      }

      toast({ title: 'Added to cart!', description: `${productName} has been added to your cart.` });
      return { error: null };
    } catch (error: any) {
      console.error('addToCart error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
    setLoading(true);
    try {
      if (quantity <= 0) return await removeFromCart(itemId);
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', itemId);
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('updateCartItem error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const removeFromCart = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
      if (error) throw error;
      toast({ title: 'Removed from cart', description: 'Item has been removed from your cart.' });
      return { error: null };
    } catch (error: any) {
      console.error('removeFromCart error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const clearCart = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };
    setLoading(true);
    try {
      const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('clearCart error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { loading, getCart, addToCart, updateCartItem, removeFromCart, clearCart };
};
