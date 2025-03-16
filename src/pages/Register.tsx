
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import RegisterForm from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Register = () => {
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
              Create Account
            </h1>
            
            <div className="bg-white p-8 rounded-lg border shadow-sm">
              <RegisterForm />
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
                  Already have an account? Login here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;
