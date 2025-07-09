
import { BarChart3, DollarSign, ShoppingCart, Users } from 'lucide-react';
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
            value={`$${stats.totalSales.toFixed(2)}`}
            icon={<DollarSign />} 
            description="Last 30 days"
          />
          
          <StatsCard 
            title="Products Sold" 
            value={stats.productsSold.toString()}
            icon={<ShoppingCart />} 
            description="All time"
          />

          <StatsCard 
            title="Listed Products" 
            value={stats.productCount ? stats.productCount.toString() : '0'}
            icon={<ShoppingCart />} 
            description="Total products listed"
          />
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Link to="/seller/add-product" className="block p-6 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <h3 className="font-medium mb-1">Add Product</h3>
                <p className="text-sm text-gray-600">List a new product for sale</p>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Link to="/seller/products" className="block p-6 rounded-md bg-health/10 text-health-dark hover:bg-health/20 transition-colors">
                <h3 className="font-medium mb-1">View Products</h3>
                <p className="text-sm text-gray-600">Manage your product listings</p>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Link to="/seller/analytics" className="block p-6 rounded-md bg-real-estate/10 text-[#A47449] hover:bg-real-estate/20 transition-colors">
                <h3 className="font-medium mb-1">View Analytics</h3>
                <p className="text-sm text-gray-600">See detailed performance stats</p>
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
            <RecentActivityTable activities={recentActivities} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SellerDashboard;
