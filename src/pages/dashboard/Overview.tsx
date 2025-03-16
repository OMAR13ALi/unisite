
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Overview = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-medium mb-6">Welcome, Professor!</h2>
      
      <p className="text-muted-foreground mb-4">
        This dashboard allows you to manage your academic website content. 
        Use the navigation menu to access different sections.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-accent rounded-lg p-4">
          <h3 className="font-medium mb-2">Research Content</h3>
          <p className="text-sm text-muted-foreground">
            Update your research areas and projects
          </p>
        </div>
        
        <div className="bg-accent rounded-lg p-4">
          <h3 className="font-medium mb-2">Publications</h3>
          <p className="text-sm text-muted-foreground">
            Manage your academic publications
          </p>
        </div>
        
        <div className="bg-accent rounded-lg p-4">
          <h3 className="font-medium mb-2">Teaching Materials</h3>
          <p className="text-sm text-muted-foreground">
            Update courses and teaching information
          </p>
        </div>
        
        <div className="bg-accent rounded-lg p-4">
          <h3 className="font-medium mb-2">Messages</h3>
          <p className="text-sm text-muted-foreground">
            View and respond to contact form messages
          </p>
        </div>
        
        <div className="bg-accent rounded-lg p-4">
          <h3 className="font-medium mb-2">Profile Settings</h3>
          <p className="text-sm text-muted-foreground">
            Update your personal information
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
