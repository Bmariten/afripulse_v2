import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/services/productService';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
  product: Product;
  onGenerateLink?: (productId: string) => void;
}

const ProductCard = ({ product, onGenerateLink }: ProductCardProps) => {
  const { user } = useAuth();
  const isAffiliate = user?.role === 'affiliate';

  // Return a placeholder if product is undefined
  if (!product) {
    return (
      <Card className="overflow-hidden h-full flex flex-col">
        <CardContent className="p-4">
          <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
            <p className="text-gray-400">Product unavailable</p>
          </div>
          <h3 className="mt-2 font-medium">Product not found</h3>
          <p className="text-sm text-gray-500">This product may have been removed</p>
        </CardContent>
      </Card>
    );
  }

  // Destructure with default values to prevent runtime errors
  const {
    id,
    name,
    slug,
    price,
    discount_price,
    images = [],
  } = product;

  const primaryImage = images?.find(img => img.is_primary) || images?.[0];
  const displayPrice = discount_price ?? price;
  const originalPrice = discount_price ? price : null;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/products/${slug}`} className="block">
        <div className="aspect-square overflow-hidden">
          <img
            src={primaryImage?.image_url || '/placeholder.svg'}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 h-14">{name}</h3>
        <div className="flex items-baseline gap-2">
          <p className={`font-semibold text-xl ${originalPrice ? 'text-red-600' : 'text-gray-900'}`}>
            ${(displayPrice ?? 0).toFixed(2)}
          </p>
          {originalPrice && (
            <p className="text-sm text-gray-500 line-through">
              ${(originalPrice ?? 0).toFixed(2)}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {isAffiliate && onGenerateLink ? (
          <Button
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              onGenerateLink(id);
            }}
          >
            Generate Link
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link to={`/products/${slug}`}>View Details</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
