import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const emptyProduct = {
  product_id: '',
  product_name: '',
  short_description: '',
  long_description: '',
  category: '',
  subcategory: '',
  brand: 'Varnika',
  regular_price: 0,
  sale_price: '',
  cost_price: 0,
  image_url_1: '',
  image_url_2: '',
  image_url_3: '',
  stock: 0,
  customizable: false,
  featured: false,
  tags: '',
  color_variant: '',
};

const AdminProducts = () => {
  const { loading, adminFetch } = useAdmin();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyProduct });
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await adminFetch('all_products');
      setProducts(data.products || []);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditingProduct(null);
    setForm({ ...emptyProduct });
    setDialogOpen(true);
  };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    setForm({
      product_id: p.product_id,
      product_name: p.product_name,
      short_description: p.short_description || '',
      long_description: p.long_description || '',
      category: p.category || '',
      subcategory: p.subcategory || '',
      brand: p.brand || 'Varnika',
      regular_price: p.regular_price || 0,
      sale_price: p.sale_price ?? '',
      cost_price: p.cost_price || 0,
      image_url_1: p.image_url_1 || '',
      image_url_2: p.image_url_2 || '',
      image_url_3: p.image_url_3 || '',
      stock: p.stock || 0,
      customizable: p.customizable || false,
      featured: p.featured || false,
      tags: p.tags || '',
      color_variant: p.color_variant || '',
    });
    setDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleCheckbox = (name: string) => {
    setForm(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const handleSave = async () => {
    if (!form.product_id || !form.product_name) {
      toast({ title: 'Required', description: 'Product ID and Name are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        sale_price: form.sale_price === '' ? null : Number(form.sale_price),
        regular_price: Number(form.regular_price),
        cost_price: Number(form.cost_price),
        stock: Number(form.stock),
      };

      if (editingProduct) {
        await adminFetch('update_product', { productId: editingProduct.id, product: payload });
        toast({ title: 'Updated', description: `${form.product_name} updated.` });
      } else {
        await adminFetch('create_product', { product: payload });
        toast({ title: 'Created', description: `${form.product_name} added.` });
      }
      setDialogOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminFetch('delete_product', { productId: id });
      toast({ title: 'Deleted', description: `${name} removed.` });
      fetchProducts();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  if (loading && products.length === 0) {
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
            <Button variant="ghost" size="icon" asChild><Link to="/admin"><ArrowLeft className="h-5 w-5" /></Link></Button>
            <h1 className="font-display text-3xl font-bold text-foreground">Products ({products.length})</h1>
          </div>
          <Button onClick={openCreate} variant="artisan">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            {products.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No products found. Add your first product!</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          {p.image_url_1 ? (
                            <img src={p.image_url_1} alt={p.product_name} className="w-12 h-12 rounded object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded bg-muted" />
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{p.product_id}</TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">{p.product_name}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>
                          {p.sale_price ? (
                            <span>
                              <span className="text-foreground">₹{Number(p.sale_price).toLocaleString('en-IN')}</span>
                              <span className="text-muted-foreground line-through text-xs ml-1">₹{Number(p.regular_price).toLocaleString('en-IN')}</span>
                            </span>
                          ) : (
                            <span>₹{Number(p.regular_price).toLocaleString('en-IN')}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.stock > 0 ? 'default' : 'destructive'}>{p.stock}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {p.featured && <Badge variant="outline" className="text-xs">Featured</Badge>}
                            {p.customizable && <Badge variant="secondary" className="text-xs">Custom</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id, p.product_name)} className="text-destructive hover:text-destructive">
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

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Product ID *</Label>
                <Input name="product_id" value={form.product_id} onChange={handleChange} disabled={!!editingProduct} />
              </div>
              <div>
                <Label>Product Name *</Label>
                <Input name="product_name" value={form.product_name} onChange={handleChange} />
              </div>
            </div>
            <div>
              <Label>Short Description</Label>
              <Input name="short_description" value={form.short_description} onChange={handleChange} />
            </div>
            <div>
              <Label>Long Description</Label>
              <Textarea name="long_description" value={form.long_description} onChange={handleChange} rows={3} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Category</Label>
                <Input name="category" value={form.category} onChange={handleChange} />
              </div>
              <div>
                <Label>Subcategory</Label>
                <Input name="subcategory" value={form.subcategory} onChange={handleChange} />
              </div>
              <div>
                <Label>Brand</Label>
                <Input name="brand" value={form.brand} onChange={handleChange} />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Regular Price *</Label>
                <Input name="regular_price" type="number" value={form.regular_price} onChange={handleChange} />
              </div>
              <div>
                <Label>Sale Price</Label>
                <Input name="sale_price" type="number" value={form.sale_price} onChange={handleChange} placeholder="Leave empty if none" />
              </div>
              <div>
                <Label>Cost Price</Label>
                <Input name="cost_price" type="number" value={form.cost_price} onChange={handleChange} />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Image URL 1</Label>
                <Input name="image_url_1" value={form.image_url_1} onChange={handleChange} />
              </div>
              <div>
                <Label>Image URL 2</Label>
                <Input name="image_url_2" value={form.image_url_2} onChange={handleChange} />
              </div>
              <div>
                <Label>Image URL 3</Label>
                <Input name="image_url_3" value={form.image_url_3} onChange={handleChange} />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Stock</Label>
                <Input name="stock" type="number" value={form.stock} onChange={handleChange} />
              </div>
              <div>
                <Label>Tags</Label>
                <Input name="tags" value={form.tags} onChange={handleChange} />
              </div>
              <div>
                <Label>Color Variant</Label>
                <Input name="color_variant" value={form.color_variant} onChange={handleChange} />
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form.featured} onChange={() => handleCheckbox('featured')} className="rounded" />
                <span className="text-sm font-body">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form.customizable} onChange={() => handleCheckbox('customizable')} className="rounded" />
                <span className="text-sm font-body">Customizable</span>
              </label>
            </div>
            <Button onClick={handleSave} disabled={saving} variant="artisan" className="w-full">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
