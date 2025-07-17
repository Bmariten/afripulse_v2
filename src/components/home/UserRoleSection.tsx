
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Users, Link as LinkIcon, ChevronRight, CheckCircle, Award, Zap } from 'lucide-react';

// Simple animation component
const MotionDiv = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);

const UserRoleSection = () => {
  const benefits = [
    "Access to premium African marketplace",
    "Secure payment processing",
    "Dedicated customer support",
    "Verified seller program"
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/5"></div>
        <div className="absolute top-1/2 -left-12 w-40 h-40 rounded-full bg-health/5"></div>
        <div className="absolute bottom-12 right-12 w-32 h-32 rounded-full bg-[#D2B48C]/5"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionDiv className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Join Our Ecosystem
          </span>
          <h2 className="text-4xl font-bold mb-6">How AfriPulse Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Join our thriving marketplace ecosystem and be part of Africa's fastest growing health & wellness and real estate platform.
          </p>
        </MotionDiv>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Seller Card */}
          <MotionDiv className="group">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
              <div className="h-3 bg-health w-full"></div>
              <CardContent className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-health/10 flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-health" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-health bg-health/10 px-3 py-1 rounded-full">
                    Sellers
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-health transition-colors">
                  Become a Seller
                </h3>
                
                <p className="text-gray-600 mb-6">
                  List your premium health & wellness or real estate products and reach a targeted audience across Africa.
                </p>
                
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-health mr-2 flex-shrink-0" />
                    <span>Showcase your products to thousands</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-health mr-2 flex-shrink-0" />
                    <span>Get verified seller status</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-health mr-2 flex-shrink-0" />
                    <span>Access detailed sales analytics</span>
                  </li>
                </ul>
                
                <Button asChild className="w-full bg-health hover:bg-health/90 text-white">
                  <Link to="/seller/signup" className="flex items-center justify-center gap-2">
                    Start selling
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </MotionDiv>
          
          {/* Affiliate Card */}
          <MotionDiv className="group lg:mt-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
              <div className="h-3 bg-primary w-full"></div>
              <CardContent className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <LinkIcon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                    Affiliates
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  Become an Affiliate
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Promote high-quality African products to your audience and earn competitive commissions on every sale.
                </p>
                
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>Earn up to 30% commission</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>Get custom affiliate links</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>Track performance in real-time</span>
                  </li>
                </ul>
                
                <Button asChild className="w-full">
                  <Link to="/affiliate/signup" className="flex items-center justify-center gap-2">
                    Start promoting
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </MotionDiv>
          
          {/* Customer Card */}
          <MotionDiv className="group lg:mt-12">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
              <div className="h-3 bg-[#D2B48C] w-full"></div>
              <CardContent className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-[#D2B48C]/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-[#D2B48C]" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D2B48C] bg-[#D2B48C]/10 px-3 py-1 rounded-full">
                    Customers
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#D2B48C] transition-colors">
                  Shop as a Customer
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Discover vetted, high-quality products from trusted African sellers in health & wellness and real estate.
                </p>
                
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-[#D2B48C] mr-2 flex-shrink-0" />
                    <span>Shop with confidence (verified sellers)</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-[#D2B48C] mr-2 flex-shrink-0" />
                    <span>Secure payment options</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-[#D2B48C] mr-2 flex-shrink-0" />
                    <span>Exclusive deals and offers</span>
                  </li>
                </ul>
                
                <Button asChild variant="outline" className="w-full border-[#D2B48C] text-[#D2B48C] hover:bg-[#D2B48C]/10">
                  <Link to="/signup" className="flex items-center justify-center gap-2">
                    Create an account
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </MotionDiv>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-xl font-bold">Why Choose AfriPulse?</h3>
            </div>
            <p className="text-gray-600">Trusted by thousands of sellers, affiliates and customers across Africa</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                <Zap className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserRoleSection;
