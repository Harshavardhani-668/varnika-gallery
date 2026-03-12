import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, CartItem } from '@/hooks/useCart';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ShoppingCart, Trash2, Loader2 } from 'lucide-react';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCart, updateCartItem, removeFromCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

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

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-32 pb-20 px-4">
        <div className="varnika-container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="w-8 h-8 text-gold" />
            <h1 className="font-display text-4xl text-foreground">
              Your Cart
            </h1>
          </div>

          {cartItems.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingCart className="w-16 h-16 text-muted mx-auto mb-4" />
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground mb-6 font-body">
                  Start adding some handmade treasures!
                </p>
                <Link to="/collections">
                  <Button variant="artisan" className="button-glow">Browse Collections</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {item.product_image && (
                          <Link to={`/product/${item.product_id}`}>
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-24 h-24 object-cover rounded-xl"
                            />
                          </Link>
                        )}
                        <div className="flex-1">
                          <Link to={`/product/${item.product_id}`}>
                            <h3 className="font-display text-xl text-foreground mb-2 hover:text-gold transition-colors">
                              {item.product_name}
                            </h3>
                          </Link>
                          <p className="text-lg text-gold font-display mb-4">
                            ₹{item.price.toLocaleString("en-IN")}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm" variant="outline"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-12 text-center font-medium font-body">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm" variant="outline"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <Button
                              size="sm" variant="ghost"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-display text-lg text-foreground">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-display text-2xl text-foreground">
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-muted-foreground font-body">
                      <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span>₹{calculateTotal().toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground font-body">
                      <span>Shipping</span>
                      <span className="text-sage">{calculateTotal() >= 5000 ? "Free" : "₹199"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-display text-foreground">
                      <span>Total</span>
                      <span>₹{(calculateTotal() + (calculateTotal() >= 5000 ? 0 : 199)).toLocaleString("en-IN")}</span>
                    </div>
                    {calculateTotal() < 5000 && (
                      <p className="text-xs text-muted-foreground font-body">
                        Add ₹{(5000 - calculateTotal()).toLocaleString("en-IN")} more for free shipping
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleCheckout}
                      disabled={processingOrder}
                      variant="artisan"
                      size="xl"
                      className="w-full button-glow"
                    >
                      {processingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {!user ? "Sign In to Checkout" : "Proceed to Checkout"}
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
