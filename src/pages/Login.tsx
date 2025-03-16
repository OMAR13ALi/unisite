
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import LoginForm from '@/components/auth/LoginForm';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const { user } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  
  if (user) {
    return <Navigate to={from} replace />;
  }
  
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-serif font-medium mb-6 text-center">
              Login
            </h1>
            
            <div className="bg-white p-8 rounded-lg border shadow-sm">
              {location.state?.from && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                  <AlertCircle size={20} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-700">
                    You need to be logged in to access that page.
                  </p>
                </div>
              )}
              
              <LoginForm />
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <Link to="/register" className="text-primary hover:underline">
                  Need an account? Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
