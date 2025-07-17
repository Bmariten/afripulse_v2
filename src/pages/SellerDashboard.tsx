
import { BarChart3, DollarSign, ShoppingCart, Users, UserCircle, Settings, PlusCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivityTable from '@/components/dashboard/RecentActivityTable';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api'; // Use the centralized api service

const SellerDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalSales: 0,
    productsSold: 0,
    productCount: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // user and useAuth already declared above for guard logic

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch stats from the correct, secure backend endpoint
        const statsRes = await api.get('/sellers/dashboard-stats');
        
        // Map the response data to our state structure
        setStats({
          totalSales: statsRes.data.total_sales || 0,
          productsSold: statsRes.data.products_sold || 0,
          productCount: statsRes.data.total_products || 0,
        });

        // If we have a recent activity endpoint, fetch that too
        try {
          const activitiesRes = await api.get('/sellers/recent-activity');
          setRecentActivities(activitiesRes.data);
        } catch (activityError) {
          // If this endpoint doesn't exist yet, just log it and continue
          console.log('Recent activity endpoint not implemented yet');
          setRecentActivities([]);
        }

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Handle error appropriately in the UI
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user]);
  return (
    <MainLayout 
      showSidebar={true}
      userRole="seller"
      pageTitle="Seller Dashboard"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Sales" 
            value={stats.totalSales > 0 ? `$${stats.totalSales.toFixed(2)}` : '$0.00'}
            icon={<DollarSign className="h-6 w-6 text-indigo-600" />} 
            description="Last 30 days"
            className="bg-gradient-to-br from-purple-50 to-indigo-50 border-indigo-100"
          />
          
          <StatsCard 
            title="Products Sold" 
            value={(stats.productsSold || 0).toString()}
            icon={<ShoppingCart className="h-6 w-6 text-blue-600" />} 
            description="All time"
            className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100"
          />

          <StatsCard 
            title="Listed Products" 
            value={(stats.productCount || 0).toString()}
            icon={<ShoppingCart className="h-6 w-6 text-amber-600" />} 
            description="Total products listed"
            className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100"
          />
        </div>
        
        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-6">
              <Link to="/seller/add-product" className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10 mr-4">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Add Product</h3>
                  <p className="text-sm text-gray-600">List a new product for sale</p>
                </div>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-6">
              <Link to="/seller/products" className="flex items-center">
                <div className="p-3 rounded-full bg-blue-50 mr-4">
                  <ShoppingCart className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">My Products</h3>
                  <p className="text-sm text-gray-600">Manage your listings</p>
                </div>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-6">
              <Link to="/seller/profile" className="flex items-center">
                <div className="p-3 rounded-full bg-purple-50 mr-4">
                  <UserCircle className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">My Profile</h3>
                  <p className="text-sm text-gray-600">View seller profile</p>
                </div>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-6">
              <Link to="/seller/insights" className="flex items-center">
                <div className="p-3 rounded-full bg-amber-50 mr-4">
                  <BarChart3 className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Analytics</h3>
                  <p className="text-sm text-gray-600">View performance stats</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <RecentActivityTable activities={recentActivities} />
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No recent activity</h3>
                  <p className="text-gray-500 mb-4">
                    Your recent sales, orders, and other activities will appear here once you start selling.
                  </p>
                  <Link to="/seller/add-product" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SellerDashboard;
