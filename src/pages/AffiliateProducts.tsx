import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { fetchAffiliateMarketplaceProducts, Product, fetchCategories, Category } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/services/api';
import { ShoppingBag, Search, Filter, ArrowDownUp, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AffiliateProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  // Load products and categories
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch products from the affiliate marketplace endpoint
        const productsResponse = await fetchAffiliateMarketplaceProducts();
        setProducts(productsResponse.data || []);
        
        // Fetch categories
        const categoriesResponse = await fetchCategories();
        setCategories(categoriesResponse || []);
      } catch (error) {
        console.error("Failed to fetch marketplace data:", error);
        toast({
          title: "Error",
          description: "Could not load marketplace products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [toast]);
  
  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = !selectedCategory || 
      (product.category && product.category.id.toString() === selectedCategory);
      
    return matchesSearch && matchesCategory;
  });
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
  };

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
    <MainLayout
      showSidebar={true}
      userRole="affiliate"
      pageTitle="Affiliate Marketplace"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section with Abstract Pattern */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 mb-8 shadow-lg">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 w-40 h-40 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3"></div>
            <div className="absolute right-1/4 top-1/3 w-24 h-24 rounded-full bg-white/10"></div>
          </div>
          
          <div className="relative z-10">

            <p className="text-white/80 mb-6 max-w-2xl">Browse and promote high-quality products to your audience. Generate unique affiliate links and start earning commissions.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input 
                  className="bg-white/20 border-white/10 text-white placeholder:text-white/50 pl-10 focus-visible:ring-white/30 focus-visible:ring-offset-white/20"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <Button 
                className="bg-white text-indigo-600 hover:bg-white/90"
                disabled={!filteredProducts.length}
              >
                <Zap className="h-4 w-4 mr-2" />
                {filteredProducts.length} Products
              </Button>
            </div>
          </div>
        </div>
        
        {/* Active Filters */}
        {(searchTerm || selectedCategory) && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchTerm && (
              <Badge variant="outline" className="flex items-center gap-1 bg-white">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="outline" className="flex items-center gap-1 bg-white">
                Category: {categories.find(c => c.id.toString() === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              Clear all
            </Button>
          </div>
        )}
        
        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            // Skeleton loaders for categories
            Array(4).fill(0).map((_, index) => (
              <Card key={index} className="border-gray-100">
                <CardContent className="p-4 flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Real category data
            categories.slice(0, 4).map((category) => {
              const categoryProducts = products.filter(p => 
                p.category && p.category.id === category.id
              );
              const colorClasses = {
                1: 'border-blue-100 bg-gradient-to-br from-blue-50 to-white',
                2: 'border-purple-100 bg-gradient-to-br from-purple-50 to-white',
                3: 'border-green-100 bg-gradient-to-br from-green-50 to-white',
                4: 'border-amber-100 bg-gradient-to-br from-amber-50 to-white',
                5: 'border-pink-100 bg-gradient-to-br from-pink-50 to-white',
                6: 'border-indigo-100 bg-gradient-to-br from-indigo-50 to-white',
              };
              const iconColorClasses = {
                1: 'bg-blue-100 text-blue-600',
                2: 'bg-purple-100 text-purple-600',
                3: 'bg-green-100 text-green-600',
                4: 'bg-amber-100 text-amber-600',
                5: 'bg-pink-100 text-pink-600',
                6: 'bg-indigo-100 text-indigo-600',
              };
              
              const colorIndex = (category.id % 6) + 1 as 1|2|3|4|5|6;
              const isSelected = selectedCategory === category.id.toString();
              
              return (
                <Card 
                  key={category.id} 
                  className={`${colorClasses[colorIndex]} hover:shadow-md transition-all duration-300 cursor-pointer ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  onClick={() => handleCategorySelect(category.id.toString())}
                >
                  <CardContent className="p-4 flex items-center">
                    <div className={`${iconColorClasses[colorIndex]} p-2 rounded-full mr-3`}>
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-gray-500">{categoryProducts.length} products</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
        
        <Card className="border-indigo-100 overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <CardTitle className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-indigo-500" />
              {selectedCategory ? 
                `${categories.find(c => c.id.toString() === selectedCategory)?.name} Products` : 
                'Marketplace Products'}
            </CardTitle>
            <CardDescription>
              {searchTerm ? `Search results for "${searchTerm}"` : 'High-converting products with great commission rates'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-5 w-3/4 rounded" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                    <Skeleton className="h-8 w-full rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onGenerateLink={handleGenerateLink}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-indigo-50 p-4 rounded-full mb-4">
                      <Search className="h-8 w-8 text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4 max-w-md">
                      We couldn't find any products matching your search criteria. Try adjusting your filters or search term.
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AffiliateProducts;
