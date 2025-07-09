import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { fetchProducts, Product } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/services/api';

const AffiliateProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchProducts({ limit: 100 });
        // The API response for products is { data: Product[], count: number }
        // We need to map over response.data, not the whole response.
        setProducts(response.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({
          title: "Error",
          description: "Could not load products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [toast]);

  const handleGenerateLink = async (productId: string) => {
    try {
      const response = await api.post('/affiliate/links', { product_id: productId });
      const affiliateLink = response.data.link;

      await navigator.clipboard.writeText(affiliateLink);

      toast({
        title: "Link Generated & Copied!",
        description: "Your affiliate link has been copied to the clipboard.",
      });
    } catch (error) {
      console.error("Failed to generate affiliate link:", error);
      toast({
        title: "Error",
        description: "Could not generate affiliate link.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Browse Products</h1>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onGenerateLink={handleGenerateLink}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AffiliateProducts;
