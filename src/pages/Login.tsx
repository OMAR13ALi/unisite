
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import LoginForm from '@/components/auth/LoginForm';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
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
