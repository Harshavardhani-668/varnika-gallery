import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed'];

const AdminOrders = () => {
  const { getAllOrders, updateOrder, loading } = useAdmin();
  const [orders, setOrders] = useState<any[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = () => {
    getAllOrders().then(d => setOrders(d.orders)).catch(console.error);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, field: 'status' | 'payment_status', value: string) => {
    setUpdating(orderId);
    try {
      await updateOrder(orderId, field === 'status' ? value : undefined, field === 'payment_status' ? value : undefined);
      toast({ title: 'Updated', description: `Order ${field.replace('_', ' ')} updated to ${value}.` });
      fetchOrders();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setUpdating(null);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild><Link to="/admin"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <h1 className="font-display text-3xl font-bold text-foreground">Orders Management</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{format(new Date(order.created_at), 'dd MMM yyyy')}</TableCell>
                      <TableCell>₹{Number(order.total_amount).toLocaleString('en-IN')}</TableCell>
                      <TableCell>{order.order_items?.length || 0}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(v) => handleStatusChange(order.id, 'status', v)}
                          disabled={updating === order.id}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.payment_status || 'pending'}
                          onValueChange={(v) => handleStatusChange(order.id, 'payment_status', v)}
                          disabled={updating === order.id}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/orders/${order.id}`}>Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrders;
