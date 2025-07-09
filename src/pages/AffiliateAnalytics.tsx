
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MousePointerClick, DollarSign, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
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
    
    setDailyData(dailyData);
    setMonthlyData(monthlyData);
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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading analytics data...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard 
                title="Total Clicks" 
                value={stats?.total_clicks?.toLocaleString() || '0'}
                icon={<MousePointerClick />} 
                description="Last 7 days vs previous"
                trend={trends.clicks}
              />
              
              <StatsCard 
                title="Total Sales" 
                value={stats?.total_conversions?.toLocaleString() || '0'}
                icon={<DollarSign />} 
                description="Last 7 days vs previous"
                trend={trends.sales}
              />
              
              <StatsCard 
                title="Commissions Earned" 
                value={formatCurrency(stats?.total_earnings || 0)}
                icon={<DollarSign />} 
                description="Last 7 days vs previous"
                trend={trends.commissions}
              />
              
              <StatsCard 
                title="Conversion Rate" 
                value={calculateConversionRate(stats?.total_clicks || 0, stats?.total_conversions || 0)}
                icon={<TrendingUp />} 
                description="Clicks to sales"
                trend={trends.conversionRate}
              />
            </div>
          
            {/* Performance Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <Tabs defaultValue="daily">
                  <TabsList>
                    <TabsTrigger value="daily">Today vs Yesterday</TabsTrigger>
                    <TabsTrigger value="monthly">Current Month</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="clicks">
                  <TabsList className="mb-4">
                    <TabsTrigger value="clicks">Clicks</TabsTrigger>
                    <TabsTrigger value="commissions">Commissions</TabsTrigger>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="clicks">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} clicks`, 'Clicks']} />
                          <Area type="monotone" dataKey="clicks" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="commissions">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value}`, 'Commissions']} />
                          <Line type="monotone" dataKey="commissions" stroke="#4CAF50" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sales">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} sales`, 'Sales']} />
                          <Bar dataKey="sales" fill="#7E69AB" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Top Performing Links */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Links</CardTitle>
                <CardDescription>Your most successful affiliate links</CardDescription>
              </CardHeader>
              <CardContent>
                {topLinks.length === 0 ? (
                  <p className="text-center py-4">No affiliate links found. Create links to see performance data.</p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Link</TableHead>
                          <TableHead className="text-right">Clicks</TableHead>
                          <TableHead className="text-right">Conv. Rate</TableHead>
                          <TableHead className="text-right">Commissions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topLinks.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell className="font-medium">{link.product_name || 'Unknown Product'}</TableCell>
                            <TableCell>
                              <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">
                                {link.full_url ? new URL(link.full_url).pathname : link.code}
                              </code>
                            </TableCell>
                            <TableCell className="text-right">{link.clicks}</TableCell>
                            <TableCell className="text-right">{calculateConversionRate(link.clicks, link.conversions)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(link.earnings)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default AffiliateAnalytics;
