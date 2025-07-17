import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BadgeCheck, Star, MapPin, Phone, Mail, 
  Globe, Edit, Link as LinkIcon, BarChart3, Settings,
  Calendar, TrendingUp, Award, Shield, DollarSign, MousePointerClick,
  ShoppingBag, Users, Zap, LineChart
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LinkPerformance {
  id: string;
  code: string;
  clicks: number;
  conversions: number;
  earnings: number;
  conversion_rate: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
  };
  created_at: string;
}

const AffiliateProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [topLinks, setTopLinks] = useState<LinkPerformance[]>([]);
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalSales: 0,
    totalEarnings: 0,
    totalLinks: 0,
    conversionRate: 0,
    daysActive: 0
  });

  useEffect(() => {
    const fetchAffiliateData = async () => {
      if (!user) return;
      
      try {
        // Get the profile data
        const profile = user.affiliate_profile || {};
        
        // Define the profile fields and their weights for completeness calculation
        const profileFields = [
          { name: 'website', weight: 15, required: true },
          { name: 'social_media', weight: 10, required: true },
          { name: 'niche', weight: 15, required: true },
          { name: 'paypal_email', weight: 20, required: true },
          { name: 'bank_account', weight: 20, required: false },
          { name: 'bio', weight: 10, required: false },
          { name: 'audience_size', weight: 10, required: false }
        ];
        
        // Calculate total possible weight and achieved weight
        const totalWeight = profileFields.reduce((sum, field) => sum + field.weight, 0);
        const achievedWeight = profileFields.reduce((sum, field) => {
          // Check if field exists and is not empty
          const hasValue = profile[field.name] && 
                          typeof profile[field.name] === 'string' && 
                          profile[field.name].trim() !== '';
          return sum + (hasValue ? field.weight : 0);
        }, 0);
        
        // Calculate missing required fields for detailed feedback
        const missingRequiredFields = profileFields
          .filter(field => field.required && 
                  (!profile[field.name] || 
                   typeof profile[field.name] !== 'string' || 
                   profile[field.name].trim() === ''))
          .map(field => field.name);
        
        // Set profile completeness percentage
        setProfileCompleteness(Math.round((achievedWeight / totalWeight) * 100));
        
        // Store missing fields for UI feedback
        setMissingFields(missingRequiredFields);
        
        // Fetch affiliate stats
        const statsRes = await api.get('/affiliate/dashboard-stats');
        setStats({
          totalClicks: statsRes.data.total_clicks || 0,
          totalSales: statsRes.data.total_conversions || 0,
          totalEarnings: statsRes.data.total_earnings || 0,
          totalLinks: statsRes.data.total_links || 0,
          conversionRate: statsRes.data.total_clicks > 0 ? 
            (statsRes.data.total_conversions / statsRes.data.total_clicks * 100) : 0,
          daysActive: user.created_at ? 
            Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0
        });
        
        // Fetch top performing links
        const linksRes = await api.get('/affiliate/top-performing-links');
        setTopLinks(linksRes.data || []);
      } catch (error) {
        console.error('Failed to fetch affiliate data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your profile data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAffiliateData();
  }, [user, toast]);

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    if (!name) return 'AF';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const displayName = user.email || 'Affiliate';
  const website = user.affiliate_profile?.website || 'No website provided';
  const niche = user.affiliate_profile?.niche || 'No niche specified';
  
  return (
    <MainLayout showSidebar userRole="affiliate" pageTitle="">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-xl overflow-hidden">
            {/* Abstract pattern overlay */}
            <div className="absolute inset-0 opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                  <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="url(#smallGrid)" />
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-6 right-12">
              <div className="h-12 w-12 rounded-full bg-white opacity-10 animate-pulse"></div>
            </div>
            <div className="absolute bottom-8 left-24">
              <div className="h-16 w-16 rounded-full bg-white opacity-10"></div>
            </div>
          </div>
          
          <div className="absolute -bottom-16 left-8 flex items-end">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={user.profile?.avatar || ''} />
              <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="absolute bottom-4 right-8 flex space-x-3">
            <Button 
              variant="outline" 
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
              onClick={() => navigate('/affiliate/settings')}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-md" onClick={() => navigate('/affiliate/generate-link')}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Generate Links
            </Button>
          </div>
        </div>
        
        {/* Profile Header */}
        <div className="mt-20 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold">{displayName}</h1>
                <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-700 border-blue-200">
                  <BadgeCheck className="h-3 w-3 mr-1" /> Verified Affiliate
                </Badge>
              </div>
              <p className="text-gray-600 mt-1">{niche}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Globe className="h-4 w-4 mr-1" />
                <a href={website.startsWith('http') ? website : `https://${website}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="hover:text-blue-600 hover:underline">
                  {website.replace(/^https?:\/\//, '')}
                </a>
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span>Member since {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="flex items-center mr-4">
                <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
                <span className="font-medium">{stats.conversionRate.toFixed(1)}%</span>
                <span className="text-gray-500 ml-1">Conversion Rate</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <DollarSign className="h-3 w-3 mr-1" /> ${stats.totalEarnings.toFixed(2)} Earned
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Profile Completeness */}
        {profileCompleteness < 100 && (
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="font-medium text-amber-800">Complete Your Profile</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    A complete profile helps build trust with brands and improves your visibility.
                    {missingFields.length > 0 && (
                      <span className="block mt-1">
                        Missing: {missingFields.map(field => field.replace('_', ' ')).join(', ')}
                      </span>
                    )}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-3 md:mt-0 border-amber-300 text-amber-800 hover:bg-amber-100"
                  onClick={() => navigate('/affiliate/settings')}
                >
                  Complete Profile
                </Button>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-amber-800">Profile Completeness</span>
                  <span className="font-medium text-amber-800">{profileCompleteness}%</span>
                </div>
                <Progress value={profileCompleteness} className="h-2 bg-amber-200" />
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-100 overflow-hidden relative group hover:shadow-lg transition-all duration-300">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-all duration-300"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Total Earnings</p>
                  <h3 className="text-3xl font-bold text-indigo-900 group-hover:scale-105 transform transition-transform duration-300">
                    ${stats.totalEarnings.toFixed(2)}
                  </h3>
                  <p className="text-xs text-indigo-500 mt-1">All time</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full shadow-sm group-hover:shadow-md group-hover:bg-indigo-200 transition-all duration-300">
                  <DollarSign className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="h-1 w-16 bg-indigo-200 rounded-full mt-4"></div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 overflow-hidden relative group hover:shadow-lg transition-all duration-300">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-300"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Clicks</p>
                  <h3 className="text-3xl font-bold text-purple-900 group-hover:scale-105 transform transition-transform duration-300">{stats.totalClicks}</h3>
                  <p className="text-xs text-purple-500 mt-1">All time</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full shadow-sm group-hover:shadow-md group-hover:bg-purple-200 transition-all duration-300">
                  <MousePointerClick className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="h-1 w-16 bg-purple-200 rounded-full mt-4"></div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 overflow-hidden relative group hover:shadow-lg transition-all duration-300">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-all duration-300"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-green-600 font-medium">Conversion Rate</p>
                  <h3 className="text-3xl font-bold text-green-900 group-hover:scale-105 transform transition-transform duration-300">{stats.conversionRate.toFixed(1)}%</h3>
                  <p className="text-xs text-green-500 mt-1">Clicks to sales</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full shadow-sm group-hover:shadow-md group-hover:bg-green-200 transition-all duration-300">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="h-1 w-16 bg-green-200 rounded-full mt-4"></div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100 overflow-hidden relative group hover:shadow-lg transition-all duration-300">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition-all duration-300"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Total Sales</p>
                  <h3 className="text-3xl font-bold text-amber-900 group-hover:scale-105 transform transition-transform duration-300">{stats.totalSales}</h3>
                  <p className="text-xs text-amber-500 mt-1">All time</p>
                </div>
                <div className="bg-amber-100 p-3 rounded-full shadow-sm group-hover:shadow-md group-hover:bg-amber-200 transition-all duration-300">
                  <ShoppingBag className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="h-1 w-16 bg-amber-200 rounded-full mt-4"></div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-6 p-1 bg-gray-50 border rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="links" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">My Links</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Links</CardTitle>
                    <CardDescription>Your most successful affiliate links by earnings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {topLinks.length > 0 ? (
                      <div className="rounded-lg overflow-hidden border shadow-sm">
                        <Table>
                          <TableHeader className="bg-gray-50">
                            <TableRow>
                              <TableHead className="font-semibold">Product</TableHead>
                              <TableHead className="text-right font-semibold">Clicks</TableHead>
                              <TableHead className="text-right font-semibold">Sales</TableHead>
                              <TableHead className="text-right font-semibold">Earnings</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {topLinks.map((link) => (
                              <TableRow key={link.id} className="hover:bg-blue-50/50 transition-colors">
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-3">
                                    {link.product.image ? (
                                      <img 
                                        src={link.product.image} 
                                        alt={link.product.name} 
                                        className="w-10 h-10 rounded-md object-cover border shadow-sm"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                                        <ShoppingBag className="h-5 w-5 text-gray-400" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-medium">{link.product.name}</div>
                                      <div className="text-xs text-gray-500">Code: {link.code}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="font-medium">{link.clicks}</div>
                                  <div className="text-xs text-gray-500">Total</div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="font-medium">{link.conversions}</div>
                                  <div className="text-xs text-gray-500">{(link.conversion_rate * 100).toFixed(1)}%</div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="font-medium text-green-600">${link.earnings.toFixed(2)}</div>
                                  <div className="text-xs text-gray-500">${(link.earnings / link.conversions || 0).toFixed(2)}/sale</div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-12 px-4 text-gray-500 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                        <div className="bg-white p-4 rounded-full w-20 h-20 mx-auto mb-4 shadow-sm flex items-center justify-center">
                          <LinkIcon className="h-10 w-10 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">No active affiliate links yet</h3>
                        <p className="mb-6 text-gray-500 max-w-md mx-auto">Start promoting products to earn commissions. Create your first affiliate link to begin your journey.</p>
                        <Button 
                          onClick={() => navigate('/affiliate/generate-link')}
                          className="bg-blue-600 hover:bg-blue-700 shadow-md px-6"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Generate Your First Link
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="border-blue-100 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-500" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-5">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-md mr-3">
                          <Star className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Niche</h4>
                          <p className="font-medium">{niche}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-indigo-100 p-2 rounded-md mr-3">
                          <Globe className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Website</h4>
                          <a 
                            href={website.startsWith('http') ? website : `https://${website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-md mr-3">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Social Media</h4>
                          <p className="font-medium">{user.affiliate_profile?.social_media || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-md mr-3">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
                          <p className="font-medium">{new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long',
                            day: 'numeric'
                          })}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="links">
            <Card className="border-blue-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="flex items-center">
                  <LinkIcon className="h-5 w-5 mr-2 text-blue-500" />
                  My Affiliate Links
                </CardTitle>
                <CardDescription>Manage and track all your affiliate links</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-12 px-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                  <div className="bg-white p-4 rounded-full w-20 h-20 mx-auto mb-4 shadow-sm flex items-center justify-center">
                    <LinkIcon className="h-10 w-10 text-indigo-400" />
                  </div>
                  <p className="mb-6 text-gray-600 max-w-md mx-auto">View and manage all your affiliate links in one place. Track performance, copy links, and generate new ones.</p>
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 shadow-md px-6" 
                    onClick={() => navigate('/affiliate/links')}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    View All Links
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card className="border-purple-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-purple-500" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>Detailed insights about your affiliate performance</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-12 px-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                  <div className="bg-white p-4 rounded-full w-20 h-20 mx-auto mb-4 shadow-sm flex items-center justify-center">
                    <BarChart3 className="h-10 w-10 text-purple-400" />
                  </div>
                  <p className="mb-6 text-gray-600 max-w-md mx-auto">Dive deep into your performance metrics with detailed analytics. Track trends, identify opportunities, and optimize your strategy.</p>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 shadow-md px-6" 
                    onClick={() => navigate('/affiliate/analytics')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="border-green-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-green-500" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your affiliate account settings</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-12 px-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                  <div className="bg-white p-4 rounded-full w-20 h-20 mx-auto mb-4 shadow-sm flex items-center justify-center">
                    <Settings className="h-10 w-10 text-green-400" />
                  </div>
                  <p className="mb-6 text-gray-600 max-w-md mx-auto">Update your profile information, payment details, notification preferences, and account settings.</p>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 shadow-md px-6" 
                    onClick={() => navigate('/affiliate/settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Go to Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AffiliateProfile;
