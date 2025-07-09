import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProductCard from '@/components/products/ProductCard';
import { fetchProducts, Product, fetchCategories, Category } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import MainLayout from '@/components/layout/MainLayout';

const ProductsPage = () => {
  const { slug: categorySlug } = useParams<{ slug?: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortOrder, setSortOrder] = useState('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);

        // Fetch products
        const options = {
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchQuery || undefined,
          limit: productsPerPage,
          offset: (currentPage - 1) * productsPerPage,
        };

        const response = await fetchProducts(options);
        const productsData = response.data || [];
        const totalCount = response.count || 0;

        setProducts(productsData);
        setTotalProducts(totalCount);

        // Determine maximum price for slider from fetched products
        if (productsData.length > 0) {
          const max = Math.max(...productsData.map(p => p.price));
          setMaxPrice(max > 1000 ? max : 1000);
          // Don't reset price range when fetching, let user control it
        }
      } catch (error) {
        console.error("Error loading products page data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, searchQuery, currentPage, sortOrder]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value as [number, number]);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredAndSortedProducts = products
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-select">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { key: "all", value: "all", label: "All Categories" },
                    ...categories.map(cat => ({ key: cat.id, value: cat.slug, label: cat.name }))
                  ].map((option) => (
                    <SelectItem key={option.key} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <Slider
                min={0}
                max={maxPrice}
                step={10}
                value={priceRange}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Products</h1>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { key: "newest", value: "newest", label: "Newest" },
                  { key: "price-asc", value: "price-asc", label: "Price: Low to High" },
                  { key: "price-desc", value: "price-desc", label: "Price: High to Low" }
                ].map((option) => (
                  <SelectItem key={option.key} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem key="prev">
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} />
                </PaginationItem>
                {Array.from({length: totalPages}, (_, i) => (
                  <PaginationItem key={`page-${i+1}`}>
                    <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem key="next">
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </main>
      </div>
    </div>
    </MainLayout>
  );
};

export default ProductsPage;
