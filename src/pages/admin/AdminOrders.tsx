import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed'];

const AdminOrders = () => {
  const { getAllOrders, loading } = useAdmin();
  const { updateOrderStatus, loading: updating } = useAdminOrders();
  const [orders, setOrders] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sendEmailFor, setSendEmailFor] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = () => {
    getAllOrders().then(d => setOrders(d.orders)).catch(console.error);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, value: string) => {
    setUpdatingId(orderId);
    try {
      const shouldSendEmail = sendEmailFor === orderId;
      await updateOrderStatus(orderId, value as any, shouldSendEmail);
      setSendEmailFor(null);
      setTimeout(() => fetchOrders(), 500);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEmailToggle = (orderId: string) => {
    setSendEmailFor(sendEmailFor === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
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
                    <TableHead>Email</TableHead>
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
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(v) => handleStatusChange(order.id, v)}
                            disabled={updatingId === order.id || updating}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ORDER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          {order.status === 'processing' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.payment_status || 'pending'}
                          onValueChange={(v) => handleStatusChange(order.id, v)}
                          disabled={updatingId === order.id || updating}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={sendEmailFor === order.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleEmailToggle(order.id)}
                          className="gap-1"
                          title="Toggle email notification"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
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

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p><strong>📧 Email Notifications:</strong> Click the mail icon to notify customers when updating order status. This sends personalized emails for Processing, Shipped, and Delivered statuses.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
