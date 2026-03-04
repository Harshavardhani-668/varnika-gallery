import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const AdminOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderDetail, loading } = useAdmin();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (id) getOrderDetail(id).then(d => setOrder(d.order)).catch(console.error);
  }, [id]);

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const address = order.shipping_address;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild><Link to="/admin/orders"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <h1 className="font-display text-3xl font-bold text-foreground">Order {order.order_number}</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader><CardTitle>Order Info</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium text-foreground">{format(new Date(order.created_at), 'dd MMM yyyy, hh:mm a')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium text-foreground">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline">{order.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment</p>
                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>{order.payment_status}</Badge>
              </div>
              {order.payment_intent_id && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Payment ID</p>
                  <p className="font-mono text-sm text-foreground">{order.payment_intent_id}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {address && (
            <Card>
              <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
              <CardContent>
                <p className="text-foreground font-medium">{address.full_name}</p>
                <p className="text-muted-foreground">{address.address_line1}</p>
                {address.address_line2 && <p className="text-muted-foreground">{address.address_line2}</p>}
                <p className="text-muted-foreground">{address.city}, {address.state} {address.postal_code}</p>
                {address.phone && <p className="text-muted-foreground">Phone: {address.phone}</p>}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(order.order_items || []).map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="flex items-center gap-3">
                        {item.product_image && (
                          <img src={item.product_image} alt={item.product_name} className="w-10 h-10 rounded object-cover" />
                        )}
                        <span className="font-medium">{item.product_name}</span>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{Number(item.price).toLocaleString('en-IN')}</TableCell>
                      <TableCell>₹{(item.quantity * Number(item.price)).toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
