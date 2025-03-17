
import React, { useEffect, useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Function to fetch research content from Supabase
const fetchResearchContent = async () => {
  const { data, error } = await supabase
    .from('page_content')
    .select('content')
    .eq('page', 'research')
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching research content:', error);
    // Fallback to markdown file if database fetch fails
    const response = await fetch('/src/data/research.md');
    return { content: await response.text() };
  }
  
  if (!data) {
    // Fallback to markdown file if no data in database
    const response = await fetch('/src/data/research.md');
    return { content: await response.text() };
  }
  
  return data;
};

// Function to fetch research projects from Supabase
const fetchResearchProjects = async () => {
  const { data, error } = await supabase
    .from('research_projects')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

const Research = () => {
  // Fetch research content using React Query
  const { data: contentData, isLoading: isLoadingContent } = useQuery({
    queryKey: ['researchContent'],
    queryFn: fetchResearchContent
  });

  // Fetch research projects using React Query
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['researchProjects'],
    queryFn: fetchResearchProjects
  });
  
  const isLoading = isLoadingContent || isLoadingProjects;
  const content = contentData?.content || '';

  // Map projects to research areas for visualization
  const researchAreas = projects.slice(0, 3).map(project => ({
    title: project.title,
    description: project.description.substring(0, 100) + (project.description.length > 100 ? '...' : ''),
    image: project.image_url || getDefaultImageForCategory(project.category),
    delay: "0s"
  }));

  // Default images based on research category
  function getDefaultImageForCategory(category) {
    const defaultImages = {
      "quantum": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "ai": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "distributed": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    };
    
    return defaultImages[category.toLowerCase()] || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
  }

  // If there are fewer than 3 projects, add defaults
  while (researchAreas.length < 3) {
    const defaults = [
      {
        title: "Quantum Computing",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        description: "Exploring quantum algorithms for machine learning and optimization problems.",
      },
      {
        title: "Ethical AI",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        description: "Developing frameworks for responsible AI development and deployment.",
      },
      {
        title: "Distributed Systems",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        description: "Building efficient AI models for edge computing and federated learning.",
      }
    ];
    
    researchAreas.push(defaults[researchAreas.length % 3]);
  }

  return (
    <PageTransition>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 animate-slide-down">
              Research
            </h1>
            <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
          </div>
          
          {/* Content */}
          <div className="max-w-4xl mx-auto">
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
          
          {/* Research Areas Visualization */}
          <div className="max-w-5xl mx-auto mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {researchAreas.map((area, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg overflow-hidden border shadow-sm animate-slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={area.image} 
                      alt={area.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-medium mb-3">{area.title}</h3>
                    <p className="text-muted-foreground">{area.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Research;
