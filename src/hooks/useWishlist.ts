import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  added_at: string;
}

const WISHLIST_KEY = 'varnika_wishlist';

function loadWishlist(): WishlistItem[] {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items: WishlistItem[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

export const useWishlist = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>(loadWishlist);

  // Sync state when localStorage changes (other tabs)
  useEffect(() => {
    const handler = () => setItems(loadWishlist());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.product_id === productId);
  }, [items]);

  const toggleWishlist = useCallback((
    productId: string,
    productName: string,
    price: number,
    productImage?: string
  ) => {
    setItems(prev => {
      const exists = prev.some(item => item.product_id === productId);
      let updated: WishlistItem[];

      if (exists) {
        updated = prev.filter(item => item.product_id !== productId);
        toast({ title: 'Removed from wishlist', description: `${productName} removed.` });
      } else {
        updated = [...prev, {
          id: crypto.randomUUID(),
          product_id: productId,
          product_name: productName,
          product_image: productImage || null,
          price,
          added_at: new Date().toISOString(),
        }];
        toast({ title: 'Added to wishlist!', description: `${productName} saved to your wishlist.` });
      }

      saveWishlist(updated);
      return updated;
    });
  }, [toast]);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.product_id !== productId);
      saveWishlist(updated);
      return updated;
    });
  }, []);

  const getWishlist = useCallback(() => items, [items]);

  return { items, isInWishlist, toggleWishlist, removeFromWishlist, getWishlist, count: items.length };
};
