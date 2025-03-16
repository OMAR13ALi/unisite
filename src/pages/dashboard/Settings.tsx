
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [siteTitle, setSiteTitle] = useState("Prof. Smith");
  const [siteDescription, setSiteDescription] = useState("Academic Website");
  const [footerText, setFooterText] = useState("© 2025 Prof. Smith. All rights reserved.");
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-medium mb-6">Site Settings</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="admin-email">Admin Email</Label>
          <Input 
            id="admin-email" 
            value={user?.email || 'oalia9214@gmail.com'} 
            disabled 
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">This is the administrator email with full access.</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="site-title">Site Title</Label>
          <Input 
            id="site-title" 
            value={siteTitle} 
            onChange={(e) => setSiteTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="site-description">Site Description</Label>
          <Input 
            id="site-description" 
            value={siteDescription} 
            onChange={(e) => setSiteDescription(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="footer-text">Footer Text</Label>
          <Textarea 
            id="footer-text" 
            value={footerText} 
            onChange={(e) => setFooterText(e.target.value)}
            rows={3}
          />
        </div>
        
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
