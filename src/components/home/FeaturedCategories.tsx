
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  bg_color: string;
}

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

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

  // Fallback categories with better image options
  const defaultCategories = [
    {
      id: '1',
      name: 'Health & Wellness',
      description: 'Discover premium products and resources for your health and wellness journey.',
      image_url: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      slug: 'health-wellness',
      bg_color: 'bg-health-light'
    },
    {
      id: '2',
      name: 'Real Estate',
      description: 'Access top resources for real estate investment and education.',
      image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      slug: 'real-estate',
      bg_color: 'bg-real-estate-light'
    }
  ];

  // Only show categories if authenticated
  const displayCategories = isAuthenticated ? (categories.length > 0 ? categories : defaultCategories) : [];

  // If not authenticated, don't render the section at all
  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Explore Categories</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                <Skeleton className="h-48 w-full mb-4 rounded-md" />
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {displayCategories.map(category => (
              <Link 
                key={category.id} 
                to={`/products/${category.slug}`}
                className="group block overflow-hidden"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                      <img 
                        src={category.image_url} 
                        alt={category.name} 
                        className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{category.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                    <div className="mt-4 text-primary font-medium flex items-center">
                      <span>Browse Products</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCategories;
