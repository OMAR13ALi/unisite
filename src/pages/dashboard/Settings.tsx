
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Function to fetch site settings
const fetchSiteSettings = async () => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') { // Table or view not found
      return {
        site_title: "Prof. Smith",
        site_description: "Academic Website",
        footer_text: "© 2025 Prof. Smith. All rights reserved."
      };
    }
    throw error;
  }
  
  return data;
};

const Settings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  
  // Use React Query to fetch site settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: fetchSiteSettings
  });
  
  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [footerText, setFooterText] = useState('');
  
  // Update state when settings are loaded
  useEffect(() => {
    if (settings) {
      setSiteTitle(settings.site_title || "Prof. Smith");
      setSiteDescription(settings.site_description || "Academic Website");
      setFooterText(settings.footer_text || "© 2025 Prof. Smith. All rights reserved.");
    }
  }, [settings]);
  
  // Mutation to save settings
  const saveMutation = useMutation({
    mutationFn: async (newSettings) => {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert([newSettings], { onConflict: 'id' });
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast.success("Settings saved successfully");
    },
    onError: (error) => {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
    },
    onSettled: () => {
      setIsSaving(false);
    }
  });
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    saveMutation.mutate({
      id: settings?.id || 1, // Use existing ID or default
      site_title: siteTitle,
      site_description: siteDescription,
      footer_text: footerText,
      updated_at: new Date().toISOString()
    });
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-64"></div>
        <div className="h-10 bg-muted rounded w-full"></div>
        <div className="h-10 bg-muted rounded w-full"></div>
        <div className="h-32 bg-muted rounded w-full"></div>
        <div className="h-10 bg-muted rounded w-32"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-serif font-medium mb-6">Site Settings</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="admin-email">Admin Email</Label>
          <Input 
            id="admin-email" 
            value={user?.email || 'admin@example.com'} 
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
