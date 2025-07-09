import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductBySlug, Product } from '@/services/productService';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      if (!slug) {
        setError('Product slug is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchProductBySlug(slug);
        if (data) {
          setProduct(data);
          if (data.images && data.images.length > 0) {
            const primary = data.images.find(img => img.is_primary) || data.images[0];
            setSelectedImage(primary.image_url);
          }
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [slug]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="w-full h-96" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="w-20 h-20" />
                <Skeleton className="w-20 h-20" />
                <Skeleton className="w-20 h-20" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return null; // Should be handled by error state, but as a fallback
  }

  const displayPrice = product.discount_price ?? product.price;
  const originalPrice = product.discount_price ? product.price : null;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden mb-4 border">
              <img
                src={selectedImage || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images?.map(image => (
                <button
                  key={image.id}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === image.image_url ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(image.image_url)}
                >
                  <img src={image.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="py-4">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-baseline gap-3 mb-4">
              <p className={`font-semibold text-3xl ${originalPrice ? 'text-red-600' : 'text-gray-900'}`}>
                ${(displayPrice ?? 0).toFixed(2)}
              </p>
              {originalPrice && (
                <p className="text-lg text-gray-500 line-through">
                  ${(originalPrice ?? 0).toFixed(2)}
                </p>
              )}
            </div>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <Button size="lg">Add to Cart</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
