
import { useState, useEffect } from 'react';
import api from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import ProductForm from '@/components/products/ProductForm';
import { createProduct } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

type ProductStatus = 'pending' | 'approved' | 'rejected';

interface Product {
  id: number;
  name: string;
  seller: string;
  category: string;
  price: string;
  status: ProductStatus;
  dateSubmitted: string;
}

const AdminProducts = () => {
  const [filter, setFilter] = useState<ProductStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      // First try to get all products
      const response = await api.get('/products/admin/all-products');
      console.log('All products response:', response.data);
      
      // If that fails or returns empty, try the pending products endpoint
      let productsData = [];
      if (!response.data || response.data.length === 0) {
        const pendingResponse = await api.get('/products/admin/pending-products');
        console.log('Pending products response:', pendingResponse.data);
        productsData = pendingResponse.data || [];
      } else {
        productsData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      }
      
      const fetchedProducts = productsData.map((item: any) => ({
        id: item.id,
        name: item.name,
        seller: item.sellerBusinessName || item.seller_name || '',
        category: item.category ? (typeof item.category === 'string' ? item.category : item.category.name) : '',
        price: item.price ? `$${item.price}` : '',
        status: (item.is_approved === 1 ? 'approved' : (item.status === 'rejected' ? 'rejected' : 'pending')) as ProductStatus,
        dateSubmitted: item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
      }));
      console.log('Processed products:', fetchedProducts);
      setProducts(fetchedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    
    // Check if we should open the Add Product modal based on URL parameters
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'add') {
      setIsModalOpen(true);
    }
  }, [location]);

  const handleProductSubmit = async (productData: any) => {
    setIsSubmitting(true);
    const formData = new FormData();

    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        productData.images.forEach((file: File) => {
          formData.append('images', file);
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    try {
      await createProduct(formData);
      toast({ title: 'Success', description: 'Product created successfully.' });
      setIsModalOpen(false);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Failed to create product:', error);
      toast({ title: 'Error', description: 'Failed to create product.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const approveProduct = async (id: number) => {
    try {
      await api.put(`/products/${id}/approve`);
      fetchProducts(); // Refresh
    } catch (err) {
      setError('Failed to approve product.');
    }
  };

  const rejectProduct = async (id: number) => {
    try {
      await api.put(`/products/${id}/reject`);
      fetchProducts(); // Refresh
    } catch (err) {
      setError('Failed to reject product.');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'all' || product.status === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: ProductStatus) => {
    switch(status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <MainLayout showSidebar userRole="admin" pageTitle="Product Moderation">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="bg-amber-50">
            <CardTitle>Product Moderation</CardTitle>
            <CardDescription>Review, approve, and add products from sellers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <Input 
                  placeholder="Search products or sellers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              <div className="flex gap-2">
                <Select 
                  value={filter} 
                  onValueChange={(value: ProductStatus | 'all') => setFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Product</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <ProductForm onSubmit={handleProductSubmit} loading={isSubmitting} productToEdit={null} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.seller}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.dateSubmitted}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.status === 'pending' ? (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-green-500 text-green-500 hover:bg-green-50"
                              onClick={() => approveProduct(product.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500 text-red-500 hover:bg-red-50"
                              onClick={() => rejectProduct(product.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No products match your filter criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminProducts;
