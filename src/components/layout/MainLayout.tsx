
import { useState, ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  userRole?: 'seller' | 'affiliate' | 'admin' | 'customer' | 'guest';
  pageTitle?: string;
}

const MainLayout = ({ 
  children, 
  showSidebar = true,
  userRole = 'seller',
  pageTitle 
}: MainLayoutProps) => {
  const { isAuthenticated, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(!useIsMobile());
  
  // Only show sidebar for authenticated users with specific roles
  const shouldShowSidebar = showSidebar && isAuthenticated && user?.role !== 'customer';
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        toggleSidebar={toggleSidebar} 
        showSidebarToggle={showSidebar} 
      />
      
      <div className="flex flex-1">
        {shouldShowSidebar && (
          <Sidebar 
            isOpen={sidebarOpen} 
            toggleSidebar={toggleSidebar} 
            userRole={user?.role || userRole}
          />
        )}
        
        <div className={`flex flex-col flex-grow ${shouldShowSidebar ? (sidebarOpen ? 'md:ml-64' : 'md:ml-[70px]') : ''} transition-all duration-300`}>
          <main className="flex-grow pt-6 pb-12 bg-gray-50">
            {pageTitle && (
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <h1 className="text-2xl font-bold">{pageTitle}</h1>
              </div>
            )}
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
