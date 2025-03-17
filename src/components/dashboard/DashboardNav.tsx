
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Inbox, FileText, BookOpen, MessageSquare, User, Settings, Layout, PenTool, Flask } from 'lucide-react';

const DashboardNav = () => {
  const links = [
    { to: "/dashboard", icon: <Layout size={18} />, label: "Overview", exact: true },
    { to: "/dashboard/messages", icon: <Inbox size={18} />, label: "Messages" },
    { to: "/dashboard/research", icon: <Flask size={18} />, label: "Research" },
    { to: "/dashboard/publications", icon: <PenTool size={18} />, label: "Publications" },
    { to: "/dashboard/teaching", icon: <BookOpen size={18} />, label: "Teaching" },
    { to: "/dashboard/profile", icon: <User size={18} />, label: "Profile" },
    { to: "/dashboard/settings", icon: <Settings size={18} />, label: "Settings" }
  ];
  
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="font-medium">Dashboard Navigation</h2>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.exact}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-accent ${
                    isActive ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default DashboardNav;
