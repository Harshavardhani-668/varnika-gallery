import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, CartItem } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ShoppingCart, Trash2, Loader2 } from 'lucide-react';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [user, navigate]);

  const loadCart = async () => {
    setLoading(true);
    const items = await getCart();
    setCartItems(items);
    setLoading(false);
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    await updateCartItem(itemId, newQuantity);
    await loadCart();
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
    await loadCart();
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setProcessingOrder(true);
    
    const orderItems = cartItems.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image || undefined,
      quantity: item.quantity,
      price: item.price,
    }));

    const shippingAddress = {
      // This should be collected from a form
      name: user?.user_metadata?.full_name || user?.email,
      email: user?.email,
    };

    const { error, order } = await createOrder(orderItems, shippingAddress);

    if (!error && order) {
      await clearCart();
      navigate('/orders');
    }
    
    setProcessingOrder(false);
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
            <ShoppingCart className="w-8 h-8 text-pastel-pink" />
            <h1 className="font-display text-4xl text-espresso">
              Your Cart
            </h1>
          </div>

          {cartItems.length === 0 ? (
            <Card className="border-pastel-lavender/20 shadow-soft text-center py-12">
              <CardContent>
                <ShoppingCart className="w-16 h-16 text-pastel-lavender mx-auto mb-4" />
                <h2 className="font-display text-2xl text-espresso mb-2">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start adding some handmade treasures!
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
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="border-pastel-lavender/20 shadow-soft">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {item.product_image && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-display text-xl text-espresso mb-2">
                            {item.product_name}
                          </h3>
                          <p className="text-lg text-pastel-pink font-semibold mb-4">
                            ₹{item.price.toFixed(2)}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0 border-pastel-lavender/30"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0 border-pastel-lavender/30"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-lg text-espresso">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-1">
                <Card className="border-pastel-lavender/20 shadow-soft sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-display text-2xl text-espresso">
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold text-espresso">
                      <span>Total</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleCheckout}
                      disabled={processingOrder}
                      className="w-full bg-gradient-to-r from-pastel-pink to-pastel-lavender hover:opacity-90 text-white"
                    >
                      {processingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Proceed to Checkout
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
