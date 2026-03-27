import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { User, MapPin, Package, Heart, Clock, Loader2, Plus, Trash2, Save } from 'lucide-react';

interface Profile {
  full_name: string;
  phone: string;
  email: string;
}

interface Address {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

interface RecentlyViewed {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  viewed_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();

  const [profile, setProfile] = useState<Profile>({ full_name: '', phone: '', email: '' });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderCustomFlags, setOrderCustomFlags] = useState<Record<string, boolean>>({});
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewed[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home', full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: ''
  });

  useEffect(() => {
    if (user) loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadProfile(), loadAddresses(), loadOrders(), loadRecentlyViewed()]);
    setLoading(false);
  };

  const loadProfile = async () => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
    if (data) {
      setProfile({ full_name: data.full_name || '', phone: data.phone || '', email: data.email || user!.email || '' });
    } else if (error && error.code === 'PGRST116') {
      // Profile doesn't exist yet — create it
      await supabase.from('profiles').insert({
        id: user!.id,
        email: user!.email || '',
        full_name: user!.user_metadata?.full_name || '',
      });
      setProfile({ full_name: user!.user_metadata?.full_name || '', phone: '', email: user!.email || '' });
    }
  };

  const loadAddresses = async () => {
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user!.id).order('is_default', { ascending: false });
    if (data) setAddresses(data as Address[]);
  };

  const loadOrders = async () => {
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
  };

  const loadRecentlyViewed = async () => {
    const { data } = await supabase.from('recently_viewed').select('*').eq('user_id', user!.id).order('viewed_at', { ascending: false }).limit(10);
    if (data) setRecentlyViewed(data as RecentlyViewed[]);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      phone: profile.phone,
      updated_at: new Date().toISOString(),
    }).eq('id', user!.id);

    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else toast({ title: 'Profile updated', description: 'Your profile has been saved.' });
    setSaving(false);
  };

  const handleAddAddress = async () => {
    if (!newAddress.full_name || !newAddress.address_line1 || !newAddress.city || !newAddress.state || !newAddress.postal_code) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('addresses').insert({
      user_id: user!.id,
      ...newAddress,
      is_default: addresses.length === 0,
    });

    if (!error) {
      await loadAddresses();
      setShowAddressForm(false);
      setNewAddress({ label: 'Home', full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '' });
      toast({ title: 'Address saved' });
    }
    setSaving(false);
  };

  const handleDeleteAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    await loadAddresses();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 px-4 varnika-container max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full" />
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
          <h1 className="font-display text-4xl text-foreground mb-2">My Account</h1>
          <p className="text-muted-foreground font-body mb-8">Welcome back, {profile.full_name || user?.email}</p>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 h-auto">
              <TabsTrigger value="profile" className="font-body text-xs sm:text-sm gap-1"><User className="w-4 h-4 hidden sm:block" />Profile</TabsTrigger>
              <TabsTrigger value="addresses" className="font-body text-xs sm:text-sm gap-1"><MapPin className="w-4 h-4 hidden sm:block" />Addresses</TabsTrigger>
              <TabsTrigger value="orders" className="font-body text-xs sm:text-sm gap-1"><Package className="w-4 h-4 hidden sm:block" />Orders</TabsTrigger>
              <TabsTrigger value="wishlist" className="font-body text-xs sm:text-sm gap-1"><Heart className="w-4 h-4 hidden sm:block" />Wishlist</TabsTrigger>
              <TabsTrigger value="recent" className="font-body text-xs sm:text-sm gap-1"><Clock className="w-4 h-4 hidden sm:block" />Recent</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader><CardTitle className="font-display">Profile Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} className="border-border focus:border-gold" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="border-border focus:border-gold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile.email} disabled className="bg-muted/50" />
                  </div>
                  <Button onClick={handleSaveProfile} disabled={saving} variant="artisan" className="button-glow">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-display">Saved Addresses</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowAddressForm(true)}><Plus className="w-4 h-4 mr-1" />Add</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {showAddressForm && (
                    <div className="border border-border rounded-xl p-4 space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div><Label>Full Name *</Label><Input value={newAddress.full_name} onChange={e => setNewAddress(a => ({ ...a, full_name: e.target.value }))} /></div>
                        <div><Label>Phone</Label><Input value={newAddress.phone} onChange={e => setNewAddress(a => ({ ...a, phone: e.target.value }))} /></div>
                      </div>
                      <div><Label>Address Line 1 *</Label><Input value={newAddress.address_line1} onChange={e => setNewAddress(a => ({ ...a, address_line1: e.target.value }))} /></div>
                      <div><Label>Address Line 2</Label><Input value={newAddress.address_line2} onChange={e => setNewAddress(a => ({ ...a, address_line2: e.target.value }))} /></div>
                      <div className="grid grid-cols-3 gap-3">
                        <div><Label>City *</Label><Input value={newAddress.city} onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))} /></div>
                        <div><Label>State *</Label><Input value={newAddress.state} onChange={e => setNewAddress(a => ({ ...a, state: e.target.value }))} /></div>
                        <div><Label>PIN *</Label><Input value={newAddress.postal_code} onChange={e => setNewAddress(a => ({ ...a, postal_code: e.target.value }))} /></div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddAddress} disabled={saving} variant="artisan" size="sm">
                          {saving && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}Save
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}
                  {addresses.length === 0 && !showAddressForm && (
                    <p className="text-muted-foreground font-body text-center py-8">No saved addresses yet.</p>
                  )}
                  {addresses.map(addr => (
                    <div key={addr.id} className="border border-border rounded-xl p-4 flex justify-between items-start">
                      <div className="font-body text-sm">
                        <p className="font-medium text-foreground">{addr.full_name} {addr.is_default && <span className="text-xs text-gold ml-2">Default</span>}</p>
                        <p className="text-muted-foreground">{addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}</p>
                        <p className="text-muted-foreground">{addr.city}, {addr.state} {addr.postal_code}</p>
                        {addr.phone && <p className="text-muted-foreground">{addr.phone}</p>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)} className="text-destructive" aria-label="Delete address"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader><CardTitle className="font-display">Order History</CardTitle></CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted mx-auto mb-3" />
                      <p className="text-muted-foreground font-body">No orders yet.</p>
                      <Button variant="outline" className="mt-4" asChild><Link to="/collections">Start Shopping</Link></Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map(order => (
                        <div key={order.id} className="border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="font-body">
                            <p className="text-sm font-medium text-foreground">{order.order_number}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            {orderCustomFlags[order.id] ? (
                              <div className="mt-2">
                                <p className="text-sm text-gold">Customization under review</p>
                                <p className="text-xs text-muted-foreground">We will contact you within a few hours</p>
                              </div>
                            ) : (
                              <p className="text-sm text-sage mt-2">Order Confirmed</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-display text-foreground">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <Card>
                <CardHeader><CardTitle className="font-display">My Wishlist</CardTitle></CardHeader>
                <CardContent>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-muted mx-auto mb-3" />
                      <p className="text-muted-foreground font-body">Your wishlist is empty.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {wishlistItems.map(item => (
                        <div key={item.id} className="border border-border rounded-xl p-3 flex gap-3">
                          {item.product_image && (
                            <Link to={`/product/${item.product_id}`}>
                              <img src={item.product_image} alt={`${item.product_name} handmade gift product image`} loading="lazy" className="w-16 h-16 max-w-full rounded-lg object-cover" />
                            </Link>
                          )}
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${item.product_id}`} className="font-body text-sm text-foreground hover:text-gold truncate block">{item.product_name}</Link>
                            <p className="font-display text-sm text-gold">₹{item.price.toLocaleString('en-IN')}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeFromWishlist(item.product_id)} className="text-destructive shrink-0" aria-label={`Remove ${item.product_name} from wishlist`}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recently Viewed Tab */}
            <TabsContent value="recent">
              <Card>
                <CardHeader><CardTitle className="font-display">Recently Viewed</CardTitle></CardHeader>
                <CardContent>
                  {recentlyViewed.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-muted mx-auto mb-3" />
                      <p className="text-muted-foreground font-body">No recently viewed products.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {recentlyViewed.map(item => (
                        <Link key={item.id} to={`/product/${item.product_id}`} className="group border border-border rounded-xl overflow-hidden hover-lift">
                          {item.product_image && (
                            <img src={item.product_image} alt={`${item.product_name} handmade gift product image`} loading="lazy" className="w-full h-32 max-w-full object-cover" />
                          )}
                          <div className="p-3">
                            <p className="font-body text-sm text-foreground group-hover:text-gold truncate">{item.product_name}</p>
                            {item.price && <p className="font-display text-sm text-gold">₹{Number(item.price).toLocaleString('en-IN')}</p>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
