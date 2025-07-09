import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { useNavigate } from 'react-router-dom';
import AddProductModal from '@/components/products/AddProductModal';
import { ProductFormData } from '@/components/products/ProductForm';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const SellerProducts = () => {
  const navigate = useNavigate();
  const { user, isProfileComplete, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSellerProducts = useCallback(async () => {
    if (!user?.profile?.id) {
        if (!authLoading) {
            toast({ title: "Error", description: "Could not identify seller.", variant: "destructive" });
        }
        return;
    }
    try {
      setLoadingProducts(true);
            const result = await fetchProducts({ seller_id: user.seller_profile.id, limit: 100 });
      setSellerProducts(result.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      toast({ title: "Error", description: "Could not fetch products.", variant: "destructive" });
    } finally {
      setLoadingProducts(false);
    }
  }, [user, toast, authLoading]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user.role !== 'seller') {
      navigate('/', { replace: true });
      return;
    }
    if (!isProfileComplete) {
      toast({ title: "Profile Incomplete", description: "Please complete your business profile to manage products." });
      navigate('/seller/settings', { replace: true });
      return;
    }

    fetchSellerProducts();
  }, [user, isProfileComplete, authLoading, navigate, toast, fetchSellerProducts]);

  const handleProductSubmit = async (productData: ProductFormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    
    Object.entries(productData).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach(file => formData.append('images', file));
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast({ title: 'Success', description: 'Product updated successfully.' });
      } else {
        await createProduct(formData);
        toast({ title: 'Success', description: 'Product submitted for approval.' });
      }
      setIsModalOpen(false);
      fetchSellerProducts(); // Refresh the product list
    } catch (error) {
      console.error('Failed to create product:', error);
      toast({ title: 'Error', description: 'Failed to create product.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast({
        title: 'Success',
        description: 'Product deleted successfully.',
        variant: 'default',
      });
      setSellerProducts(sellerProducts.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredProducts = sellerProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (authLoading) {
    return <div>Loading...</div>; // Or a loading skeleton component
  }

  return (
    <MainLayout showSidebar userRole="seller" pageTitle="Seller Products">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">My Products</CardTitle>
              <CardDescription>Manage and monitor all your product listings</CardDescription>
            </div>
            <Button onClick={() => {
              setEditingProduct(null); // Ensure we're adding, not editing
              setIsModalOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products by name or category..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Inventory</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingProducts ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-4">Loading products...</TableCell></TableRow>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category?.name}</TableCell>
                        <TableCell className="text-right">${Number(product.price).toFixed(2)}
                          {product.discount_price && (
                            <span className="ml-2 text-xs text-gray-500 line-through">
                              ${Number(product.discount_price).toFixed(2)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{product.inventory_count || 0}</TableCell>
                        <TableCell>{getStatusBadge(product.status || 'pending')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your product
                                    and remove its data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(product.id)}>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No products found. Click 'Add Product' to get started.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleProductSubmit}
        productToEdit={editingProduct}
        loading={isSubmitting}
      />
    </MainLayout>
  );
};

export default SellerProducts;
