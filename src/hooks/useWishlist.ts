import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  added_at: string;
}

export const useWishlist = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setItems([]); return; }
    const { data, error } = await supabase
      .from('wishlists')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });
    if (!error && data) setItems(data as WishlistItem[]);
  }, []);

  useEffect(() => {
    loadWishlist();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadWishlist();
    });
    return () => subscription.unsubscribe();
  }, [loadWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.product_id === productId);
  }, [items]);

  const toggleWishlist = useCallback(async (
    productId: string,
    productName: string,
    price: number,
    productImage?: string
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be logged in to save items.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const exists = items.some(item => item.product_id === productId);
      if (exists) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) throw error;
        toast({ title: 'Removed from wishlist', description: `${productName} removed.` });
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            product_id: productId,
            product_name: productName,
            product_image: productImage || null,
            price,
          });
        if (error) throw error;
        toast({ title: 'Added to wishlist!', description: `${productName} saved to your wishlist.` });
      }
      await loadWishlist();
    } catch (error: any) {
      console.error('toggleWishlist error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [items, toast, loadWishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', productId);
    await loadWishlist();
  }, [loadWishlist]);

  const getWishlist = useCallback(() => items, [items]);

  return { items, loading, isInWishlist, toggleWishlist, removeFromWishlist, getWishlist, count: items.length };
};
