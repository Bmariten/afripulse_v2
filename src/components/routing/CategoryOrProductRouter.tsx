import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductBySlug } from '@/services/productService';
import ProductDetail from '@/pages/ProductDetail';
import ProductsPage from '@/pages/ProductsPage';
import { Skeleton } from '@/components/ui/skeleton';
import MainLayout from '../layout/MainLayout';

const CategoryOrProductRouter = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isProduct, setIsProduct] = useState<boolean | null>(null);

  useEffect(() => {
    if (!slug) {
      setIsProduct(false);
      return;
    }

    let isMounted = true;
    const checkSlugType = async () => {
      try {
        // Try to fetch as a product. If it succeeds, it's a product.
        await fetchProductBySlug(slug);
        if (isMounted) {
          setIsProduct(true);
        }
      } catch (error) {
        // If it fails (e.g., 404), assume it's a category.
        if (isMounted) {
          setIsProduct(false);
        }
      }
    };

    checkSlugType();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isProduct === null) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return isProduct ? <ProductDetail /> : <ProductsPage />;
};

export default CategoryOrProductRouter;
