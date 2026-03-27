import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Eye, EyeOff, Trash2, Star } from 'lucide-react';

interface AdminReview {
  id: string;
  user_id: string;
  order_id: string;
  product_id: string;
  rating: number;
  review_text: string;
  review_image_url: string | null;
  created_at: string;
  is_visible: boolean;
  reviewer_name: string;
}

const AdminReviews = () => {
  const { adminFetch, loading } = useAdmin();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadReviews = async () => {
    try {
      const data = await adminFetch('all_reviews');
      setReviews((data.reviews || []) as AdminReview[]);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to load reviews', variant: 'destructive' });
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const toggleVisibility = async (review: AdminReview) => {
    setBusyId(review.id);
    try {
      await adminFetch('update_review_visibility', {
        reviewId: review.id,
        isVisible: !review.is_visible,
      });
      toast({
        title: review.is_visible ? 'Review hidden' : 'Review visible',
        description: review.is_visible
          ? 'Customers will no longer see this review.'
          : 'Customers can see this review again.',
      });
      await loadReviews();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to update visibility', variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  };

  const deleteReview = async (review: AdminReview) => {
    if (!confirm('Delete this review permanently?')) return;
    setBusyId(review.id);
    try {
      await adminFetch('delete_review', { reviewId: review.id });
      toast({ title: 'Review deleted', description: 'The review has been removed.' });
      await loadReviews();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to delete review', variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild aria-label="Back to admin dashboard">
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-display text-3xl font-bold text-foreground">Reviews ({reviews.length})</h1>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No reviews yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Review</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.reviewer_name}</TableCell>
                        <TableCell className="font-mono text-xs">{r.product_id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-gold fill-gold" />
                            <span>{r.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[320px]">
                          <p className="text-sm line-clamp-2">{r.review_text}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={r.is_visible ? 'default' : 'secondary'}>
                            {r.is_visible ? 'Visible' : 'Hidden'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(r.created_at).toLocaleDateString('en-IN')}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleVisibility(r)}
                              disabled={busyId === r.id}
                              title={r.is_visible ? 'Hide review' : 'Show review'}
                            >
                              {r.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteReview(r)}
                              disabled={busyId === r.id}
                              className="text-destructive hover:text-destructive"
                              title="Delete review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReviews;
