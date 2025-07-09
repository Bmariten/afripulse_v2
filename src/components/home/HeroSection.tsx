
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-health-light to-real-estate-light">
      <div className="container mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Discover Premium</span>
            <span className="block text-health">Health & Wellness</span>
            <span className="block">and</span>
            <span className="block text-[#D2B48C]">Real Estate</span>
            <span className="block">Solutions</span>
          </h1>
          <p className="mt-6 max-w-md mx-auto text-lg text-gray-600 sm:max-w-xl">
            Your marketplace for trusted products from verified sellers. Find exclusive health and wellness items and real estate resources all in one place.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/products/health-wellness">
              <Button className="bg-health text-white px-8 py-3">
                Health & Wellness
              </Button>
            </Link>
            <Link to="/products/real-estate">
              <Button className="bg-[#D2B48C] text-gray-800 px-8 py-3">
                Real Estate
              </Button>
            </Link>
          </div>
          <div className="mt-6">
            <Link to="/signup" className="inline-block text-primary hover:underline">
              Join our marketplace →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
