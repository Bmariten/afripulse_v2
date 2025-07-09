
import { useEffect, useState } from 'react';
import ProductCard from '../products/ProductCard';
import { fetchProducts } from '@/services/productService';
import { Product } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      // Always attempt to fetch products, even for non-authenticated users
      try {
        setLoading(true);
        const response = await fetchProducts({ featured: true, limit: 6 });
        console.log('Featured products response:', response);
        
        // Make sure we're setting the products array correctly
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data) {
          // Check if the response has a products array
          const productsData = response.data as any;
          if (Array.isArray(productsData.products)) {
            setProducts(productsData.products);
          } else {
            console.error('Unexpected products data structure:', response.data);
            setProducts([]);
          }
        } else {
          console.error('No data in response:', response);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, [isAuthenticated]);

  // Always show featured products, even for non-authenticated users
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <a href="/products" className="text-primary hover:underline">
            View all →
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                <Skeleton className="h-48 w-full mb-4 rounded-md" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">No featured products available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
