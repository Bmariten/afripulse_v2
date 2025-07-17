import { useState, useEffect } from 'react';
import api from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, LineChart, PieChart, 
  RefreshCw, TrendingUp, DollarSign 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SalesReport {
  salesOverTime: Array<{
    date: string;
    sales: number;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    total_sales: number;
    quantity_sold: number;
  }>;
  salesByCategory: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
  summary: {
    totalSales: number;
    averageOrderValue: number;
    conversionRate: number;
  };
}

const AdminReports = () => {
  const [salesReports, setSalesReports] = useState<SalesReport>({
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch sales reports data
  const fetchSalesReports = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReports();
  }, [reportPeriod]);

  return (
    <MainLayout showSidebar userRole="admin" pageTitle="">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Sales Reports</h1>
            <p className="text-gray-500 mt-1">View detailed sales analytics and performance metrics</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Select 
              value={reportPeriod} 
              onValueChange={setReportPeriod}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 90 Days</SelectItem>
                <SelectItem value="year">Last 365 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={fetchSalesReports}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Sales</p>
                  <h3 className="text-3xl font-bold">${salesReports.summary.totalSales.toLocaleString()}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Average Order Value</p>
                  <h3 className="text-3xl font-bold">${salesReports.summary.averageOrderValue.toLocaleString()}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                  <h3 className="text-3xl font-bold">{salesReports.summary.conversionRate}%</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Over Time Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-blue-500" />
              Sales Over Time
            </CardTitle>
            <CardDescription>Revenue trends over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : salesReports.salesOverTime.length > 0 ? (
              <div className="h-64 w-full">
                {/* This would be replaced with an actual chart component */}
                <div className="bg-gray-50 h-full w-full rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Sales chart visualization would appear here</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
                <p className="text-gray-500">No sales data available for the selected period</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products and Sales by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Top Selling Products
              </CardTitle>
              <CardDescription>Best performing products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : salesReports.topProducts.length > 0 ? (
                <div className="space-y-4">
                  {salesReports.topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-gray-700 font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.quantity_sold} units sold</p>
                        </div>
                      </div>
                      <p className="font-medium">${product.total_sales.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No product data available</p>
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
              <CardDescription>Revenue distribution across product categories</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : salesReports.salesByCategory.length > 0 ? (
                <div className="space-y-4">
                  {salesReports.salesByCategory.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm">${category.sales.toLocaleString()} ({category.percentage}%)</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No category data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminReports;
