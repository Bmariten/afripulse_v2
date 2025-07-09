import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, TrendingUp, Package, Users, ShoppingCart, 
  Calendar, Clock, MapPin, BarChart2, PieChart
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatsCard from '@/components/dashboard/StatsCard';
import BarChartComponent from '@/components/dashboard/charts/BarChart';
import PieChartComponent from '@/components/dashboard/charts/PieChart';

// Define types for our analytics data
// Define the shape of a recent order for the sales tab
interface ProductPerformance {
  id: string;
  name: string;
  price: number;
  inventory_count: number;
  status: string;
  units_sold: number;
  total_revenue: number;
}

interface TopCustomer {
  name: string;
  email: string;
  total_spent: number;
}

interface RecentOrder {
  id: string;
  customer_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: { product_name: string; quantity: number }[];
}

interface AnalyticsData {
  totalRevenue: number;
  salesGrowth: number;
  productsSold: number;
  averageOrderValue: number;
  conversionRate: number;
  newCustomers: number;
  customerRetentionRate: number;
  revenueByDay: { date: string; revenue: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  topProducts: { name: string; value: number; percentage: number }[];
  productCategories: { category: string; count: number }[];
  salesByRegion: { region: string; sales: number }[];
  cartAbandonment: number;
  recentOrders: RecentOrder[];
  productPerformance: ProductPerformance[];
  topCustomers: TopCustomer[];
}

const SellerInsights = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('30days');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/sellers/insights', {
          params: { timeframe },
        });
        setAnalyticsData(response.data);
      } catch (err) {
        console.error('Failed to fetch seller insights:', err);
        setError('Something went wrong. Could not load seller insights.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, timeframe]);

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };

  // Render loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Seller Insights</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // Render error state
  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Seller Insights</h1>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <button 
                className="underline ml-2"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  // Render empty state if no data
  if (!analyticsData) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Seller Insights</h1>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>
              There is no analytics data available for your account yet.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold">Seller Insights</h1>
          
          <div className="flex items-center mt-4 md:mt-0">
            <Select value={timeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Revenue"
                value={`$${analyticsData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={<DollarSign />}
                trend={`${analyticsData.salesGrowth > 0 ? '+' : ''}${analyticsData.salesGrowth}%`}
                trendType={analyticsData.salesGrowth >= 0 ? 'up' : 'down'}
                description="vs previous period"
              />
              
              <StatsCard 
                title="New Customers" 
                value={analyticsData.newCustomers.toLocaleString()} 
                description={`in the last ${timeframe} days`}
                icon={<Users className="h-4 w-4 text-muted-foreground" />} 
              />
              <StatsCard 
                title="Customer Retention" 
                value={`${analyticsData.customerRetentionRate.toFixed(1)}%`} 
                description="compared to previous period"
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} 
              />
              
              <StatsCard
                title="Avg. Order Value"
                value={`$${analyticsData.averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={<ShoppingCart />}
                description="Per transaction"
              />
              
              <StatsCard
                title="Conversion Rate"
                value={`${analyticsData.conversionRate}%`}
                icon={<TrendingUp />}
                description="Visitors to customers"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsData.revenueByMonth.length > 0 ? (
                    <BarChartComponent data={analyticsData.revenueByMonth} />
                  ) : (
                    <div className="text-center text-muted-foreground py-10">No sales data for this period.</div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Products by Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsData.topProducts.length > 0 ? (
                    <PieChartComponent data={analyticsData.topProducts} />
                  ) : (
                    <div className="text-center text-muted-foreground py-10">No top products for this period.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsData.revenueByDay.length > 0 ? (
                    <BarChartComponent data={analyticsData.revenueByDay.map(d => ({ month: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), revenue: d.revenue }))} />
                  ) : (
                    <div className="text-center text-muted-foreground py-10">No sales data for this period.</div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsData.recentOrders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analyticsData.recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id.substring(0, 7)}</TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>{order.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">${order.total_amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center text-muted-foreground py-10">No recent orders.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.productPerformance.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Inventory</TableHead>
                        <TableHead className="text-right">Units Sold</TableHead>
                        <TableHead className="text-right">Total Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyticsData.productPerformance.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>{product.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">${product.price.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{product.inventory_count}</TableCell>
                          <TableCell className="text-right">{product.units_sold}</TableCell>
                          <TableCell className="text-right">${product.total_revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center text-muted-foreground py-10">No product data available.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.topCustomers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Total Spent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyticsData.topCustomers.map((customer) => (
                        <TableRow key={customer.email}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell className="text-right">${customer.total_spent.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center text-muted-foreground py-10">No customer data available for this period.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SellerInsights;
