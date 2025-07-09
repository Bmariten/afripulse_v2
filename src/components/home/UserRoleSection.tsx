
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Users, Link as LinkIcon } from 'lucide-react';

const UserRoleSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">How Afripulse GMC Works</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our marketplace as a seller, affiliate, or customer and discover a world of premium health & wellness and real estate resources.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-health/10 flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-health" />
              </div>
              <h3 className="text-xl font-bold mb-2">Become a Seller</h3>
              <p className="text-gray-600 mb-4">
                List your premium health & wellness or real estate products and reach a targeted audience ready to buy.
              </p>
              <Link to="/seller/signup" className="text-health hover:underline">
                Start selling →
              </Link>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LinkIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Become an Affiliate</h3>
              <p className="text-gray-600 mb-4">
                Promote high-quality products to your audience and earn competitive commissions on every sale.
              </p>
              <Link to="/affiliate/signup" className="text-primary hover:underline">
                Start promoting →
              </Link>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-real-estate/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-[#D2B48C]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Browse as a Customer</h3>
              <p className="text-gray-600 mb-4">
                Discover vetted, high-quality products from trusted sellers in the health & wellness and real estate niches.
              </p>
              <Link to="/signup" className="text-[#D2B48C] hover:underline">
                Create an account →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UserRoleSection;
