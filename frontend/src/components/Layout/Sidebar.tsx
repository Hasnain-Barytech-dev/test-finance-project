import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  CreditCard, 
  TrendingUp, 
  Users, 
  Settings,
  PlusCircle,
  BarChart3
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  requiredPermission?: 'read' | 'write' | 'admin';
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    requiredPermission: 'read',
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: CreditCard,
    requiredPermission: 'read',
  },
  {
    title: 'Add Transaction',
    href: '/transactions/new',
    icon: PlusCircle,
    requiredPermission: 'write',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    requiredPermission: 'read',
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: TrendingUp,
    requiredPermission: 'read',
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    requiredPermission: 'admin',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    requiredPermission: 'read',
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();

  const filteredNavItems = navItems.filter(item => 
    !item.requiredPermission || hasPermission(item.requiredPermission)
  );

  return (
    <div className="finance-card h-full w-64 flex-shrink-0 border-r bg-card p-4">
      <nav className="space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                'hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-financial'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;