import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, Order, OrderItem } from '@/hooks/useOrders';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getOrders, getOrderItems } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<{ [key: string]: OrderItem[] }>({});
  const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user, navigate]);

  const loadOrders = async () => {
    setLoading(true);
    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders);
    setLoading(false);
  };

  const loadOrderItems = async (orderId: string) => {
    if (!orderItems[orderId]) {
      const items = await getOrderItems(orderId);
      setOrderItems(prev => ({ ...prev, [orderId]: items }));
    }
  };

  const toggleOrder = async (orderId: string) => {
    if (!expandedOrders[orderId]) {
      await loadOrderItems(orderId);
    }
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white">
        <Header />
        <div className="pt-32 pb-20 px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-pastel-pink" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      <Header />
      
      <div className="pt-32 pb-20 px-4">
        <div className="varnika-container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-8 h-8 text-pastel-pink" />
            <h1 className="font-display text-4xl text-espresso">
              Your Orders
            </h1>
          </div>

          {orders.length === 0 ? (
            <Card className="border-pastel-lavender/20 shadow-soft text-center py-12">
              <CardContent>
                <Package className="w-16 h-16 text-pastel-lavender mx-auto mb-4" />
                <h2 className="font-display text-2xl text-espresso mb-2">
                  No orders yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start shopping for handmade treasures!
                </p>
                <Button
                  onClick={() => navigate('/collections')}
                  className="bg-gradient-to-r from-pastel-pink to-pastel-lavender hover:opacity-90 text-white"
                >
                  Browse Collections
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Collapsible
                  key={order.id}
                  open={expandedOrders[order.id]}
                  onOpenChange={() => toggleOrder(order.id)}
                >
                  <Card className="border-pastel-lavender/20 shadow-soft">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <CardTitle className="font-display text-xl text-espresso mb-2">
                            Order {order.order_number}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span>
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-espresso">
                              ₹{order.total_amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {expandedOrders[order.id] ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>
                    </CardHeader>

                    <CollapsibleContent>
                      <CardContent>
                        <Separator className="mb-4" />
                        <h3 className="font-semibold text-espresso mb-4">Order Items</h3>
                        
                        {orderItems[order.id] ? (
                          <div className="space-y-3">
                            {orderItems[order.id].map((item) => (
                              <div key={item.id} className="flex gap-4 items-center">
                                {item.product_image && (
                                  <img
                                    src={item.product_image}
                                    alt={item.product_name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium text-espresso">
                                    {item.product_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-semibold text-pastel-pink">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex justify-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-pastel-pink" />
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
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
