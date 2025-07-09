
import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Shield
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userRole?: 'seller' | 'affiliate' | 'admin' | 'customer' | 'guest';
}

const Sidebar = ({ isOpen, toggleSidebar, userRole = 'seller' }: SidebarProps) => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const toggleGroup = (group: string) => {
    setActiveGroup(activeGroup === group ? null : group);
  };

  const renderSellerMenu = () => (
    <>
      <Link to="/seller/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <Home className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Dashboard</span>
      </Link>
      
      <Link to="/seller/products" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <ShoppingBag className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Products</span>
      </Link>
      
      <Link to="/seller/insights" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <BarChart3 className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Insights</span>
      </Link>
      
      <Link to="/seller/settings" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <Settings className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Settings</span>
      </Link>
    </>
  );

  const renderAffiliateMenu = () => (
    <>
      <Link to="/affiliate/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <Home className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Dashboard</span>
      </Link>
      
      <Link to="/affiliate/products" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <ShoppingBag className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Browse Products</span>
      </Link>
      
      <Link to="/affiliate/links" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <LinkIcon className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>My Links</span>
      </Link>
      
      <Link to="/affiliate/analytics" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <BarChart3 className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Analytics</span>
      </Link>
      
      <Link to="/affiliate/settings" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <Settings className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Settings</span>
      </Link>
    </>
  );

  const renderAdminMenu = () => (
    <>
      <Link to="/admin/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <Home className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Dashboard</span>
      </Link>
      
      <Link to="/admin/products" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <ShoppingBag className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Products</span>
      </Link>
      
      <Link to="/admin/affiliates" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <Users className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Affiliates</span>
      </Link>
      
      <Link to="/admin/settings" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
        <Settings className="h-5 w-5 text-gray-500" />
        <span className={`transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Settings</span>
      </Link>
    </>
  );

  return (
    <aside
      className={`
        fixed top-16 left-0 h-[calc(100vh-64px)] bg-white border-r border-gray-200
        transition-all duration-300 flex flex-col z-20
        ${isOpen ? 'w-64' : 'w-[70px]'}
      `}
    >
      <div className="flex items-center justify-end p-2 border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-grow overflow-y-auto p-4 space-y-2">
        {userRole === 'seller' && renderSellerMenu()}
        {userRole === 'affiliate' && renderAffiliateMenu()}
        {userRole === 'admin' && renderAdminMenu()}
      </nav>

      {isOpen && userRole === 'seller' && (
        <div className="p-4 border-t border-gray-200">
          <Link to="/seller/add-product">
            <Button className="w-full">
              <PlusSquare className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </Link>
        </div>
      )}

      {isOpen && userRole === 'affiliate' && (
        <div className="p-4 border-t border-gray-200">
          <Link to="/affiliate/generate-link">
            <Button className="w-full">
              <LinkIcon className="h-4 w-4 mr-2" /> Generate Link
            </Button>
          </Link>
        </div>
      )}

      {isOpen && userRole === 'admin' && (
        <div className="p-4 border-t border-gray-200">
          <Link to="/admin/flagged">
            <Button className="w-full">
              <AlertTriangle className="h-4 w-4 mr-2" /> View Flagged Items
            </Button>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
