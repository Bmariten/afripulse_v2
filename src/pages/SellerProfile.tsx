import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BadgeCheck, Star, MapPin, Phone, Mail, 
  Globe, Edit, ShoppingBag, BarChart3, Settings,
  Calendar, TrendingUp, Award, Shield, DollarSign
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  sales: number;
}

const SellerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    productsSold: 0,
    productCount: 0,
    averageRating: 0,
    totalReviews: 0,
    conversionRate: 0,
    daysActive: 0
  });

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch seller profile data
        const profileRes = await api.get('/sellers/profile');
        
        // Calculate profile completeness with weighted fields
        const profile = profileRes.data;
        
        // Define fields with their weights (importance)
        const profileFields = [
          { name: 'business_name', weight: 15, required: true },
          { name: 'business_description', weight: 10, required: true },
          { name: 'business_address', weight: 10, required: true },
          { name: 'business_city', weight: 5, required: true },
          { name: 'business_state', weight: 5, required: true },
          { name: 'business_country', weight: 5, required: true },
          { name: 'business_zip_code', weight: 5, required: true },
          { name: 'business_phone', weight: 10, required: true },
          { name: 'business_email', weight: 10, required: true },
          { name: 'business_website', weight: 5, required: false },
          { name: 'business_logo', weight: 10, required: false },
          { name: 'tax_id', weight: 5, required: false },
          { name: 'business_registration_number', weight: 5, required: false }
        ];
        
        // Calculate total possible weight and achieved weight
        const totalWeight = profileFields.reduce((sum, field) => sum + field.weight, 0);
        const achievedWeight = profileFields.reduce((sum, field) => {
          // Check if field exists and is not empty
          const hasValue = profile[field.name] && 
                          typeof profile[field.name] === 'string' && 
                          profile[field.name].trim() !== '';
          return sum + (hasValue ? field.weight : 0);
        }, 0);
        
        // Calculate missing required fields for detailed feedback
        const missingRequiredFields = profileFields
          .filter(field => field.required && 
                  (!profile[field.name] || 
                   typeof profile[field.name] !== 'string' || 
                   profile[field.name].trim() === ''))
          .map(field => field.name);
        
        // Set profile completeness percentage
        setProfileCompleteness(Math.round((achievedWeight / totalWeight) * 100));
        
        // Store missing fields for UI feedback
        setMissingFields(missingRequiredFields);
        
        // Fetch seller stats
        const statsRes = await api.get('/sellers/dashboard-stats');
        setStats({
          totalSales: statsRes.data.total_sales || 0,
          productsSold: statsRes.data.products_sold || 0,
          productCount: statsRes.data.total_products || 0,
          averageRating: statsRes.data.average_rating || 0,
          totalReviews: statsRes.data.total_reviews || 0,
          conversionRate: statsRes.data.conversion_rate || 0,
          daysActive: statsRes.data.days_active || 0
        });
        
        // Fetch top products
        const productsRes = await api.get('/sellers/top-products');
        setTopProducts(productsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch seller data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your profile data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSellerData();
  }, [user, toast]);

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const businessName = user.seller_profile?.business_name || 'Your Business';
  const businessDescription = user.seller_profile?.business_description || 'No description provided';
  
  return (
    <MainLayout showSidebar userRole="seller" pageTitle="">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="h-48 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 rounded-xl"></div>
          <div className="absolute -bottom-16 left-8 flex items-end">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={user.profile?.avatar || ''} />
              <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                {getInitials(businessName)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute bottom-4 right-8 flex space-x-3">
            <Button 
              variant="outline" 
              className="bg-white hover:bg-gray-100"
              onClick={() => navigate('/seller/settings')}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Manage Products
            </Button>
          </div>
        </div>
        
        {/* Profile Header */}
        <div className="mt-20 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold">{businessName}</h1>
                <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-700 border-blue-200">
                  <BadgeCheck className="h-3 w-3 mr-1" /> Verified Seller
                </Badge>
              </div>
              <p className="text-gray-600 mt-1">{businessDescription}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {user.seller_profile?.business_city}, {user.seller_profile?.business_country}
                </span>
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span>Member since {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="flex items-center mr-4">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="font-medium">{stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}</span>
                <span className="text-gray-500 ml-1">({stats.totalReviews || 0} reviews)</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="h-3 w-3 mr-1" /> {stats.productsSold || 0} Sales
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Profile Completeness */}
        {profileCompleteness < 100 && (
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="font-medium text-amber-800">Complete Your Profile</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    A complete profile helps build trust with customers and improves your visibility.
                    {missingFields.length > 0 && (
                      <span className="block mt-1">
                        Missing: {missingFields.map(field => field.replace('business_', '').replace('_', ' ')).join(', ')}
                      </span>
                    )}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-3 md:mt-0 border-amber-300 text-amber-800 hover:bg-amber-100"
                  onClick={() => navigate('/seller/settings')}
                >
                  Complete Profile
                </Button>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-amber-800">Profile Completeness</span>
                  <span className="font-medium text-amber-800">{profileCompleteness}%</span>
                </div>
                <Progress value={profileCompleteness} className="h-2 bg-amber-200" />
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-indigo-100">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Total Sales</p>
                  <h3 className="text-3xl font-bold text-indigo-900">
                    {stats.totalSales > 0 ? `$${stats.totalSales.toFixed(2)}` : '$0.00'}
                  </h3>
                  <p className="text-xs text-indigo-500 mt-1">Last 30 days</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Products Sold</p>
                  <h3 className="text-3xl font-bold text-blue-900">{stats.productsSold || 0}</h3>
                  <p className="text-xs text-blue-500 mt-1">All time</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Conversion Rate</p>
                  <h3 className="text-3xl font-bold text-emerald-900">{stats.conversionRate || 0}%</h3>
                  <p className="text-xs text-emerald-500 mt-1">Visits to sales</p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Active Products</p>
                  <h3 className="text-3xl font-bold text-amber-900">{stats.productCount || 0}</h3>
                  <p className="text-xs text-amber-500 mt-1">Listed for sale</p>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Top Products */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 text-amber-500 mr-2" />
                    Top Performing Products
                  </CardTitle>
                  <CardDescription>Your best selling products by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  {topProducts.length > 0 ? (
                    <div className="space-y-6">
                      {topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-4">
                            <img 
                              src={product.image || 'https://via.placeholder.com/100'} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{product.name}</h4>
                              <span className="font-medium">${product.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>{product.category}</span>
                              <span>{product.sales} sold</span>
                            </div>
                            <div className="mt-1 flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                    fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 ml-1">({product.rating > 0 ? product.rating.toFixed(1) : 'N/A'})</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No products data available</h3>
                        <p className="text-gray-500 mb-4">Add your first product to start selling and see your top performers here.</p>
                        <Button onClick={() => navigate('/seller/products')} className="w-full">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add Your First Product
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Contact & Business Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-500 mr-2" />
                    Business Information
                  </CardTitle>
                  <CardDescription>Your business contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Business Address</h4>
                    {user.seller_profile?.business_address ? (
                      <p className="mt-1">
                        {user.seller_profile.business_address}<br />
                        {[user.seller_profile.business_city, user.seller_profile.business_state].filter(Boolean).join(', ')} {user.seller_profile.business_zip_code}<br />
                        {user.seller_profile.business_country}
                      </p>
                    ) : (
                      <div className="mt-1 flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>No address provided</span>
                        <Button variant="link" className="ml-2 p-0 h-auto text-blue-600" onClick={() => navigate('/seller/settings')}>
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className={!user.seller_profile?.business_phone ? 'text-gray-500' : ''}>
                            {user.seller_profile?.business_phone || 'No phone provided'}
                          </span>
                        </div>
                        {!user.seller_profile?.business_phone && (
                          <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => navigate('/seller/settings')}>
                            Add
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className={!user.seller_profile?.business_email ? 'text-gray-500' : ''}>
                            {user.seller_profile?.business_email || 'No email provided'}
                          </span>
                        </div>
                        {!user.seller_profile?.business_email && (
                          <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => navigate('/seller/settings')}>
                            Add
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 text-gray-400 mr-2" />
                          <span className={!user.seller_profile?.business_website ? 'text-gray-500' : ''}>
                            {user.seller_profile?.business_website || 'No website provided'}
                          </span>
                        </div>
                        {!user.seller_profile?.business_website && (
                          <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => navigate('/seller/settings')}>
                            Add
                          </Button>
                        )}
                      </div>
                      {/* Website would go here if available in the seller profile */}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Account Status</h4>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 flex justify-center">
                  <Button variant="outline" size="sm" onClick={() => navigate('/seller/settings')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Business Info
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
                <CardDescription>Manage your product listings</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.productCount > 0 ? (
                  <div className="text-center py-8">
                    <p className="mb-4">You have {stats.productCount} active product listings</p>
                    <Button onClick={() => navigate('/seller/products')}>
                      Manage Products
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                      <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No products yet</h3>
                      <p className="text-gray-500 mb-4">Start selling by adding your first product to your store.</p>
                      <Button onClick={() => navigate('/seller/products')} className="w-full">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add Your First Product
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>View detailed performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.totalSales > 0 ? (
                  <div className="text-center py-8">
                    <p className="mb-4">View detailed analytics about your ${stats.totalSales.toFixed(2)} in sales</p>
                    <Button onClick={() => navigate('/seller/insights')}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No sales data yet</h3>
                      <p className="text-gray-500 mb-4">Once you make your first sale, you'll see detailed analytics here.</p>
                      <Button variant="outline" onClick={() => navigate('/seller/products')} className="w-full">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add Products to Start Selling
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account and business profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
                    <Settings className="h-16 w-16 mx-auto mb-4 text-blue-300" />
                    <h3 className="text-lg font-medium text-blue-700 mb-2">Manage Your Business Settings</h3>
                    <p className="text-blue-600 mb-4">
                      {profileCompleteness < 100 
                        ? `Your profile is ${profileCompleteness}% complete. Complete it to improve visibility.` 
                        : 'Your profile is complete! You can still update your information anytime.'}
                    </p>
                    <Button onClick={() => navigate('/seller/settings')} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Business Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SellerProfile;
