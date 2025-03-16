
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, Outlet } from 'react-router-dom';
import DashboardNav from '@/components/dashboard/DashboardNav';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  
  return (
    <PageTransition>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif font-medium">
              Admin Dashboard
            </h1>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
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
