import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  shipping_address: any;
}

interface OrderItem {
  id: string;
  is_custom: boolean;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
}

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [orderCustomFlags, setOrderCustomFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadOrders();
    else setLoading(false);
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
    if (data) {
      const loadedOrders = data as Order[];
      setOrders(loadedOrders);

      const orderIds = loadedOrders.map((order) => order.id);
      if (orderIds.length > 0) {
        const { data: orderItemFlags } = await supabase
          .from('order_items')
          .select('order_id, is_custom')
          .in('order_id', orderIds);

        if (orderItemFlags) {
          const nextFlags: Record<string, boolean> = {};
          for (const row of orderItemFlags as { order_id: string; is_custom: boolean }[]) {
            if (row.is_custom) {
              nextFlags[row.order_id] = true;
            } else if (!(row.order_id in nextFlags)) {
              nextFlags[row.order_id] = false;
            }
          }
          setOrderCustomFlags(nextFlags);
        }
      }
    }
    setLoading(false);
  };

  const loadOrderItems = async (orderId: string) => {
    if (orderItems[orderId]) {
      setExpandedOrder(expandedOrder === orderId ? null : orderId);
      return;
    }
    const { data } = await supabase.from('order_items').select('*').eq('order_id', orderId);
    if (data) {
      setOrderItems(prev => ({ ...prev, [orderId]: data as OrderItem[] }));
      setExpandedOrder(orderId);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 px-4 text-center">
          <Package className="w-16 h-16 text-muted mx-auto mb-4" />
          <h1 className="font-display text-3xl text-foreground mb-4">Sign in to view orders</h1>
          <Link to="/login?redirect=/orders"><Button variant="artisan">Sign In</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-4">
        <div className="varnika-container max-w-3xl mx-auto">
          <h1 className="font-display text-4xl text-foreground mb-8">My Orders</h1>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : orders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="w-16 h-16 text-muted mx-auto mb-4" />
                <h2 className="font-display text-2xl text-foreground mb-2">No orders yet</h2>
                <p className="text-muted-foreground font-body mb-6">Start shopping to see your orders here.</p>
                <Link to="/collections"><Button variant="artisan" className="button-glow">Browse Collections</Button></Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="cursor-pointer" onClick={() => loadOrderItems(order.id)}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <CardTitle className="font-display text-lg">{order.order_number}</CardTitle>
                        <p className="text-xs text-muted-foreground font-body mt-1">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        {orderCustomFlags[order.id] ? (
                          <div className="mt-2">
                            <p className="text-sm font-body text-gold">Customization under review</p>
                            <p className="text-xs font-body text-muted-foreground">We will contact you within a few hours</p>
                          </div>
                        ) : (
                          <p className="text-sm font-body text-sage mt-2">Order Confirmed</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-lg text-foreground">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </CardHeader>
                  {expandedOrder === order.id && orderItems[order.id] && (
                    <CardContent className="border-t border-border pt-4">
                      <div className="space-y-3">
                        {orderItems[order.id].map(item => (
                          <div key={item.id} className="flex items-center gap-3">
                            {item.product_image && (
                              <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-lg object-cover" />
                            )}
                            <div className="flex-1">
                              <p className="font-body text-sm text-foreground">{item.product_name}</p>
                              <p className="text-xs text-muted-foreground font-body">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
