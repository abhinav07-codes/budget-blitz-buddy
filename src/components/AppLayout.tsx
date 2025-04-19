
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { UserMenu } from '@/components/UserMenu';
import { 
  LayoutDashboard, 
  PieChart, 
  Calendar, 
  CreditCard, 
  Settings,
  Menu,
  LogOut,
  Moon,
  Sun,
  ArrowDownCircle
} from 'lucide-react';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, to, active, onClick }) => {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-2 ${active ? 'bg-primary/10' : ''}`}
      onClick={onClick}
      asChild
    >
      <Link to={to}>
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  );
};

interface AppLayoutProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ darkMode, toggleDarkMode }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, to: '/' },
    { id: 'imports', label: 'Import History', icon: <ArrowDownCircle className="h-5 w-5" />, to: '/import-history' },
    { id: 'analytics', label: 'Analytics', icon: <PieChart className="h-5 w-5" />, to: '/analytics' },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="h-5 w-5" />, to: '/calendar' },
    { id: 'expenses', label: 'Expenses', icon: <CreditCard className="h-5 w-5" />, to: '/expenses' },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" />, to: '/settings' },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Budget Blitz</h1>
        {!isMobile && <UserMenu />}
      </div>
      
      <div className="flex-1 px-2 py-2 space-y-1">
        {navItems.map((item) => (
          <SidebarLink
            key={item.id}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={currentPath === item.to}
            onClick={handleNavClick}
          />
        ))}
      </div>
      
      <div className="px-2 py-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2"
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      {isMobile ? (
        <>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              {renderSidebarContent()}
            </SheetContent>
          </Sheet>
          <div className="fixed top-4 right-4 z-50">
            <UserMenu />
          </div>
        </>
      ) : (
        <div className="w-64 h-full border-r bg-card">
          {renderSidebarContent()}
        </div>
      )}

      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
