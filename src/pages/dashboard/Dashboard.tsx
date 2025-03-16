
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, Outlet, Navigate } from 'react-router-dom';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Shield, UserCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin, signOut } = useAuth();
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return (
    <PageTransition>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif font-medium">
                Admin Dashboard
              </h1>
              <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium">
                <Shield size={14} className="mr-1" />
                Admin Access
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <UserCircle size={16} />
                <span>{user?.email}</span>
              </div>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <DashboardNav />
            </div>
            
            <div className="md:col-span-3">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
