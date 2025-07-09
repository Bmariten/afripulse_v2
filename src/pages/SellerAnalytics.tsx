import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, TrendingUp, Package, Users, ShoppingCart, 
  Calendar, Clock, MapPin, BarChart2, PieChart as PieChartIcon
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatsCard from '@/components/dashboard/StatsCard';
import MainLayout from '@/components/layout/MainLayout';

// Define types for our analytics data
interface AnalyticsData {
  // Sales metrics
  totalRevenue: number;
  salesGrowth: number;
  productsSold: number;
  averageOrderValue: number;
  conversionRate: number;
  
  // Customer metrics
  newCustomers: number;
  customerRetentionRate: number;
  
  // Time series data
  revenueByDay: { date: string; revenue: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  
  // Product performance
  topProducts: { name: string; value: number; percentage: number }[];
  productCategories: { category: string; count: number }[];
  
  // Geographic data
  salesByRegion: { region: string; sales: number }[];
  
  // Cart metrics
  cartAbandonment: number;
  
  // Timestamp for debugging
  timestamp: string;
  dataSource: string;
}

// Default empty state
const emptyAnalyticsData: AnalyticsData = {
  totalRevenue: 0,
  salesGrowth: 0,
  productsSold: 0,
  averageOrderValue: 0,
  conversionRate: 0,
  newCustomers: 0,
  customerRetentionRate: 0,
  revenueByDay: [],
  revenueByMonth: [],
  topProducts: [],
  productCategories: [],
  salesByRegion: [],
  cartAbandonment: 0,
  timestamp: new Date().toISOString(),
  dataSource: 'initialized'
};

const SellerAnalytics = (): JSX.Element => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('30days');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(emptyAnalyticsData);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasData, setHasData] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('Last 30 days');
  const [comparisonPeriod, setComparisonPeriod] = useState('vs previous 30 days');

  useEffect(() => {
    if (!user) return;
    
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch revenue per month
        console.log('Fetching monthly revenue for seller:', user.id, 'with timeframe:', timeframe);
        const timestamp = new Date().getTime();
        const { data: monthlyRevenue } = await api.get(
          `/sellers/analytics/monthly-revenue`, 
          { 
            params: { 
              seller_id: user.id,
              timeframe: timeframe,
              _t: timestamp // Add timestamp to prevent caching
            }
          }
        );
        console.log('Monthly revenue data received:', monthlyRevenue);
        setRevenueData(monthlyRevenue || []);
        
        // Fetch top products (by sales count)
        console.log('Fetching top products for seller:', user.id);
        const { data: topProducts } = await api.get(
          `/sellers/analytics/top-products`, 
          { 
            params: { seller_id: user.id }
          }
        );
        console.log('Top products data received:', topProducts);
        setProductData(
          (topProducts || []).map((p: any) => ({ name: p.product_name, value: p.units_sold }))
        );
        
        // Fetch stats with aggressive cache busting
        console.log('Fetching stats for seller:', user.id, 'with timeframe:', timeframe);
        const statsTimestamp = new Date().getTime();
        const randomValue = Math.floor(Math.random() * 1000000); // Large random number
        
        // Clear any cached data first by making a HEAD request
        try {
          await api.head(`/sellers/analytics/stats?_clear_cache=${randomValue}`);
        } catch (e) {
          // Ignore errors from HEAD request
        }
        
        // Now make the actual GET request with cache busting parameters
        const { data: analyticsStats } = await api.get(
          `/sellers/analytics/stats`, 
          { 
            params: { 
              seller_id: user.id,
              timeframe: timeframe,
              _t: statsTimestamp,
              _r: randomValue,
              _nocache: true
            },
            headers: {
              'Cache-Control': 'no-cache, no-store',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }
        );
        console.log('Stats data received:', analyticsStats);
        
        // Verify if we're getting the test values
        if (analyticsStats?.test_value) {
          console.log('SUCCESS: Received test values from backend:', analyticsStats.test_value);
          console.log('Backend timestamp:', analyticsStats.timestamp);
          console.log('Random value:', analyticsStats.random_value);
        } else {
          console.warn('WARNING: Did not receive test values from backend!');
        }
        
        // Set time period descriptions based on timeframe
        let timePeriod = '';
        let comparisonPeriod = '';
        
        switch(timeframe) {
          case 'weekly':
            timePeriod = 'Last 7 days';
            comparisonPeriod = 'vs previous week';
            break;
          case 'yearly':
            timePeriod = 'This year';
            comparisonPeriod = 'vs previous year';
            break;
          case 'monthly':
          default:
            timePeriod = 'Last 30 days';
            comparisonPeriod = 'vs previous month';
            break;
        }
        
        const stats = {
          totalRevenue: analyticsStats?.total_revenue || 0,
          salesGrowth: analyticsStats?.sales_growth || 0,
          productsSold: analyticsStats?.products_sold || 0,
          timePeriod,
          comparisonPeriod
        };
        
        setStats(stats);
        
        // Check if there's any meaningful data
        const hasAnyData = 
          stats.totalRevenue > 0 || 
          stats.productsSold > 0 || 
          monthlyRevenue?.some((item: any) => item.revenue > 0) || 
          topProducts?.length > 0;
          
        setHasData(hasAnyData);
      } catch (err: any) {
        console.error('Error fetching analytics data:', err);
        setError(err?.response?.data?.message || 'Failed to load analytics data');
        // Set default empty data in case of error
        setRevenueData([]);
        setProductData([]);
        setStats({
          totalRevenue: 0,
          salesGrowth: 0,
          productsSold: 0,
          timePeriod: 'Last 30 days',
          comparisonPeriod: 'vs previous month',
        });
        setHasData(false);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [user, timeframe]);

  return (
    <MainLayout
      showSidebar={true}
      userRole="seller"
      pageTitle="Seller Analytics"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
        
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {!loading && !error && !hasData && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-6 mb-6 text-center">
            <svg className="h-12 w-12 text-blue-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">No Analytics Data Available</h3>
            <p className="text-sm">You don't have any sales data yet. Once you start making sales, your analytics will appear here.</p>
          </div>
        )}
        
        {!loading && !error && hasData && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatsCard 
                title="Total Revenue" 
                value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={<DollarSign />} 
                description={stats.timePeriod}
                trend={{ value: stats.salesGrowth, isPositive: stats.salesGrowth >= 0 }}
              />
              
              <StatsCard 
                title="Sales Growth" 
                value={`${stats.salesGrowth.toFixed(1)}%`}
                icon={<TrendingUp />} 
                description={stats.comparisonPeriod}
                trend={{ value: stats.salesGrowth, isPositive: stats.salesGrowth >= 0 }}
              />
              
              <StatsCard 
                title="Products Sold" 
                value={stats.productsSold.toString()}
                icon={<ShoppingBag />} 
                description={stats.timePeriod}
                trend={{ value: stats.salesGrowth, isPositive: stats.salesGrowth >= 0 }}
              />
            </div>

            {/* Revenue Chart */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <Tabs defaultValue="monthly" onValueChange={setTimeframe}>
                  <TabsList>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#9b87f5" barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Product Performance and Sales Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Product Sales by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {productData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} units`, 'Sold']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Sales Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                        <Line type="monotone" dataKey="revenue" stroke="#9b87f5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default SellerAnalytics;
