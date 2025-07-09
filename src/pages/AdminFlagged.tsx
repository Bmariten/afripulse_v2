
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';



const AdminFlagged = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchFlaggedItems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/flagged-items');
        setItems(response.data);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch flagged items.', variant: 'destructive' });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlaggedItems();
  }, [toast]);

  // Filter flagged items based on search and status
  const filteredItems = items.filter(item => {
    // Filter by status
    if (filterStatus !== 'all' && item.status !== filterStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleResolve = (id: string) => {
    // In a real application, you would update the status in the backend
    toast({
      title: "Item resolved",
      description: "The flagged item has been marked as resolved.",
    });
  };

  const handleDismiss = (id: string) => {
    // In a real application, you would update the status in the backend
    toast({
      title: "Flag dismissed",
      description: "The flag has been dismissed as not problematic.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending Review</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      case 'dismissed':
        return <Badge className="bg-gray-500">Dismissed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <MainLayout
      showSidebar={true}
      userRole="admin"
      pageTitle="Flagged Items"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Flagged Items</CardTitle>
              <CardDescription>
                Review and manage reported content and accounts
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={filterStatus === 'all' ? "default" : "outline"} 
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button 
                variant={filterStatus === 'pending' ? "default" : "outline"} 
                onClick={() => setFilterStatus('pending')}
              >
                Pending
              </Button>
              <Button 
                variant={filterStatus === 'resolved' ? "default" : "outline"} 
                onClick={() => setFilterStatus('resolved')}
              >
                Resolved
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search flagged items..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Type</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow key={item.id} className={item.status === 'resolved' ? "bg-gray-50" : ""}>
                        <TableCell className="font-medium capitalize">{item.itemType}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.reason}</TableCell>
                        <TableCell>{item.reportedBy}</TableCell>
                        <TableCell>{item.reportDate.toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {item.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => handleResolve(item.id)}
                                >
                                  <Check className="h-4 w-4" />
                                  <span className="hidden sm:inline">Resolve</span>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex items-center gap-1"
                                  onClick={() => handleDismiss(item.id)}
                                >
                                  <X className="h-4 w-4" />
                                  <span className="hidden sm:inline">Dismiss</span>
                                </Button>
                              </>
                            )}
                            <Link to={`/admin/flagged/${item.id}`}>
                              <Button variant="outline" size="sm">
                                <AlertTriangle className="mr-2 h-4 w-4" /> Details
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No flagged items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminFlagged;
