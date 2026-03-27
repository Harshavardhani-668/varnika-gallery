import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const AdminUsers = () => {
  const { getAllUsers, promoteToAdmin, loading } = useAdmin();
  const [users, setUsers] = useState<any[]>([]);
  const [promoting, setPromoting] = useState<string | null>(null);
  const { toast } = useToast();
  const logDevError = (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.error(...args);
    }
  };

  const fetchUsers = () => {
    getAllUsers().then(d => setUsers(d.users)).catch((error) => logDevError(error));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handlePromote = async (userId: string) => {
    setPromoting(userId);
    try {
      await promoteToAdmin(userId);
      toast({ title: 'Success', description: 'User promoted to admin.' });
      fetchUsers();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setPromoting(null);
    }
  };

  if (loading && users.length === 0) {
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
          <Button variant="ghost" size="icon" asChild aria-label="Back to admin dashboard"><Link to="/admin"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <h1 className="font-display text-3xl font-bold text-foreground">Users Management</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            {users.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No users found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => {
                    const isAdmin = user.roles?.includes('admin');
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name || '—'}</TableCell>
                        <TableCell>{user.email || '—'}</TableCell>
                        <TableCell>{user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy') : '—'}</TableCell>
                        <TableCell>
                          {user.roles?.length > 0
                            ? user.roles.map((r: string) => <Badge key={r} variant="outline" className="mr-1">{r}</Badge>)
                            : <span className="text-muted-foreground text-sm">user</span>
                          }
                        </TableCell>
                        <TableCell>
                          {!isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={promoting === user.id}
                              onClick={() => handlePromote(user.id)}
                            >
                              {promoting === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-1" />}
                              Make Admin
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
