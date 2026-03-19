import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdmin() {
  const [loading, setLoading] = useState(false);

  const adminFetch = useCallback(async (action: string, extra: Record<string, any> = {}) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await supabase.functions.invoke('admin-data', {
        body: { action, ...extra },
      });

      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAdmin = useCallback(() => adminFetch('check_admin'), [adminFetch]);
  const getDashboardStats = useCallback(() => adminFetch('dashboard_stats'), [adminFetch]);
  const getAllOrders = useCallback(() => adminFetch('all_orders'), [adminFetch]);
  const getOrderDetail = useCallback((orderId: string) => adminFetch('order_detail', { orderId }), [adminFetch]);
  const updateOrder = useCallback((orderId: string, status?: string, payment_status?: string) =>
    adminFetch('update_order', { orderId, status, payment_status }), [adminFetch]);
  const getAllUsers = useCallback(() => adminFetch('all_users'), [adminFetch]);
  const promoteToAdmin = useCallback((userId: string) => adminFetch('promote_to_admin', { userId }), [adminFetch]);

  return { loading, adminFetch, checkAdmin, getDashboardStats, getAllOrders, getOrderDetail, updateOrder, getAllUsers, promoteToAdmin };
}
