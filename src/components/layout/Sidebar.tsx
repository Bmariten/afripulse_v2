
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Home,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Link as LinkIcon,
  ChevronRight,
  ChevronLeft,
  PlusSquare,
  AlertTriangle,
  Shield,
  LineChart,
  UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userRole?: 'seller' | 'affiliate' | 'admin' | 'customer' | 'guest';
}

const Sidebar = ({ isOpen, toggleSidebar, userRole = 'seller' }: SidebarProps) => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const location = useLocation();
  
  const toggleGroup = (group: string) => {
    setActiveGroup(activeGroup === group ? null : group);
  };
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const renderSellerMenu = () => (
    <>
      <Link 
        to="/seller/dashboard" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/seller/dashboard") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <Home className={cn("h-5 w-5", isActive("/seller/dashboard") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Dashboard</span>
      </Link>
      
      <Link 
        to="/seller/profile" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/seller/profile") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <UserCircle className={cn("h-5 w-5", isActive("/seller/profile") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>My Profile</span>
      </Link>
      
      <Link 
        to="/seller/products" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/seller/products") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <ShoppingBag className={cn("h-5 w-5", isActive("/seller/products") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Inventory</span>
      </Link>
      
      <Link 
        to="/seller/insights" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/seller/insights") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <LineChart className={cn("h-5 w-5", isActive("/seller/insights") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Analytics</span>
      </Link>
      
      <Link 
        to="/seller/settings" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/seller/settings") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <Settings className={cn("h-5 w-5", isActive("/seller/settings") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Settings</span>
      </Link>
    </>
  );

  const renderAffiliateMenu = () => (
    <>
      <Link 
        to="/affiliate/dashboard" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/affiliate/dashboard") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <Home className={cn("h-5 w-5", isActive("/affiliate/dashboard") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Dashboard</span>
      </Link>
      
      <Link 
        to="/affiliate/profile" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/affiliate/profile") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <UserCircle className={cn("h-5 w-5", isActive("/affiliate/profile") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>My Profile</span>
      </Link>
      
      <Link 
        to="/affiliate/products" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/affiliate/products") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <ShoppingBag className={cn("h-5 w-5", isActive("/affiliate/products") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Marketplace</span>
      </Link>
      
      <Link 
        to="/affiliate/links" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/affiliate/links") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <LinkIcon className={cn("h-5 w-5", isActive("/affiliate/links") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>My Links</span>
      </Link>
      
      <Link 
        to="/affiliate/analytics" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/affiliate/analytics") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <LineChart className={cn("h-5 w-5", isActive("/affiliate/analytics") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Performance</span>
      </Link>
      
      <Link 
        to="/affiliate/settings" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/affiliate/settings") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <Settings className={cn("h-5 w-5", isActive("/affiliate/settings") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Settings</span>
      </Link>
    </>
  );

  const renderAdminMenu = () => (
    <>
      <Link 
        to="/admin/dashboard" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/admin/dashboard") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <Home className={cn("h-5 w-5", isActive("/admin/dashboard") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Dashboard</span>
      </Link>
      
      <Link 
        to="/admin/products" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/admin/products") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <ShoppingBag className={cn("h-5 w-5", isActive("/admin/products") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Products</span>
      </Link>
      
      <Link 
        to="/admin/affiliates" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/admin/affiliates") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <Users className={cn("h-5 w-5", isActive("/admin/affiliates") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Partners</span>
      </Link>
      
      <Link 
        to="/admin/settings" 
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-md transition-all",
          isActive("/admin/settings") 
            ? "bg-blue-50 text-blue-600" 
            : "hover:bg-gray-100"
        )}
      >
        <Settings className={cn("h-5 w-5", isActive("/admin/settings") ? "text-blue-500" : "text-gray-500")} />
        <span className={`font-medium transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Settings</span>
      </Link>
    </>
  );

  return (
    <aside
      className={`
        fixed top-16 left-0 h-[calc(100vh-64px)] bg-white border-r border-gray-200
        transition-all duration-300 flex flex-col z-20 shadow-sm
        ${isOpen ? 'w-64' : 'w-[70px]'}
      `}
    >
      <div className="flex items-center justify-end p-2 border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="hover:bg-gray-100"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft className="h-5 w-5 text-gray-600" /> : <ChevronRight className="h-5 w-5 text-gray-600" />}
        </Button>
      </div>

      <nav className="flex-grow overflow-y-auto p-3 space-y-1">
        {userRole === 'seller' && renderSellerMenu()}
        {userRole === 'affiliate' && renderAffiliateMenu()}
        {userRole === 'admin' && renderAdminMenu()}
      </nav>

      {isOpen && userRole === 'seller' && (
        <div className="p-4 border-t border-gray-200">
          <Link to="/seller/add-product">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <PlusSquare className="h-4 w-4 mr-2" /> Add New Product
            </Button>
          </Link>
        </div>
      )}

      {isOpen && userRole === 'affiliate' && (
        <div className="p-4 border-t border-gray-200">
          <Link to="/affiliate/generate-link">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <LinkIcon className="h-4 w-4 mr-2" /> Create Affiliate Link
            </Button>
          </Link>
        </div>
      )}

      {isOpen && userRole === 'admin' && (
        <div className="p-4 border-t border-gray-200">
          <Link to="/admin/flagged">
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              <AlertTriangle className="h-4 w-4 mr-2" /> Manage Flagged Items
            </Button>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
