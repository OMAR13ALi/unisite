
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { FileDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Function to fetch professor profile - updated to handle multiple admins
const fetchProfessorProfile = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_admin', true)
      .limit(1); // Limit to just one admin profile
    
    if (error) throw error;
    
    // Return the first profile if we have data
    if (data && data.length > 0) {
      return data[0];
    }
    
    // Return a default profile if no admin profiles found
    return {
      id: 'default',
      first_name: 'John',
      last_name: 'Smith',
      title: 'Professor',
      bio: 'Computer Science Professor'
    };
  } catch (error) {
    console.error('Error fetching professor profile:', error);
    // Return default data on error
    return {
      id: 'default',
      first_name: 'John',
      last_name: 'Smith',
      title: 'Professor',
      bio: 'Computer Science Professor'
    };
  }
};

// Function to fetch About page content
const fetchAboutContent = async () => {
  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('content')
      .eq('page', 'about')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching about content:', error);
      // Fallback to markdown file
      const response = await fetch('/src/data/about.md');
      return { content: await response.text() };
    }
    
    if (!data) {
      // Fallback to markdown file if no data in database
      const response = await fetch('/src/data/about.md');
      const content = await response.text();
      
      // Insert the content into the database for future use
      await supabase
        .from('page_content')
        .insert({
          page: 'about',
          content: content
        })
        .select();
        
      return { content };
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchAboutContent:', error);
    // Fallback to markdown file
    const response = await fetch('/src/data/about.md');
    return { content: await response.text() };
  }
};

const About = () => {
  // Use React Query to fetch professor profile
  const { data: professor, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['professorProfile'],
    queryFn: fetchProfessorProfile
  });

  // Use React Query to fetch about content
  const { data: aboutData, isLoading: isLoadingContent } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: fetchAboutContent
  });
  
  const isLoading = isLoadingProfile || isLoadingContent;
  const content = aboutData?.content || '';

  return (
    <PageTransition>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 animate-slide-down">
              About Me
            </h1>
            <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
          </div>
          
          {/* Profile Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
              <div className="md:col-span-1 order-2 md:order-1">
                <div className="sticky top-24 animate-slide-up">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-secondary/40 rounded-2xl blur-md"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                    //src="/faouzi.jpg" 
                      alt={professor ? `Professor ${professor.first_name} ${professor.last_name}` : "Professor"} 
                      className="w-full rounded-xl relative z-10" 
                    />
                  </div>
                  
                  <div className="mt-8 text-center">
                    <a 
                      href="#" 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90"
                    >
                      <FileDown size={18} />
                      <span>Download CV</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 order-1 md:order-2">
                {isLoading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/5"></div>
                    <div className="h-6 bg-muted rounded w-1/2 mt-8"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </div>
                ) : (
                  <div className="prose prose-lg max-w-none animate-fade-in">
                    <ReactMarkdown>
                      {content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
