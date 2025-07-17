import { useState, useEffect } from 'react';
import api from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Eye, UserCheck, UserX } from 'lucide-react';

type UserRole = 'admin' | 'seller' | 'affiliate' | 'customer' | 'all';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  username?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('all');
  const [usersPage, setUsersPage] = useState(1);
  const [usersPagination, setUsersPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_items: 0
  });
  const [userSummary, setUserSummary] = useState({
    total: 0,
    admin: 0,
    seller: 0,
    affiliate: 0,
    customer: 0
  });
  
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {
        page: usersPage,
        per_page: 10,
        search: userSearchTerm,
        role: userRole !== 'all' ? userRole : undefined
      };

      const response = await api.get('/admin/users', { params });
      setUsers(response.data.users || []);
      setUsersPagination({
        current_page: response.data.current_page || 1,
        per_page: response.data.per_page || 10,
        total_pages: response.data.total_pages || 1,
        total_items: response.data.total_items || 0
      });
      setUserSummary({
        total: response.data.summary?.total || 0,
        admin: response.data.summary?.admin || 0,
        seller: response.data.summary?.seller || 0,
        affiliate: response.data.summary?.affiliate || 0,
        customer: response.data.summary?.customer || 0
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users data.',
        variant: 'destructive',
      });
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [usersPage, userRole]);

  // Debounce search term changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (userSearchTerm !== undefined) {
        setUsersPage(1); // Reset to first page on new search
        fetchUsers();
      }
    }, 500);
    
    return () => clearTimeout(handler);
  }, [userSearchTerm]);

  const handleActivateAffiliate = async (id: number) => {
    try {
      await api.post(`/admin/affiliates/${id}/activate`);
      // Refresh users list after activation
      fetchUsers();
      toast({
        title: 'Success',
        description: 'Affiliate account has been activated.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to activate the affiliate account. Please try again.',
        variant: 'destructive',
      });
      console.error(err);
    }
  };

  return (
    <MainLayout showSidebar userRole="admin" pageTitle="">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-500 mt-1">View and manage all users in your marketplace</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={fetchUsers}
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

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{userSummary.total}</h3>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{userSummary.admin}</h3>
                <p className="text-sm text-gray-500">Admins</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{userSummary.seller}</h3>
                <p className="text-sm text-gray-500">Sellers</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{userSummary.affiliate}</h3>
                <p className="text-sm text-gray-500">Affiliates</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{userSummary.customer}</h3>
                <p className="text-sm text-gray-500">Customers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-l-4 border-purple-400">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Users Management</CardTitle>
                <CardDescription>View and manage all users in your marketplace</CardDescription>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-8 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    value={userSearchTerm}
                  />
                  <div className="absolute left-2.5 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                </div>
                
                <select 
                  className="border rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
                  <option value="affiliate">Affiliate</option>
                  <option value="customer">Customer</option>
                </select>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={fetchUsers}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                          <span>Loading users...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                              {user.first_name ? user.first_name[0] : user.email[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{user.first_name} {user.last_name}</div>
                              <div className="text-sm text-gray-500">{user.username || 'No username'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            user.role === 'seller' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            user.role === 'affiliate' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.is_active ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            {user.role === 'affiliate' && !user.is_active && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex items-center gap-1 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
                                onClick={() => handleActivateAffiliate(user.id)}
                              >
                                <UserCheck className="h-4 w-4" />
                                Activate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <p className="text-gray-500">No users found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          
          {usersPagination.total_pages > 1 && (
            <CardFooter className="flex justify-between py-4 bg-gray-50">
              <div className="text-sm text-gray-500">
                Showing {(usersPagination.current_page - 1) * usersPagination.per_page + 1} to {Math.min(usersPagination.current_page * usersPagination.per_page, usersPagination.total_items)} of {usersPagination.total_items} users
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={usersPagination.current_page === 1}
                  onClick={() => setUsersPage(usersPagination.current_page - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={usersPagination.current_page === usersPagination.total_pages}
                  onClick={() => setUsersPage(usersPagination.current_page + 1)}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminUsers;
