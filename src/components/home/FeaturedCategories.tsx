
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, ArrowRight, Sparkles, Heart, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  bg_color: string;
}

// Simple animation component since we don't have framer-motion
const MotionDiv = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const { isAuthenticated } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories/`, { withCredentials: true });
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isAuthenticated]);

  // Enhanced fallback categories with better image options and icons
  const defaultCategories = [
    {
      id: '1',
      name: 'Health & Wellness',
      description: 'Discover premium products and resources for your health and wellness journey.',
      image_url: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      slug: 'health-wellness',
      bg_color: 'bg-health-light',
      icon: <Heart className="h-6 w-6" />,
      accent_color: 'from-health/80 to-health/20'
    },
    {
      id: '2',
      name: 'Real Estate',
      description: 'Access top resources for real estate investment and education.',
      image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      slug: 'real-estate',
      bg_color: 'bg-real-estate-light',
      icon: <Home className="h-6 w-6" />,
      accent_color: 'from-[#D2B48C]/80 to-[#D2B48C]/20'
    }
  ];

  // Only show categories if authenticated
  const displayCategories = isAuthenticated ? (categories.length > 0 ? categories : defaultCategories) : [];

  // If not authenticated, don't render the section at all
  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-health/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#D2B48C]/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm mb-4">
            <Sparkles className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Curated Collections</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Explore Premium Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our carefully curated collections of premium products designed to enhance your lifestyle and investments.</p>
        </MotionDiv>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2].map((index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
                <Skeleton className="h-64 w-full mb-6 rounded-xl" />
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <Skeleton className="h-12 w-1/3 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10" ref={containerRef}>
            {displayCategories.map((category, index) => {
              // Use default category icons if available
              const defaultCategory = defaultCategories.find(c => c.name === category.name);
              const icon = defaultCategory?.icon || <ShoppingBag className="h-6 w-6" />;
              const accentColor = defaultCategory?.accent_color || 'from-primary/80 to-primary/20';
              
              return (
                <MotionDiv
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link 
                    to={`/products/${category.slug}`}
                    className="block h-full"
                    onMouseEnter={() => setActiveCategory(index)}
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="relative">
                        {/* Gradient overlay that changes on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} opacity-0 group-hover:opacity-70 transition-opacity duration-300 z-10`}></div>
                        
                        {/* Image */}
                        <div className="h-64 overflow-hidden">
                          <img 
                            src={category.image_url} 
                            alt={category.name} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        </div>
                        
                        {/* Floating badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1 text-sm font-medium text-gray-800 shadow-lg z-20">
                          Premium
                        </div>
                      </div>
                      
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center mb-4">
                          <div className={`p-3 rounded-xl ${index === activeCategory ? 'bg-gradient-to-br from-primary to-primary/70' : 'bg-primary/10'} text-white mr-4 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary/70`}>
                            {icon}
                          </div>
                          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">{category.name}</h3>
                        </div>
                        
                        <p className="text-gray-600 mb-6 flex-grow">{category.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-primary font-medium group-hover:text-primary transition-colors duration-300">
                            <span>Explore Collection</span>
                            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                          
                          <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                            20+ Products
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </MotionDiv>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCategories;
