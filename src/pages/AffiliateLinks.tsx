// import axios from "axios"; - No longer needed
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Copy, Link as LinkIcon, ExternalLink, Trash2, Zap, BarChart3, TrendingUp, ShoppingBag, PlusCircle, Filter, ArrowDownUp, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Sample data
const affiliateLinks = [
  {
    id: '1',
    productId: '101',
    productName: 'Premium Yoga Mat',
    linkCode: 'yogamat-25off',
    fullUrl: 'https://afripulse.com/ref/john-doe/yogamat-25off',
    clicks: 245,
    sales: 12,
    commissions: 71.99,
    status: 'active',
    created: '2025-04-20',
  },
  {
    id: '2',
    productId: '102',
    productName: 'Mindfulness Meditation Course',
    linkCode: 'mindfulness-course',
    fullUrl: 'https://afripulse.com/ref/john-doe/mindfulness-course',
    clicks: 187,
    sales: 8,
    commissions: 89.99,
    status: 'active',
    created: '2025-05-01',
  },
  {
    id: '3',
    productId: '103',
    productName: 'Organic Superfood Blend',
    linkCode: 'superfood-discount',
    fullUrl: 'https://afripulse.com/ref/john-doe/superfood-discount',
    clicks: 156,
    sales: 5,
    commissions: 29.99,
    status: 'active',
    created: '2025-04-15',
  },
  {
    id: '4',
    productId: '201',
    productName: 'Real Estate Investment Guide 2025',
    linkCode: 'realestate-guide',
    fullUrl: 'https://afripulse.com/ref/john-doe/realestate-guide',
    clicks: 134,
    sales: 3,
    commissions: 57.15,
    status: 'active',
    created: '2025-05-04',
  },
];

// Sample products for creating new links
const availableProducts = [
  { id: '101', name: 'Premium Yoga Mat', category: 'Health & Wellness', commissionRate: 15 },
  { id: '102', name: 'Mindfulness Meditation Course', category: 'Health & Wellness', commissionRate: 15 },
  { id: '103', name: 'Organic Superfood Blend', category: 'Health & Wellness', commissionRate: 12 },
  { id: '201', name: 'Real Estate Investment Guide 2025', category: 'Real Estate', commissionRate: 15 },
  { id: '202', name: 'Commercial Real Estate Analysis Tools', category: 'Real Estate', commissionRate: 15 },
  { id: '203', name: 'Property Flipping Masterclass', category: 'Real Estate', commissionRate: 18 },
];

import { useAuth } from '@/contexts/AuthContext';
import { getAffiliateLinks } from '@/services/affiliateService';

