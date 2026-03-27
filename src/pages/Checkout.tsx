import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, CartItem } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, MapPin, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCart, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [address, setAddress] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const items = await getCart();
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    setCartItems(items);

    // Pre-fill from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user!.id)
      .maybeSingle();

    if (profile) {
      setAddress(prev => ({
        ...prev,
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      }));
    }

    // Pre-fill from saved default address
    const { data: savedAddr } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user!.id)
      .eq('is_default', true)
      .maybeSingle();

    if (savedAddr) {
      setAddress({
        full_name: savedAddr.full_name,
        phone: savedAddr.phone || '',
        address_line1: savedAddr.address_line1,
        address_line2: savedAddr.address_line2 || '',
        city: savedAddr.city,
        state: savedAddr.state,
        postal_code: savedAddr.postal_code,
        country: savedAddr.country || 'India',
      });
    }

    setLoading(false);
  };

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 1000 ? 0 : 199; // Free delivery over ₹1000
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.full_name || !address.phone || !address.address_line1 || !address.city || !address.state || !address.postal_code) {
      toast({ title: 'Missing fields', description: 'Please fill all required address fields.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);

    // Save address for future use
    await supabase.from('addresses').upsert({
      user_id: user!.id,
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || null,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: true,
    }, { onConflict: 'user_id' }).select();

    const orderItems = cartItems.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image || undefined,
      quantity: item.quantity,
      price: item.price,
      is_custom: item.is_custom,
      customization_data: item.customization_data,
    }));

    const { error, order } = await createOrder(orderItems, address);

    if (!error && order) {
      await clearCart();
      navigate('/orders');
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-20 px-4">
        <div className="varnika-container max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="w-8 h-8 text-gold" />
            <h1 className="font-display text-4xl text-foreground">Checkout</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Address Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display text-2xl flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gold" /> Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input id="full_name" name="full_name" value={address.full_name} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" name="phone" value={address.phone} onChange={handleChange} required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address_line1">Address Line 1 *</Label>
                      <Input id="address_line1" name="address_line1" value={address.address_line1} onChange={handleChange} placeholder="House/Flat No., Street" required />
                    </div>
                    <div>
                      <Label htmlFor="address_line2">Address Line 2</Label>
                      <Input id="address_line2" name="address_line2" value={address.address_line2} onChange={handleChange} placeholder="Landmark, Area (optional)" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" name="city" value={address.city} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input id="state" name="state" value={address.state} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="postal_code">PIN Code *</Label>
                        <Input id="postal_code" name="postal_code" value={address.postal_code} onChange={handleChange} required />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-display text-2xl flex items-center gap-2">
                      <Package className="w-5 h-5 text-gold" /> Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm font-body">
                        <span className="text-foreground truncate max-w-[160px]">{item.product_name} × {item.quantity}</span>
                        <span className="text-muted-foreground">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between text-sm font-body text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-body text-muted-foreground">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-sage' : ''}>
                        {shipping === 0 ? 'Free' : `₹${shipping}`}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-display text-foreground">
                      <span>Total</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>

                    <Button
                      type="submit"
                      variant="artisan"
                      size="xl"
                      className="w-full button-glow mt-4"
                      disabled={submitting}
                    >
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm Order
                    </Button>
                    <p className="text-xs text-muted-foreground text-center font-body mt-2">
                      Cash on Delivery • Secure Checkout
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
