
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ArrowRight, ShoppingBag, Shield, Award } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      {/* Video Background with Overlay */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <video 
          className="w-full h-full object-cover" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="https://player.vimeo.com/external/370331493.sd.mp4?s=e90dcaba73c19e0e36f03406b47bbd6992dd6c1c&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
      </div>
      
      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-health/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-[#D2B48C]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-24 sm:py-32 lg:py-40 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero Content */}
          <div className={`max-w-2xl transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <span className="animate-pulse mr-2 h-3 w-3 rounded-full bg-health"></span>
              <span className="text-sm font-medium">Premium African Marketplace</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="block">Discover</span>
              <span className="block mt-1">
                <span className="text-health">Health</span> & <span className="text-[#D2B48C]">Wealth</span>
              </span>
              <span className="block mt-1">Solutions</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-xl">
              Your premier marketplace for trusted African products from verified sellers. Exclusive health, wellness, and real estate resources all in one place.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-health hover:bg-health/90 text-white px-8 py-6 rounded-xl transition-all hover:scale-105 shadow-lg shadow-health/20 group">
                <Link to="/products/health-wellness" className="flex items-center">
                  <span>Health & Wellness</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button asChild size="lg" className="bg-[#D2B48C] hover:bg-[#D2B48C]/90 text-gray-900 px-8 py-6 rounded-xl transition-all hover:scale-105 shadow-lg shadow-[#D2B48C]/20 group">
                <Link to="/products/real-estate" className="flex items-center">
                  <span>Real Estate</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center space-x-8">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-health mr-2" />
                <span className="text-sm">Verified Sellers</span>
              </div>
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 text-health mr-2" />
                <span className="text-sm">Premium Products</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-health mr-2" />
                <span className="text-sm">Quality Guaranteed</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image/3D Element */}
          <div className={`relative lg:w-1/2 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main circular element */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-health to-[#D2B48C] blur-sm animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-health/90 to-[#D2B48C]/90 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="AfriPulse Marketplace" 
                  className="w-full h-full object-cover mix-blend-overlay opacity-60"
                />
                
                {/* Floating elements */}
                <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white rounded-lg shadow-xl transform -translate-x-1/2 -translate-y-1/2 animate-float">
                  <img 
                    src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                    alt="Health product" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <div className="absolute top-2/3 right-1/4 w-20 h-20 bg-white rounded-lg shadow-xl transform translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: '1s' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                    alt="Real estate" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <div className="absolute bottom-1/4 left-1/3 w-14 h-14 bg-white rounded-lg shadow-xl transform -translate-x-1/2 translate-y-1/2 animate-float" style={{ animationDelay: '2s' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                    alt="Wellness product" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path fill="#F9FAFB" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;

// Add these animations to your global CSS or tailwind config
/*
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
*/
