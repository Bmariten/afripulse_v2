import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { fetchAllAffiliates, AffiliateInfo } from '@/services/admin.service';
import { useToast } from '@/hooks/use-toast';

const AffiliateMonitoring = () => {
  const [affiliates, setAffiliates] = useState<AffiliateInfo[]>([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState<AffiliateInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getAffiliates = async () => {
      try {
        setLoading(true);
        const data = await fetchAllAffiliates();
        console.log('Fetched affiliates:', data);
        setAffiliates(data);
        setFilteredAffiliates(data);
      } catch (err) {
        console.error('Error fetching affiliates:', err);
        setError('Failed to load affiliates');
        toast({
          title: 'Error',
          description: 'Failed to load affiliates',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    getAffiliates();
  }, [toast]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAffiliates(affiliates);
    } else {
      const filtered = affiliates.filter(
        affiliate => 
          affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          affiliate.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAffiliates(filtered);
    }
  }, [searchTerm, affiliates]);

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

  return (
    <MainLayout showSidebar userRole="admin" pageTitle="Affiliate Monitoring">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle>Affiliate Monitoring</CardTitle>
            <CardDescription>Monitor and manage affiliate activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <Input 
                placeholder="Search affiliates..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        Loading affiliates...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : filteredAffiliates.length > 0 ? (
                    filteredAffiliates.map((affiliate) => (
                      <TableRow key={affiliate.id}>
                        <TableCell>{affiliate.name}</TableCell>
                        <TableCell>{affiliate.email}</TableCell>
                        <TableCell>{affiliate.clicks}</TableCell>
                        <TableCell>{affiliate.sales}</TableCell>
                        <TableCell>{formatCurrency(affiliate.commissions)}</TableCell>
                        <TableCell>{formatDate(affiliate.joinDate)}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              affiliate.status === 'active' ? 'bg-green-500' : 
                              affiliate.status === 'pending' ? 'bg-amber-500' : 
                              'bg-red-500'
                            }
                          >
                            {affiliate.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                        No affiliates match your filter criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => window.location.href = '/admin/flagged-items'}
          >
            <AlertTriangle className="h-4 w-4 text-red-500" />
            View Flagged Items
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AffiliateMonitoring;
