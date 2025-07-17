import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchFlaggedItems } from '@/services/admin.service';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, ShoppingBag, Wallet, AlertTriangle, Check, X, 
  TrendingUp, BarChart3, Activity, DollarSign, ShieldCheck, 
  Eye, EyeOff, Filter, RefreshCw, ChevronRight, LineChart,
  UserCheck, UserX, PieChart
} from 'lucide-react';
import api from '@/services/api';
import { Link, useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingItems, setPendingItems] = useState([]);
  const [flaggedActivities, setFlaggedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Stats with real data from backend
  const [stats, setStats] = useState({
    totalSellers: 0,
    totalProducts: 0,
    totalAffiliates: 0,
    totalRevenue: 0,
    activeListings: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Products Tab State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productStatus, setProductStatus] = useState('all');
  const [productCategory, setProductCategory] = useState('');
  const [productsPage, setProductsPage] = useState(1);
  const [productsPagination, setProductsPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_items: 0
  });
  const [productSummary, setProductSummary] = useState({
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0
  });
  const [productFilters, setProductFilters] = useState({
    categories: []
  });

  // Users Tab State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('all');
  const [usersPage, setUsersPage] = useState(1);
  const [usersPagination, setUsersPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_items: 0
  });
  const [userSummary, setUserSummary] = useState({
    total: 0,
    admin: 0,
    seller: 0,
    affiliate: 0,
    customer: 0
  });

  // Reports Tab State
  const [salesReports, setSalesReports] = useState({
    salesOverTime: [],
    topProducts: [],
    salesByCategory: [],
    summary: {
      totalSales: 0,
      averageOrderValue: 0,
      conversionRate: 0
    }
  });
  const [reportPeriod, setReportPeriod] = useState('month');
  const [reportsLoading, setReportsLoading] = useState(false);

  // Refresh dashboard data
  const refreshDashboard = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchTableData()]);
    setRefreshing(false);
    toast({
      title: 'Dashboard Updated',
      description: 'Latest data has been loaded.',
    });
  };

  // Fetch dashboard statistics
  const fetchStats = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/profile/dashboard-stats');
      
      setStats({
        totalSellers: statsRes.data.totalSellers || 0,
        totalProducts: statsRes.data.totalProducts || 0,
        totalAffiliates: statsRes.data.totalAffiliates || 0,
        totalRevenue: statsRes.data.totalRevenue || 0,
        activeListings: statsRes.data.activeListings || 0,
        conversionRate: statsRes.data.conversionRate || 0,
      });
      
      // If the backend doesn't provide these additional stats yet,
      // we should create an endpoint for them in the future
      if (!statsRes.data.activeListings || !statsRes.data.conversionRate) {
        console.log('Backend missing activeListings or conversionRate stats');
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard statistics.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch table data (pending products and flagged items)
  const fetchTableData = async () => {
    setIsLoading(true);
    try {
      const [pendingData, flaggedData] = await Promise.all([
        api.get('/products/admin/pending-products').then(res => res.data || []),
        fetchFlaggedItems().then(data => data || [])
      ]);
      setPendingItems(pendingData);
      setFlaggedActivities(flaggedData);
    } catch (err) {
      setError('Failed to load page content.');
      console.error('Failed to fetch pending/flagged items:', err);
      toast({
        title: 'Error',
        description: 'Could not load pending products or flagged items.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch products for Products tab
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      // Fetch product categories for filter dropdown if not already loaded
      if (productFilters.categories.length === 0) {
        const categoriesRes = await api.get('/categories');
        setProductFilters(prev => ({
          ...prev,
          categories: categoriesRes.data || []
        }));
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', productsPage.toString());
      params.append('per_page', '10');
      
      if (productSearchTerm) {
        params.append('search', productSearchTerm);
      }
      
      if (productStatus !== 'all') {
        params.append('status', productStatus);
      }
      
      if (productCategory) {
        params.append('category_id', productCategory);
      }
      
      const response = await api.get(`/admin/products?${params.toString()}`);
      
      setProducts(response.data.products || []);
      setProductsPagination({
        current_page: response.data.pagination.current_page,
        per_page: response.data.pagination.per_page,
        total_pages: response.data.pagination.total_pages,
        total_items: response.data.pagination.total_items
      });
      setProductSummary({
        total: response.data.summary.total || 0,
        active: response.data.summary.active || 0,
        pending: response.data.summary.pending || 0,
        inactive: response.data.summary.inactive || 0
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products data.',
        variant: 'destructive',
      });
    } finally {
      setProductsLoading(false);
    }
  };
  
  // Fetch users for Users tab
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      // Build query parameters
      const params = {
        page: usersPage,
        per_page: 10,
        search: userSearchTerm,
        role: userRole !== 'all' ? userRole : undefined
      };

      const response = await api.get('/admin/users', { params });
      setUsers(response.data.users || []);
      setUsersPagination({
        current_page: response.data.current_page || 1,
        per_page: response.data.per_page || 10,
        total_pages: response.data.total_pages || 1,
        total_items: response.data.total_items || 0
      });
      setUserSummary({
        total: response.data.summary?.total || 0,
        admin: response.data.summary?.admin || 0,
        seller: response.data.summary?.seller || 0,
        affiliate: response.data.summary?.affiliate || 0,
        customer: response.data.summary?.customer || 0
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users data.',
        variant: 'destructive',
      });
    } finally {
      setUsersLoading(false);
    }
  };
  
  // Fetch sales reports data
  const fetchSalesReports = async () => {
    setReportsLoading(true);
    try {
      const params = {
        period: reportPeriod
      };

      const response = await api.get('/admin/reports/sales', { params });
      setSalesReports({
        salesOverTime: response.data.salesOverTime || [],
        topProducts: response.data.topProducts || [],
        salesByCategory: response.data.salesByCategory || [],
        summary: {
          totalSales: response.data.summary?.totalSales || 0,
          averageOrderValue: response.data.summary?.averageOrderValue || 0,
          conversionRate: response.data.summary?.conversionRate || 0
        }
      });
    } catch (error) {
      console.error('Failed to fetch sales reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sales report data.',
        variant: 'destructive',
      });
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTableData();
    
    // Set up periodic refresh (every 5 minutes)
    const refreshInterval = setInterval(() => {
      fetchStats();
      fetchTableData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [toast]);
  
  // Load tab-specific data when tab changes
  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'reports') {
      fetchSalesReports();
    }
  }, [activeTab]);
  
  // Reload products when filters or pagination changes
  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    }
  }, [productsPage, productStatus, productCategory]);
  
  // Debounce search term changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (activeTab === 'products' && productSearchTerm !== undefined) {
        setProductsPage(1); // Reset to first page on new search
        fetchProducts();
      }
    }, 500);
    
    return () => clearTimeout(handler);
  }, [productSearchTerm]);
  
  // Load users data when tab changes or filters change
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, usersPage, userSearchTerm, userRole]);
  
  // Load reports data when tab changes or period changes
  useEffect(() => {
    if (activeTab === 'reports') {
      fetchSalesReports();
    }
  }, [activeTab, reportPeriod]);
  
  // Debounce user search term changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (activeTab === 'users' && userSearchTerm !== undefined) {
        setUsersPage(1); // Reset to first page on new search
        fetchUsers();
      }
    }, 500);
    
    return () => clearTimeout(handler);
  }, [userSearchTerm]);
  
  // Reload reports when period changes
  useEffect(() => {
    if (activeTab === 'reports') {
      fetchSalesReports();
    }
  }, [reportPeriod]);

  const handleApproveItem = async (id: string) => {
    try {
      await api.post(`/products/${id}/approve`);
      setPendingItems(prev => prev.filter((item: any) => item.id !== id));
      toast({
        title: 'Success',
        description: 'Product has been approved and is now active.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to approve the product. Please try again.',
        variant: 'destructive',
      });
      console.error(err);
    }
  };

  const handleRejectItem = async (id: string) => {
    try {
      await api.post(`/products/${id}/reject`);
      setPendingItems(prev => prev.filter((item: any) => item.id !== id));
      toast({
        title: 'Success',
        description: 'Product has been rejected.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to reject the product. Please try again.',
        variant: 'destructive',
      });
      console.error(err);
    }
  };
  
  const handleActivateAffiliate = async (id: string) => {
    try {
      await api.post(`/admin/affiliates/${id}/activate`);
      // Refresh users list after activation
      fetchUsers();
      toast({
        title: 'Success',
        description: 'Affiliate account has been activated.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to activate the affiliate account. Please try again.',
        variant: 'destructive',
      });
      console.error(err);
    }
  };

  return (
    <MainLayout showSidebar userRole="admin" pageTitle="">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Monitor and manage your marketplace</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={refreshDashboard}
              disabled={refreshing}
            >
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
            
            <Button size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8 pt-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <StatsCard
                title="Total Sellers"
                value={loading ? '...' : stats.totalSellers.toLocaleString()}
                icon={<Users className="h-6 w-6" />}
                description="Total registered sellers"
                color="primary"
              />
              <StatsCard
                title="Total Products"
                value={loading ? '...' : stats.totalProducts.toLocaleString()}
                icon={<ShoppingBag className="h-6 w-6" />}
                description="Products across all categories"
                color="health"
              />
              <StatsCard
                title="Total Affiliates"
                value={loading ? '...' : stats.totalAffiliates.toLocaleString()}
                icon={<Users className="h-6 w-6" />}
                description="Registered affiliate marketers"
                color="info"
              />
              <StatsCard
                title="Total Revenue"
                value={loading ? '...' : `$${stats.totalRevenue.toLocaleString()}`}
                icon={<DollarSign className="h-6 w-6" />}
                description="Gross marketplace revenue"
                color="success"
              />
              <StatsCard
                title="Active Listings"
                value={loading ? '...' : stats.activeListings.toLocaleString()}
                icon={<ShieldCheck className="h-6 w-6" />}
                description="Currently active product listings"
                color="warning"
              />
              <StatsCard
                title="Conversion Rate"
                value={loading ? '...' : `${stats.conversionRate}%`}
                icon={<BarChart3 className="h-6 w-6" />}
                description="Visitor to purchase rate"
                color="real-estate"
              />
            </div>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 px-4"
                  onClick={() => navigate('/admin/products?action=add')}
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-1">
                      <ShoppingBag className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">Add New Product</span>
                    </div>
                    <span className="text-xs text-gray-500">Create a new product listing</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 px-4"
                  onClick={() => navigate('/admin/users')}
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-1">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">Manage Users</span>
                    </div>
                    <span className="text-xs text-gray-500">View and edit user accounts</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 px-4"
                  onClick={() => navigate('/admin/reports')}
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-1">
                      <Activity className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">View Reports</span>
                    </div>
                    <span className="text-xs text-gray-500">Access analytics and reports</span>
                  </div>
                </Button>
              </CardContent>
            </Card>
            
            {/* Pending Approvals */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-white border-l-4 border-yellow-400">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Products Pending Approval
                  </CardTitle>
                  <Badge variant="outline" className="bg-yellow-50">
                    {pendingItems.length} pending
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                              <span>Loading pending products...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : pendingItems.length > 0 ? (
                        pendingItems.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img 
                                  src={item.images?.[0]?.image_url || '/placeholder.svg'}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-md object-cover"
                                />
                                <span className="font-medium">{item.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{item.sellerBusinessName}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-gray-50">
                                {item.category?.name}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">${item.price}</TableCell>
                            <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50" onClick={() => handleApproveItem(item.id)}>
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" onClick={() => handleRejectItem(item.id)}>
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                            <div className="flex flex-col items-center">
                              <ShieldCheck className="h-8 w-8 text-green-500 mb-2" />
                              <p>No products are currently pending approval.</p>
                              <p className="text-sm text-gray-400">All product submissions have been reviewed.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between py-4 bg-gray-50">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/products/pending" className="flex items-center gap-1">
                    View all pending
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Flagged Items */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-red-50 to-white border-l-4 border-red-400">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Flagged Activities
                  </CardTitle>
                  <Badge variant="outline" className="bg-red-50 text-red-600">
                    {flaggedActivities.length} issues
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Affiliate</TableHead>
                        <TableHead>Issue</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                              <span>Loading flagged activities...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : flaggedActivities.length > 0 ? (
                        flaggedActivities.map((activity: any) => (
                          <TableRow key={activity.id}>
                            <TableCell>
                              <div className="font-medium">
                                {activity.name.split(' by ')[1] || 'System'}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {activity.reason || activity.name}
                            </TableCell>
                            <TableCell>{new Date(activity.reportDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Pending Review
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  Review
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                            <div className="flex flex-col items-center">
                              <ShieldCheck className="h-8 w-8 text-green-500 mb-2" />
                              <p>No flagged activities found.</p>
                              <p className="text-sm text-gray-400">All activities are currently in good standing.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between py-4 bg-gray-50">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/flagged" className="flex items-center gap-1">
                    View all flagged items
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6 pt-4">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-400">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <ShoppingBag className="h-5 w-5 text-blue-500" />
                      Products Management
                    </CardTitle>
                    <CardDescription>View, filter and manage all products in your marketplace</CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="pl-8 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        value={productSearchTerm}
                      />
                      <div className="absolute left-2.5 top-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      </div>
                    </div>
                    
                    <select 
                      className="border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={productStatus}
                      onChange={(e) => setProductStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                    
                    <select 
                      className="border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {productFilters.categories?.map((category: any) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={fetchProducts}
                    >
                      <RefreshCw className={`h-4 w-4 ${productsLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                              <span>Loading products...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : products.length > 0 ? (
                        products.map((product: any) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img 
                                  src={product.images?.[0]?.image_url || '/placeholder.svg'}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-md object-cover"
                                />
                                <span className="font-medium">{product.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-gray-50">
                                {product.category?.name}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">${product.price}</TableCell>
                            <TableCell>
                              {!product.is_approved ? (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  Pending
                                </Badge>
                              ) : product.is_active ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  View
                                </Button>
                                {!product.is_approved && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-green-500 text-green-600 hover:bg-green-50"
                                    onClick={() => handleApproveItem(product.id)}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                            <div className="flex flex-col items-center">
                              <ShoppingBag className="h-8 w-8 text-gray-300 mb-2" />
                              <p>No products found.</p>
                              <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              
              {productsPagination.total_pages > 1 && (
                <CardFooter className="flex justify-between py-4 bg-gray-50">
                  <div className="text-sm text-gray-500">
                    Showing {(productsPagination.current_page - 1) * productsPagination.per_page + 1} to {Math.min(productsPagination.current_page * productsPagination.per_page, productsPagination.total_items)} of {productsPagination.total_items} products
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={productsPagination.current_page === 1}
                      onClick={() => setProductsPage(productsPagination.current_page - 1)}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={productsPagination.current_page === productsPagination.total_pages}
                      onClick={() => setProductsPage(productsPagination.current_page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-blue-100 inline-flex p-3 rounded-full text-blue-500 mb-4">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{productSummary.total || 0}</h3>
                    <p className="text-sm text-gray-500">Total Products</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-green-100 inline-flex p-3 rounded-full text-green-500 mb-4">
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{productSummary.active || 0}</h3>
                    <p className="text-sm text-gray-500">Active Products</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-yellow-100 inline-flex p-3 rounded-full text-yellow-500 mb-4">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{productSummary.pending || 0}</h3>
                    <p className="text-sm text-gray-500">Pending Approval</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-gray-100 inline-flex p-3 rounded-full text-gray-500 mb-4">
                      <EyeOff className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{productSummary.inactive || 0}</h3>
                    <p className="text-sm text-gray-500">Inactive Products</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6 pt-4">
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-l-4 border-purple-400">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Users className="h-5 w-5 text-purple-500" />
                      Users Management
                    </CardTitle>
                    <CardDescription>View and manage all users in your marketplace</CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-8 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        value={userSearchTerm}
                      />
                      <div className="absolute left-2.5 top-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      </div>
                    </div>
                    
                    <select 
                      className="border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="seller">Seller</option>
                      <option value="affiliate">Affiliate</option>
                      <option value="customer">Customer</option>
                    </select>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={fetchUsers}
                    >
                      <RefreshCw className={`h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                              <span>Loading users...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : users.length > 0 ? (
                        users.map((user: any) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                  {user.first_name ? user.first_name[0] : user.email[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium">{user.first_name} {user.last_name}</div>
                                  <div className="text-sm text-gray-500">{user.username || 'No username'}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                user.role === 'seller' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                user.role === 'affiliate' ? 'bg-green-50 text-green-700 border-green-200' :
                                'bg-gray-50 text-gray-700 border-gray-200'
                              }>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.is_active ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  View
                                </Button>
                                {user.role === 'affiliate' && !user.is_active && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-green-500 text-green-600 hover:bg-green-50"
                                    onClick={() => handleActivateAffiliate(user.id)}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Activate
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                            <div className="flex flex-col items-center">
                              <Users className="h-8 w-8 text-gray-300 mb-2" />
                              <p>No users found.</p>
                              <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              
              {usersPagination.total_pages > 1 && (
                <CardFooter className="flex justify-between py-4 bg-gray-50">
                  <div className="text-sm text-gray-500">
                    Showing {(usersPagination.current_page - 1) * usersPagination.per_page + 1} to {Math.min(usersPagination.current_page * usersPagination.per_page, usersPagination.total_items)} of {usersPagination.total_items} users
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={usersPagination.current_page === 1}
                      onClick={() => setUsersPage(usersPagination.current_page - 1)}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={usersPagination.current_page === usersPagination.total_pages}
                      onClick={() => setUsersPage(usersPagination.current_page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-gray-100 inline-flex p-3 rounded-full text-gray-500 mb-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{userSummary.total || 0}</h3>
                    <p className="text-sm text-gray-500">Total Users</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-purple-100 inline-flex p-3 rounded-full text-purple-500 mb-4">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{userSummary.admin || 0}</h3>
                    <p className="text-sm text-gray-500">Admins</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-blue-100 inline-flex p-3 rounded-full text-blue-500 mb-4">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{userSummary.seller || 0}</h3>
                    <p className="text-sm text-gray-500">Sellers</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-green-100 inline-flex p-3 rounded-full text-green-500 mb-4">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{userSummary.affiliate || 0}</h3>
                    <p className="text-sm text-gray-500">Affiliates</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-yellow-100 inline-flex p-3 rounded-full text-yellow-500 mb-4">
                      <UserX className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{userSummary.customer || 0}</h3>
                    <p className="text-sm text-gray-500">Customers</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-green-500" />
                  Sales Reports
                </h2>
                <p className="text-gray-500">View sales performance and analytics</p>
              </div>
              
              <div className="flex items-center gap-3">
                <select 
                  className="border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last 12 Months</option>
                </select>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={fetchSalesReports}
                >
                  <RefreshCw className={`h-4 w-4 ${reportsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-green-100 inline-flex p-3 rounded-full text-green-500 mb-4">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">${salesReports.summary.totalSales.toLocaleString()}</h3>
                    <p className="text-sm text-gray-500">Total Sales</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-blue-100 inline-flex p-3 rounded-full text-blue-500 mb-4">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">${salesReports.summary.averageOrderValue.toLocaleString()}</h3>
                    <p className="text-sm text-gray-500">Average Order Value</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-purple-100 inline-flex p-3 rounded-full text-purple-500 mb-4">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{salesReports.summary.conversionRate}%</h3>
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sales Over Time Chart */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-green-500" />
                  Sales Over Time
                </CardTitle>
                <CardDescription>
                  {reportPeriod === 'week' ? 'Daily sales for the last 7 days' : 
                   reportPeriod === 'month' ? 'Daily sales for the last 30 days' : 
                   'Monthly sales for the last 12 months'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : salesReports.salesOverTime.length > 0 ? (
                  <div className="h-64 relative">
                    {/* Chart visualization would go here */}
                    {/* For now, we'll show a placeholder with the data */}
                    <div className="flex flex-col h-full justify-end">
                      <div className="flex items-end justify-between h-48 border-b border-l">
                        {salesReports.salesOverTime.map((item: any, index: number) => {
                          const height = `${Math.max(5, (item.amount / Math.max(...salesReports.salesOverTime.map((i: any) => i.amount))) * 100)}%`;
                          return (
                            <div key={index} className="flex flex-col items-center mx-1" style={{ height: '100%' }}>
                              <div 
                                className="w-12 bg-green-500 opacity-80 rounded-t-sm" 
                                style={{ height }}
                                title={`${item.date}: $${item.amount}`}
                              />
                              <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left">
                                {item.date.split(' ')[0]}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <BarChart3 className="h-12 w-12 text-gray-300 mb-2" />
                    <p>No sales data available for this period.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-blue-500" />
                    Top Products
                  </CardTitle>
                  <CardDescription>Best selling products by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  {reportsLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : salesReports.topProducts.length > 0 ? (
                    <div className="space-y-4">
                      {salesReports.topProducts.map((product: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${product.revenue.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{product.units} units</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
                      <p>No product data available for this period.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Sales by Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-500" />
                    Sales by Category
                  </CardTitle>
                  <CardDescription>Revenue distribution across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  {reportsLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : salesReports.salesByCategory.length > 0 ? (
                    <div className="space-y-4">
                      {salesReports.salesByCategory.map((category: any, index: number) => {
                        const percentage = Math.round((category.revenue / salesReports.summary.totalSales) * 100);
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{category.name}</span>
                              <span className="text-sm">${category.revenue.toLocaleString()} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="h-2.5 rounded-full" 
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: [
                                    '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', 
                                    '#6366F1', '#14B8A6', '#F43F5E'
                                  ][index % 8]
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <PieChart className="h-12 w-12 text-gray-300 mb-2" />
                      <p>No category data available for this period.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
