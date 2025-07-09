import { BarChart3, DollarSign, Link as LinkIcon, MousePointerClick } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  product_id: string;
  clicks: number;
  conversions: number;
  earnings: number;
  commission_rate: number;
  product: {
    name: string;
    price: number;
  } | null;
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
        const [statsRes, performanceRes] = await Promise.all([
          api.get('/affiliate/dashboard-stats'),
          api.get('/affiliate/link-performance')
        ]);
        setStats({
          totalClicks: statsRes.data.total_clicks || 0,
          totalSales: statsRes.data.total_conversions || 0,
          commissionsEarned: statsRes.data.total_earnings || 0,
          pendingPayouts: 0 // This might need to be added to the backend
        });
        
        // Map the backend data to the frontend format
        setLinkPerformance(performanceRes.data.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          clicks: item.clicks || 0,
          conversions: item.conversions || 0,
          earnings: item.earnings || 0,
          commission_rate: item.commission_rate || 0,
          product: item.product
        })));
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Clicks" 
            value={(stats?.totalClicks || 0).toLocaleString()}
            icon={<MousePointerClick />} 
            description="All time"
          />
          
          <StatsCard 
            title="Total Sales" 
            value={(stats?.totalSales || 0).toLocaleString()}
            icon={<DollarSign />} 
            description="All time"
          />
          
          <StatsCard 
            title="Commissions Earned" 
            value={`$${(stats?.commissionsEarned || 0).toFixed(2)}`}
            icon={<DollarSign />} 
            description="All time"
          />
          
          <StatsCard 
            title="Pending Payouts" 
            value={`$${(stats?.pendingPayouts || 0).toFixed(2)}`}
            icon={<DollarSign />} 
            description="To be paid"
          />
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <a href="/affiliate/products" className="block p-6 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <h3 className="font-medium mb-1">Browse Products</h3>
                <p className="text-sm text-gray-600">Find products to promote</p>
              </a>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <a href="/affiliate/generate-link" className="block p-6 rounded-md bg-health/10 text-health-dark hover:bg-health/20 transition-colors">
                <h3 className="font-medium mb-1">Generate Links</h3>
                <p className="text-sm text-gray-600">Create affiliate links</p>
              </a>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <a href="/affiliate/analytics" className="block p-6 rounded-md bg-real-estate/10 text-[#A47449] hover:bg-real-estate/20 transition-colors">
                <h3 className="font-medium mb-1">View Analytics</h3>
                <p className="text-sm text-gray-600">See detailed performance stats</p>
              </a>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Link Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Recent Link Performance</CardTitle>
            <CardDescription>
              View the performance of your most active affiliate links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Commissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkPerformance.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product?.name || 'Unknown Product'}</TableCell>
                      <TableCell className="text-right">{item.clicks || 0}</TableCell>
                      <TableCell className="text-right">{item.conversions || 0}</TableCell>
                      <TableCell className="text-right">${(item.earnings || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AffiliateDashboard;
