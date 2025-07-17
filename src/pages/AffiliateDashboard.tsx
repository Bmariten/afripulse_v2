import { BarChart3, DollarSign, Link as LinkIcon, MousePointerClick, Zap, TrendingUp, ShoppingBag, Calendar } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AffiliateStats {
  totalClicks: number;
  totalSales: number;
  commissionsEarned: number;
  pendingPayouts: number;
}

interface LinkPerformance {
  id: string;
  code: string;
  clicks: number;
  conversions: number;
  earnings: number;
  conversion_rate: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
  };
  created_at: string;
}

const AffiliateDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [linkPerformance, setLinkPerformance] = useState<LinkPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [statsRes, topLinksRes] = await Promise.all([
          api.get('/affiliate/dashboard-stats'),
          api.get('/affiliate/top-performing-links')
        ]);
        setStats({
          totalClicks: statsRes.data.total_clicks || 0,
          totalSales: statsRes.data.total_conversions || 0,
          commissionsEarned: statsRes.data.total_earnings || 0,
          pendingPayouts: 0 // This might need to be added to the backend
        });
        
        // The top-performing-links endpoint already returns data in the format we need
        setLinkPerformance(topLinksRes.data || []);
      } catch (error) {
        console.error('Failed to fetch affiliate dashboard data:', error);
        toast({ title: 'Error', description: 'Could not fetch dashboard data.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  return (
    <MainLayout 
      showSidebar={true}
      userRole="affiliate"
      pageTitle="Affiliate Dashboard"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section with Abstract Pattern */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 mb-8 shadow-lg">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 w-40 h-40 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3"></div>
            <div className="absolute right-1/4 top-1/3 w-24 h-24 rounded-full bg-white/10"></div>
          </div>
          
          <div className="relative z-10">

            <p className="text-white/80 mb-6 max-w-2xl">Welcome to your affiliate dashboard. Track your performance, manage your links, and optimize your strategy.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <MousePointerClick className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-white/70">Total Clicks</div>
                  <div className="text-xl font-bold">{(stats?.totalClicks || 0).toLocaleString()}</div>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-white/70">Total Sales</div>
                  <div className="text-xl font-bold">{(stats?.totalSales || 0).toLocaleString()}</div>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-white/70">Commissions</div>
                  <div className="text-xl font-bold">${(stats?.commissionsEarned || 0).toFixed(2)}</div>
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-white/70">Pending</div>
                  <div className="text-xl font-bold">${(stats?.pendingPayouts || 0).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-blue-500" />
                Browse Products
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">Discover high-converting products to promote to your audience.</p>
            </CardContent>
            <CardFooter className="pt-0 pb-6 flex justify-center">
              <Button 
                onClick={() => window.location.href = '/affiliate/products'}
                className="bg-blue-600 hover:bg-blue-700 shadow-sm w-full"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Explore Marketplace
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-purple-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-500" />
                Generate Links
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">Create custom affiliate links for any product in our marketplace.</p>
            </CardContent>
            <CardFooter className="pt-0 pb-6 flex justify-center">
              <Button 
                onClick={() => window.location.href = '/affiliate/generate-link'}
                className="bg-purple-600 hover:bg-purple-700 shadow-sm w-full"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Generate New Link
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-green-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                View Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">Track your performance metrics and optimize your strategy.</p>
            </CardContent>
            <CardFooter className="pt-0 pb-6 flex justify-center">
              <Button 
                onClick={() => window.location.href = '/affiliate/analytics'}
                className="bg-green-600 hover:bg-green-700 shadow-sm w-full"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Performance
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Top Performing Links */}
        <Card className="mb-8 border-indigo-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
              Top Performing Links
            </CardTitle>
            <CardDescription>
              Your most successful affiliate links by earnings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {linkPerformance.length > 0 ? (
              <div className="rounded-md border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Conversion Rate</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linkPerformance.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {item.product.image ? (
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="w-10 h-10 rounded-md object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                                <ShoppingBag className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{item.product.name}</div>
                              <div className="text-xs text-gray-500">Code: {item.code}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-medium">{item.clicks}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-medium">{item.conversions}</div>
                          <div className="text-xs text-gray-500">{(item.conversion_rate * 100).toFixed(1)}%</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-medium">{item.conversion_rate.toFixed(1)}%</div>
                          <div className="text-xs text-gray-500">Conv. rate</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-medium text-green-600">${item.earnings.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">${(item.earnings / item.conversions || 0).toFixed(2)}/sale</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 px-4 text-gray-500 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                <div className="bg-white p-4 rounded-full w-20 h-20 mx-auto mb-4 shadow-sm flex items-center justify-center">
                  <LinkIcon className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No active affiliate links yet</h3>
                <p className="mb-6 text-gray-500 max-w-md mx-auto">Start promoting products to earn commissions. Create your first affiliate link to begin your journey.</p>
                <Button 
                  onClick={() => window.location.href = '/affiliate/generate-link'}
                  className="bg-blue-600 hover:bg-blue-700 shadow-md px-6"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Your First Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AffiliateDashboard;
