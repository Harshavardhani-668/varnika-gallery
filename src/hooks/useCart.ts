import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

// Local storage-based cart (no Supabase tables needed)
const CART_KEY = 'varnika_cart';

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export const useCart = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getCart = useCallback(async (): Promise<CartItem[]> => {
    return loadCart();
  }, []);

  const addToCart = useCallback(async (
    productId: string,
    productName: string,
    price: number,
    quantity: number = 1,
    productImage?: string
  ) => {
    setLoading(true);
    try {
      const cart = loadCart();
      const existingIndex = cart.findIndex(item => item.product_id === productId);

      if (existingIndex >= 0) {
        cart[existingIndex].quantity += quantity;
        cart[existingIndex].updated_at = new Date().toISOString();
      } else {
        cart.push({
          id: crypto.randomUUID(),
          product_id: productId,
          product_name: productName,
          product_image: productImage || null,
          quantity,
          price,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      saveCart(cart);
      toast({
        title: 'Added to cart!',
        description: `${productName} has been added to your cart.`,
      });
      return { error: null };
    } catch (error: any) {
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
      const cart = loadCart();
      const index = cart.findIndex(item => item.id === itemId);
      if (index >= 0) {
        cart[index].quantity = quantity;
        cart[index].updated_at = new Date().toISOString();
        saveCart(cart);
      }
      return { error: null };
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const removeFromCart = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      const cart = loadCart().filter(item => item.id !== itemId);
      saveCart(cart);
      toast({ title: 'Removed from cart', description: 'Item has been removed from your cart.' });
      return { error: null };
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const clearCart = useCallback(async () => {
    setLoading(true);
    try {
      saveCart([]);
      return { error: null };
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { loading, getCart, addToCart, updateCartItem, removeFromCart, clearCart };
};