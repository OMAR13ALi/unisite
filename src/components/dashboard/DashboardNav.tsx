
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  User, 
  Settings,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardNav = () => {
  const { user } = useAuth();

  // Define navigation items with permission requirements
  const navItems = [
    { 
      to: '/dashboard', 
      label: 'Overview', 
      icon: <LayoutDashboard size={18} className="mr-2" />,
      exact: true,
      requiresAdmin: false
    },
    { 
      to: '/dashboard/messages', 
      label: 'Messages', 
      icon: <MessageSquare size={18} className="mr-2" />,
      exact: false,
      requiresAdmin: true
    },
    { 
      to: '/dashboard/research', 
      label: 'Research', 
      icon: <BookOpen size={18} className="mr-2" />,
      exact: false,
      requiresAdmin: true
    },
    { 
      to: '/dashboard/publications', 
      label: 'Publications', 
      icon: <FileText size={18} className="mr-2" />,
      exact: false,
      requiresAdmin: true
    },
    { 
      to: '/dashboard/teaching', 
      label: 'Teaching', 
      icon: <GraduationCap size={18} className="mr-2" />,
      exact: false,
      requiresAdmin: true
    },
    { 
      to: '/dashboard/users', 
      label: 'Users', 
      icon: <Users size={18} className="mr-2" />,
      exact: false,
      requiresAdmin: true
    },
    { 
      to: '/dashboard/profile', 
      label: 'Profile', 
      icon: <User size={18} className="mr-2" />,
      exact: false,
      requiresAdmin: false
    },
    { 
      to: '/dashboard/settings', 
      label: 'Settings', 
      icon: <Settings size={18} className="mr-2" />,
      exact: false,
      requiresAdmin: true
    },
  ];
  
  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter(item => {
    if (item.requiresAdmin) {
      return user?.isAdmin;
    }
    return true;
  });

  return (
    <nav className="space-y-1">
      {filteredNavItems.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.exact}
          className={({ isActive }) => 
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`
          }
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default DashboardNav;
