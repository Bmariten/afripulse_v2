
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  toggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

const Header = ({ toggleSidebar, showSidebarToggle = false }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    // If user is logged in, redirect to their dashboard
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'seller':
          navigate('/seller/dashboard');
          break;
        case 'affiliate':
          navigate('/affiliate/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/'); // Default to home
      }
    } else {
      // If not logged in, go to landing page
      navigate('/');
    }
    
    // Close mobile menu if it's open
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            {showSidebarToggle && toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            
            <button onClick={handleHomeClick} className="flex items-center">
              <span className="text-xl font-bold text-primary">AfriPulse</span>
              <span className="text-sm font-semibold ml-1">GMC</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-gray-600 hover:text-primary">
              Products
            </Link>
            
            {!isAuthenticated && (
              <>
                <Link to="/seller/login" className="text-gray-600 hover:text-primary">
                  Sellers
                </Link>
                <Link to="/affiliate/login" className="text-gray-600 hover:text-primary">
                  Affiliates
                </Link>
              </>
            )}

            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-primary" />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.name}
                    <div className="text-xs text-gray-500">{user?.role}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    switch(user?.role) {
                      case 'seller':
                        navigate('/seller/settings');
                        break;
                      case 'affiliate':
                        navigate('/affiliate/settings');
                        break;
                      case 'admin':
                        navigate('/admin/settings');
                        break;
                      default:
                        break;
                    }
                  }}>
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/seller/login">Log In</Link>
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="relative mr-4">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link
              to="/products"
              className="block py-2 text-gray-600 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            
            {!isAuthenticated ? (
              <>
                <Link
                  to="/seller/login"
                  className="block py-2 text-gray-600 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sellers
                </Link>
                <Link
                  to="/affiliate/login"
                  className="block py-2 text-gray-600 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Affiliates
                </Link>
                <div className="pt-2">
                  <Button asChild className="w-full">
                    <Link 
                      to="/seller/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log In
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="py-2 border-t border-gray-100">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
                </div>
                <Link
                  to={`/${user?.role}/settings`}
                  className="block py-2 text-gray-600 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-600 hover:text-primary"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