const AffiliateLinks = () => {
  const { user, isProfileComplete } = useAuth();
  const navigate = useNavigate();
  const [profileChecked, setProfileChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { toast } = useToast();
  // New link form state
  const [newLinkProduct, setNewLinkProduct] = useState<string>('');
  const [newLinkCode, setNewLinkCode] = useState<string>('');
  // State for affiliate links
  const [affiliateLinks, setAffiliateLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAffiliateProfile() {
      if (!user) return;
      if (user.role !== 'affiliate') {
        navigate('/');
        return;
      }
      
      // Check if profile exists using the auth context's isProfileComplete property
      if (!isProfileComplete) {
        navigate('/affiliate/settings');
        return;
      }
      
      setProfileChecked(true);
      
      // Fetch affiliate links
      try {
        setLoading(true);
        const links = await getAffiliateLinks();
        
        // Transform the data to match the component's expected format
        const formattedLinks = links.map(link => ({
          id: link.id,
          productId: link.product_id,
          productName: link.product_name || 'Unknown Product',
          linkCode: link.code || '',
          fullUrl: link.full_url || '',
          clicks: link.clicks || 0,
          sales: link.conversions || 0,
          commissions: 0, // This might need to be calculated
          status: 'active', // This might need to come from the backend
          created: new Date(link.created_at).toISOString().split('T')[0]
        }));
        
        setAffiliateLinks(formattedLinks);
      } catch (error) {
        console.error('Failed to fetch affiliate links:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch your affiliate links. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }
    
    checkAffiliateProfile();
  }, [user, navigate, toast]);
  
  if (!profileChecked) return null;
  if (loading) return (
    <MainLayout showSidebar={true} userRole="affiliate" pageTitle="Affiliate Links">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center items-center">
        <div className="text-center">
          <p className="text-lg">Loading your affiliate links...</p>
        </div>
      </div>
    </MainLayout>
  );

  
  // Filter links based on search and status
  const filteredLinks = affiliateLinks.filter(link => {
    // Filter by status
    if (selectedStatus !== 'all' && link.status !== selectedStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !link.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !link.linkCode.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Mock function to copy link to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    
    toast({
      title: "Link copied",
      description: "Affiliate link copied to clipboard!",
    });
  };
  
  // Open link in new tab
  const openLinkInNewTab = (url: string) => {
    window.open(url, '_blank');
  };
  
  // Create new link
  const createNewLink = () => {
    if (!newLinkProduct) {
      toast({
        title: "Missing product",
        description: "Please select a product to create your affiliate link.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to the generate link page
    navigate('/affiliate/generate-link');
  };
  
  return (
    <MainLayout
      showSidebar={true}
      userRole="affiliate"
      pageTitle="Affiliate Links"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section with Abstract Pattern */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 mb-8 shadow-lg">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 w-40 h-40 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3"></div>
            <div className="absolute right-1/4 top-1/3 w-24 h-24 rounded-full bg-white/10"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>

                <p className="text-white/80 mb-6 max-w-2xl">Create, manage and track your affiliate links to maximize your earnings.</p>
              </div>
              
              <Button 
                className="bg-white text-indigo-600 hover:bg-white/90 shadow-md"
                onClick={() => navigate('/affiliate/generate-link')}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Link
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <LinkIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Links</p>
                  <p className="text-xl font-semibold">{affiliateLinks.length}</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Clicks</p>
                  <p className="text-xl font-semibold">{affiliateLinks.reduce((sum, link) => sum + link.clicks, 0)}</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Earnings</p>
                  <p className="text-xl font-semibold">${affiliateLinks.reduce((sum, link) => sum + link.commissions, 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-indigo-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 pb-4">
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-indigo-500" />
              Search & Filter
            </CardTitle>
            <CardDescription>Find and manage your affiliate links</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search links by product name or code..."
                  className="pl-10 border-indigo-100 focus-visible:ring-indigo-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-60">
                <Select 
                  value={selectedStatus} 
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="border-indigo-100 focus:ring-indigo-200">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="paused">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        Paused
                      </div>
                    </SelectItem>
                    <SelectItem value="expired">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                        Expired
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Links Table */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="performance" className="w-full">
              <div className="border-b px-4">
                <TabsList className="h-14">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="management">Link Management</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="performance" className="p-0">
                <div className="rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Link Code</TableHead>
                        <TableHead className="text-right">Clicks</TableHead>
                        <TableHead className="text-right">Sales</TableHead>
                        <TableHead className="text-right">Commissions</TableHead>
                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLinks.length > 0 ? (
                        filteredLinks.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell className="font-medium">{link.productName}</TableCell>
                            <TableCell>
                              <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">
                                {link.linkCode}
                              </code>
                            </TableCell>
                            <TableCell className="text-right">{link.clicks}</TableCell>
                            <TableCell className="text-right">{link.sales}</TableCell>
                            <TableCell className="text-right">${link.commissions.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <Button onClick={() => copyToClipboard(link.fullUrl)} variant="ghost" size="sm">
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openLinkInNewTab(link.fullUrl)}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6">
                            <div className="flex flex-col items-center justify-center">
                              <LinkIcon className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="font-medium">No links found</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Try adjusting your search or create a new link
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="management" className="p-0">
                <div className="rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Full URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLinks.length > 0 ? (
                        filteredLinks.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell className="font-medium">{link.productName}</TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              <a 
                                href={link.fullUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">
                                  {link.fullUrl}
                                </code>
                              </a>
                            </TableCell>
                            <TableCell>
                              <Badge variant={link.status === 'active' ? 'default' : 'secondary'}>
                                {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{link.created}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <Button onClick={() => copyToClipboard(link.fullUrl)} variant="ghost" size="sm">
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            <div className="flex flex-col items-center justify-center">
                              <LinkIcon className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="font-medium">No links found</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Try adjusting your search or create a new link
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AffiliateLinks;
