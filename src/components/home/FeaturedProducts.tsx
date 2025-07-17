
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard';
import { fetchProducts } from '@/services/productService';
import { Product } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Star, TrendingUp, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simple animation component
const MotionDiv = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');
  const { isAuthenticated } = useAuth();
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      // Always attempt to fetch products, even for non-authenticated users
      try {
        setLoading(true);
        const response = await fetchProducts({ featured: true, limit: 8 });
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

  // Scroll slider left/right
  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    
    const scrollAmount = 320; // Approximate width of a card + gap
    const currentScroll = sliderRef.current.scrollLeft;
    
    sliderRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  // Filter tabs - in a real app these would fetch different products
  const tabs = [
    { id: 'featured', label: 'Featured', icon: <Star className="h-4 w-4" /> },
    { id: 'trending', label: 'Trending', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'new', label: 'New Arrivals', icon: <Tag className="h-4 w-4" /> }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionDiv className="mb-12 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Premium Selection
          </span>
          <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products from verified African sellers.
          </p>
        </MotionDiv>
        
        {/* Filter tabs */}
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="flex gap-2 mb-4 md:mb-0 overflow-x-auto pb-2 hide-scrollbar">
            {tabs.map(tab => (
              <Button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={`rounded-full flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-white'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
          
          <Link to="/products" className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {/* Products slider with navigation */}
        <div className="relative">
          {/* Left navigation arrow */}
          <button 
            onClick={() => scrollSlider('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors hidden md:flex items-center justify-center"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          {/* Product cards slider */}
          <div 
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory scroll-pl-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              // Show skeleton loaders while loading
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="min-w-[300px] flex-shrink-0 snap-start">
                  <div className="bg-white rounded-2xl shadow-lg p-4 h-full">
                    <Skeleton className="h-56 w-full mb-4 rounded-xl" />
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-5 w-1/3 mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="min-w-[300px] max-w-[350px] flex-shrink-0 snap-start"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-10">
                <p className="text-gray-500">No featured products available.</p>
              </div>
            )}
          </div>
          
          {/* Right navigation arrow */}
          <button 
            onClick={() => scrollSlider('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors hidden md:flex items-center justify-center"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        
        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary/90 to-primary rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-12 text-white md:w-2/3">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Become a Verified Seller</h3>
              <p className="mb-6 text-white/90">Join our marketplace and reach thousands of customers looking for premium African products.</p>
              <Button asChild variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/seller/signup">Apply Now</Link>
              </Button>
            </div>
            <div className="md:w-1/3 h-full">
              <img 
                src="https://images.unsplash.com/photo-1664575599736-c5197c684128?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Seller dashboard" 
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
