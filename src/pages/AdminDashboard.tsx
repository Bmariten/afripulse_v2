import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchFlaggedItems } from '@/services/admin.service';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Users, ShoppingBag, Wallet, AlertTriangle, Check, X } from 'lucide-react';
import api from '@/services/api';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [pendingItems, setPendingItems] = useState([]);
  const [flaggedActivities, setFlaggedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [stats, setStats] = useState({
    totalSellers: 0,
    totalProducts: 0,
    totalAffiliates: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const statsRes = await api.get('/profile/dashboard-stats');
        setStats({
          totalSellers: statsRes.data.totalSellers || 0,
          totalProducts: statsRes.data.totalProducts || 0,
          totalAffiliates: statsRes.data.totalAffiliates || 0,
          totalRevenue: statsRes.data.totalRevenue || 0,
        });
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

    fetchStats();
    fetchTableData();
  }, [toast]);

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

  return (
    <MainLayout showSidebar userRole="admin" pageTitle="Admin Dashboard">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Sellers"
              value={loading ? '...' : stats.totalSellers.toLocaleString()}
              icon={<Users className="h-8 w-8 text-primary" />}
            />
            <StatsCard
              title="Total Products"
              value={loading ? '...' : stats.totalProducts.toLocaleString()}
              icon={<ShoppingBag className="h-8 w-8 text-primary" />}
            />
            <StatsCard
              title="Total Affiliates"
              value={loading ? '...' : stats.totalAffiliates.toLocaleString()}
              icon={<Users className="h-8 w-8 text-primary" />}
            />
            <StatsCard
              title="Total Revenue"
              value={loading ? '...' : `$${stats.totalRevenue.toLocaleString()}`}
              icon={<Wallet className="h-8 w-8 text-primary" />}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-8">
          <Card>
            <CardHeader className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                Products Pending Approval
              </CardTitle>
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
                    {pendingItems.length > 0 ? (
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
                          <TableCell>{item.category?.name}</TableCell>
                          <TableCell>${item.price}</TableCell>
                          <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleApproveItem(item.id)}><Check className="h-4 w-4 mr-1" />Approve</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleRejectItem(item.id)}><X className="h-4 w-4 mr-1" />Reject</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                          No products are currently pending approval.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-red-50 border-l-4 border-red-400 p-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                Flagged Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Affiliate</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flaggedActivities.length > 0 ? (
                      flaggedActivities.map((activity: any) => (
                        <TableRow key={activity.id}>
                          <TableCell>{activity.name.split(' by ')[1] || 'System'}</TableCell>
                          <TableCell>{activity.reason || activity.name}</TableCell>
                          <TableCell>{new Date(activity.reportDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">Review</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                          No flagged activities found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
