
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, ExternalLink } from 'lucide-react';

// Sample products for creating links
const availableProducts = [
  { id: '101', name: 'Premium Yoga Mat', category: 'Health & Wellness', commissionRate: 15 },
  { id: '102', name: 'Mindfulness Meditation Course', category: 'Health & Wellness', commissionRate: 15 },
  { id: '103', name: 'Organic Superfood Blend', category: 'Health & Wellness', commissionRate: 12 },
  { id: '201', name: 'Real Estate Investment Guide 2025', category: 'Real Estate', commissionRate: 15 },
  { id: '202', name: 'Commercial Real Estate Analysis Tools', category: 'Real Estate', commissionRate: 15 },
  { id: '203', name: 'Property Flipping Masterclass', category: 'Real Estate', commissionRate: 18 },
];

const AffiliateGenerateLink = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [selectedTab, setSelectedTab] = useState('product');
  const [formData, setFormData] = useState({
    product: '',
    customCode: '',
    campaignName: '',
    customUrl: ''
  });
  
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const generateLink = () => {
    setLoading(true);
    
    if (selectedTab === 'product' && !formData.product) {
      toast({
        title: "Missing product",
        description: "Please select a product to create your affiliate link.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    if (selectedTab === 'custom' && !formData.customUrl) {
      toast({
        title: "Missing URL",
        description: "Please enter a custom URL to create your affiliate link.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    // Generate link based on selected tab
    let link = '';
    const affiliateCode = user?.name.toLowerCase().replace(/\s+/g, '-') || 'affiliate';
    
    if (selectedTab === 'product') {
      const product = availableProducts.find(p => p.id === formData.product);
      const productCode = product?.name.toLowerCase().replace(/\s+/g, '-') || '';
      const customCode = formData.customCode ? formData.customCode : productCode;
      
      link = `https://afripulse.com/ref/${affiliateCode}/${customCode}`;
    } else {
      // Custom URL
      link = `https://afripulse.com/go/${affiliateCode}/${formData.campaignName || 'campaign'}?url=${encodeURIComponent(formData.customUrl)}`;
    }
    
    // Simulate API call
    setTimeout(() => {
      setGeneratedLink(link);
      setLoading(false);
      
      toast({
        title: "Link generated",
        description: "Your affiliate link has been created successfully!",
      });
    }, 800);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Link copied",
      description: "Link copied to clipboard!",
    });
  };
  
  const saveLink = () => {
    // In a real app, this would make an API call to save the link
    toast({
      title: "Link saved",
      description: "Your affiliate link has been saved to your collection.",
    });
    navigate('/affiliate/links');
  };
  
  return (
    <MainLayout
      showSidebar={true}
      userRole="affiliate"
      pageTitle="Generate Affiliate Link"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Generate Affiliate Link</CardTitle>
            <CardDescription>
              Create custom affiliate links for products or external URLs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="product" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="product">Product Link</TabsTrigger>
                <TabsTrigger value="custom">Custom URL</TabsTrigger>
              </TabsList>
              
              <TabsContent value="product" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Select Product</Label>
                  <Select 
                    value={formData.product} 
                    onValueChange={(value) => handleSelectChange("product", value)}
                  >
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.commissionRate}% commission)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customCode">Custom Link Code (optional)</Label>
                  <Input
                    id="customCode"
                    name="customCode"
                    value={formData.customCode}
                    onChange={handleChange}
                    placeholder="e.g. summer-sale"
                  />
                  <p className="text-xs text-gray-500">
                    Customize the last part of your affiliate link for better tracking
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customUrl">Custom URL</Label>
                  <Input
                    id="customUrl"
                    name="customUrl"
                    value={formData.customUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/page"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name (optional)</Label>
                  <Input
                    id="campaignName"
                    name="campaignName"
                    value={formData.campaignName}
                    onChange={handleChange}
                    placeholder="e.g. facebook-may"
                  />
                </div>
              </TabsContent>
              
              {/* Generate button for both tabs */}
              <div className="mt-6">
                <Button 
                  onClick={generateLink} 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Affiliate Link"}
                </Button>
              </div>
            </Tabs>
            
            {/* Display generated link */}
            {generatedLink && (
              <div className="mt-8 p-4 border rounded-md bg-gray-50">
                <Label className="block mb-2">Your Affiliate Link</Label>
                <div className="flex items-center gap-2 mb-4">
                  <Input 
                    value={generatedLink} 
                    readOnly 
                    className="font-mono text-sm bg-white"
                  />
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => window.open(generatedLink, '_blank')}
                    title="Test link in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={saveLink}>
                    Save to My Links
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AffiliateGenerateLink;
