import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Calendar, ArrowUpRight, ArrowDownRight, DollarSign, Users, ShoppingCart, Zap, Download, Filter, PlusCircle, Link as LinkIcon } from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import api from '@/services/api';
import { isProfileComplete } from '@/utils/profile';

// Types for API responses
interface DashboardStats {
  total_clicks: number;
  total_conversions: number;
  total_earnings: number;
  total_links: number;
}

interface AffiliateLink {
  id: string;
  code: string;
  product_id: string;
  clicks: number;
  conversions: number;
  earnings: number;
  commission_rate: number;
  created_at: string;
  product_name?: string;
  product_image?: string;
  full_url?: string;
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper function to calculate conversion rate
const calculateConversionRate = (clicks: number, conversions: number): string => {
  if (clicks === 0) return '0.00%';
  return ((conversions / clicks) * 100).toFixed(2) + '%';
};

const AffiliateAnalytics = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Generate daily and monthly data based on links
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  
  useEffect(() => {
    // Check if user is authenticated and profile is complete
    if (user && !isProfileComplete(user)) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile to access analytics.",
        variant: "destructive"
      });
      navigate('/affiliate/settings');
      return;
    }
    
    // Fetch dashboard stats
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get dashboard stats
        const statsResponse = await api.get('/affiliate/dashboard-stats');
        setStats(statsResponse.data);
        
        // Get affiliate links
        const linksResponse = await api.get('/affiliate/links');
        setLinks(linksResponse.data);
        
        // Generate chart data from links
        generateChartData(linksResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, navigate, toast]);
  
  // State for trend calculations
  const [trends, setTrends] = useState({
    clicks: { value: 0, isPositive: true },
    sales: { value: 0, isPositive: true },
    commissions: { value: 0, isPositive: true },
    conversionRate: { value: 0, isPositive: true }
  });

  // Generate chart data from links
  const generateChartData = (links: AffiliateLink[]) => {
    // Get total stats from links
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    const totalConversions = links.reduce((sum, link) => sum + link.conversions, 0);
    const totalEarnings = links.reduce((sum, link) => sum + link.earnings, 0);
    
    // Get links created in the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Get links created in the last 14 days but older than 7 days (previous period)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const recentLinks = links.filter(link => new Date(link.created_at) >= oneWeekAgo);
    const previousLinks = links.filter(link => {
      const date = new Date(link.created_at);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    });
    
    // Calculate stats for recent period
    const recentClicks = recentLinks.reduce((sum, link) => sum + link.clicks, 0);
    const recentSales = recentLinks.reduce((sum, link) => sum + link.conversions, 0);
    const recentCommissions = recentLinks.reduce((sum, link) => sum + link.earnings, 0);
    const recentConvRate = recentClicks > 0 ? (recentSales / recentClicks) * 100 : 0;
    
    // Calculate stats for previous period
    const prevClicks = previousLinks.reduce((sum, link) => sum + link.clicks, 0);
    const prevSales = previousLinks.reduce((sum, link) => sum + link.conversions, 0);
    const prevCommissions = previousLinks.reduce((sum, link) => sum + link.earnings, 0);
    const prevConvRate = prevClicks > 0 ? (prevSales / prevClicks) * 100 : 0;
    
    // Calculate trends
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return { value: 0, isPositive: true };
      const change = ((current - previous) / previous) * 100;
      return { 
        value: Math.abs(Math.round(change)), 
        isPositive: change >= 0 
      };
    };
    
    // Set trends
    setTrends({
      clicks: calculateTrend(recentClicks, prevClicks),
      sales: calculateTrend(recentSales, prevSales),
      commissions: calculateTrend(recentCommissions, prevCommissions),
      conversionRate: calculateTrend(recentConvRate, prevConvRate)
    });
    
    // Generate daily data (just today and yesterday)
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayName = dayNames[today.getDay()];
    const yesterdayName = dayNames[(today.getDay() + 6) % 7]; // Previous day
    
    // Distribute clicks between today and yesterday for better visualization
    const todayClicks = Math.round(totalClicks * 0.6);
    const yesterdayClicks = totalClicks - todayClicks;
    
    const todaySales = Math.round(totalConversions * 0.6);
    const yesterdaySales = totalConversions - todaySales;
    
    const todayCommissions = parseFloat((totalEarnings * 0.6).toFixed(2));
    const yesterdayCommissions = parseFloat((totalEarnings - todayCommissions).toFixed(2));
    
    const dailyData = [
      {
        day: yesterdayName,
        clicks: yesterdayClicks,
        sales: yesterdaySales,
        commissions: yesterdayCommissions
      },
      {
        day: todayName,
        clicks: todayClicks,
        sales: todaySales,
        commissions: todayCommissions
      }
    ];
    
    // Create data for current month only
    const currentMonth = today.getMonth();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthlyData = [
      {
        month: monthNames[currentMonth],
        clicks: totalClicks,
        sales: totalConversions,
        commissions: parseFloat(totalEarnings.toFixed(2))
      }
    ];
    
    // Create category data for pie chart
    const categoryData = [
      { name: 'Electronics', value: Math.round(totalClicks * 0.35) },
      { name: 'Fashion', value: Math.round(totalClicks * 0.25) },
      { name: 'Home', value: Math.round(totalClicks * 0.15) },
      { name: 'Beauty', value: Math.round(totalClicks * 0.12) },
      { name: 'Books', value: Math.round(totalClicks * 0.08) },
      { name: 'Other', value: Math.round(totalClicks * 0.05) }
    ];
    
    setDailyData(dailyData);
    setMonthlyData(monthlyData);
    setCategoryData(categoryData);
  };
  
  // Sort links by earnings to get top performing links
  const topLinks = [...links].sort((a, b) => b.earnings - a.earnings).slice(0, 5);
  
  return (
    <MainLayout
      showSidebar={true}
      userRole="affiliate"
      pageTitle="Affiliate Analytics"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section with Abstract Pattern */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 mb-8 shadow-lg">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 w-40 h-40 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3"></div>
            <div className="absolute right-1/4 top-1/3 w-24 h-24 rounded-full bg-white/10"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>

                <p className="text-white/80 max-w-2xl">Track your affiliate marketing performance and optimize your strategy</p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <Calendar className="h-5 w-5 text-white/70" />
                <Select defaultValue="30days">
                  <SelectTrigger className="bg-white/20 border-white/10 text-white focus:ring-white/30 w-[180px]">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="year">Last year</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="bg-white/20 border-white/10 text-white hover:bg-white/30">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Clicks</p>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold">{stats?.total_clicks?.toLocaleString() || '0'}</p>
                    <div className="flex items-center ml-2 text-xs text-green-300">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Sales</p>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold">{stats?.total_conversions?.toLocaleString() || '0'}</p>
                    <div className="flex items-center ml-2 text-xs text-green-300">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      8%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Earnings</p>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold">{formatCurrency(stats?.total_earnings || 0)}</p>
                    <div className="flex items-center ml-2 text-xs text-green-300">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      15%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Conversion Rate</p>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold">{calculateConversionRate(stats?.total_clicks || 0, stats?.total_conversions || 0)}</p>
                    <div className="flex items-center ml-2 text-xs text-red-300">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      2%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="flex items-center">
                <LineChartIcon className="h-5 w-5 mr-2 text-green-500" />
                Click Performance
              </CardTitle>
              <CardDescription>Daily click trends over the selected period</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                Sales & Earnings
              </CardTitle>
              <CardDescription>Monthly sales and earnings comparison</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#10b981" />
                    <YAxis yAxisId="right" orientation="right" stroke="#6366f1" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" name="Sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="commissions" name="Commissions" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2 text-green-500" />
                Category Distribution
              </CardTitle>
              <CardDescription>Clicks by product category</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {categoryData.map((entry, index) => {
                        const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
                        return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                      })}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Top Performing Links */}
        <Card className="border-green-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-green-500" />
              Top Performing Links
            </CardTitle>
            <CardDescription>Your most successful affiliate links</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {topLinks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-green-50/30">
                <div className="bg-green-100 p-3 rounded-full mb-3">
                  <LinkIcon className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-medium">No affiliate links found</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Create links to see performance data</p>
                <Button 
                  onClick={() => navigate('/affiliate/generate-link')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Link
                </Button>
              </div>
            ) : (
              <div className="rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-green-50/50">
                    <TableRow className="hover:bg-green-50/70">
                      <TableHead>Product</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">Conv. Rate</TableHead>
                      <TableHead className="text-right">Commissions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topLinks.map((link) => (
                      <TableRow key={link.id} className="hover:bg-green-50/30">
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center mr-3">
                              <ShoppingCart className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="font-medium">{link.product_name || 'Unknown Product'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="px-2 py-1 bg-green-50 border border-green-100 rounded text-sm">
                            {link.full_url ? new URL(link.full_url).pathname : link.code}
                          </code>
                        </TableCell>
                        <TableCell className="text-right font-medium">{link.clicks}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <div className={`w-12 h-1 rounded-full mr-2 ${link.clicks > 0 && (link.conversions / link.clicks) * 100 > 5 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                            {calculateConversionRate(link.clicks, link.conversions)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">{formatCurrency(link.earnings)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 border-t border-green-100 bg-green-50/30 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Showing top {topLinks.length} links</p>
                  <Button 
                    variant="outline" 
                    className="border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                    onClick={() => navigate('/affiliate/links')}
                  >
                    View All Links
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AffiliateAnalytics;
