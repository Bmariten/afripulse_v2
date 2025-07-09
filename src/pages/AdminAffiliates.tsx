
import { useState, useEffect, useMemo } from 'react';
import api from '@/services/api';
import { fetchAllAffiliates, AffiliateInfo } from '@/services/admin.service';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
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

type AffiliateStatus = 'active' | 'suspended' | 'flagged' | 'pending';

const AdminAffiliates = () => {
  const [filter, setFilter] = useState<AffiliateStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [affiliates, setAffiliates] = useState<AffiliateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAffiliatesData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllAffiliates();
        console.log('Fetched affiliates:', data);
        setAffiliates(data);
      } catch (err: any) {
        console.error('Error fetching affiliates:', err);
        setError('Failed to fetch affiliates.');
      } finally {
        setLoading(false);
      }
    }
    fetchAffiliatesData();
  }, []);


  const suspendAffiliate = async (id: string) => {
    try {
      await api.put(`/admin/affiliates/${id}/suspend`);
      setAffiliates(affiliates.map(affiliate =>
        affiliate.id === id ? { ...affiliate, status: 'suspended' } : affiliate
      ));
    } catch (err) {
      console.error('Error suspending affiliate:', err);
      setError('Failed to suspend affiliate.');
    }
  };

  const reactivateAffiliate = async (id: string) => {
    try {
      await api.put(`/admin/affiliates/${id}/activate`);
      setAffiliates(affiliates.map(affiliate =>
        affiliate.id === id ? { ...affiliate, status: 'active' } : affiliate
      ));
    } catch (err) {
      console.error('Error reactivating affiliate:', err);
      setError('Failed to activate affiliate.');
    }
  };

  const resolveFlag = async (id: string) => {
    try {
      await api.put(`/admin/affiliates/${id}/resolve-flag`);
      setAffiliates(affiliates.map(affiliate =>
        affiliate.id === id ? { ...affiliate, status: 'active' } : affiliate
      ));
    } catch (err) {
      console.error('Error resolving flag:', err);
      setError('Failed to resolve flag.');
    }
  };

  const activateAffiliate = async (id: string) => {
    try {
      await api.put(`/admin/affiliates/${id}/activate`);
      setAffiliates(affiliates.map(affiliate =>
        affiliate.id === id ? { ...affiliate, status: 'active' } : affiliate
      ));
    } catch (err) {
      console.error('Error activating affiliate:', err);
      setError('Failed to activate affiliate.');
    }
  };

  // Filter the affiliates based on status and search term
  const filteredAffiliates = useMemo(() => {
    if (!affiliates) return [];
    
    // Apply search filter
    let filtered = affiliates;
    if (searchTerm) {
      filtered = filtered.filter(affiliate => 
        affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affiliate.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(affiliate => 
        affiliate.status.toLowerCase() === filter.toLowerCase()
      );
    }
    
    return filtered;
  }, [affiliates, searchTerm, filter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'suspended': return 'bg-red-500';
      case 'flagged': return 'bg-amber-500';
      case 'pending': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <MainLayout showSidebar userRole="admin" pageTitle="There">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="bg-amber-50">
            <CardTitle>Affiliate Monitoring</CardTitle>
            <CardDescription>Monitor and manage affiliate activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Search affiliates..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Select 
                value={filter} 
                onValueChange={(value: AffiliateStatus | 'all') => setFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Affiliates</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Commissions</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAffiliates.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell className="font-medium">{affiliate.name}</TableCell>
                      <TableCell>{affiliate.email}</TableCell>
                      <TableCell>{affiliate.clicks.toLocaleString()}</TableCell>
                      <TableCell>{affiliate.sales}</TableCell>
                      <TableCell>{formatCurrency(affiliate.commissions)}</TableCell>
                      <TableCell>{formatDate(affiliate.joinDate)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(affiliate.status)}>
                          {affiliate.status.charAt(0).toUpperCase() + affiliate.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          {affiliate.status === 'active' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500 text-red-500 hover:bg-red-50"
                              onClick={() => suspendAffiliate(affiliate.id)}
                            >
                              Suspend
                            </Button>
                          )}
                          {affiliate.status === 'suspended' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-green-500 text-green-500 hover:bg-green-50"
                              onClick={() => reactivateAffiliate(affiliate.id)}
                            >
                              Reactivate
                            </Button>
                          )}
                          {affiliate.status === 'flagged' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-amber-500 text-amber-500 hover:bg-amber-50"
                              onClick={() => resolveFlag(affiliate.id)}
                            >
                              Resolve
                            </Button>
                          )}
                          {affiliate.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-green-500 text-green-500 hover:bg-green-50"
                              onClick={() => activateAffiliate(affiliate.id)}
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredAffiliates.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No affiliates match your filter criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminAffiliates;
