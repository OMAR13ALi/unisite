
import React, { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';
import { ResearchProject } from '@/services/researchService';

// Fetch research projects
const fetchResearchProjects = async () => {
  const { data, error } = await supabase
    .from('research_projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as ResearchProject[];
};

const Research = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Fetch research projects with React Query
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['research-projects'],
    queryFn: fetchResearchProjects
  });
  
  // Filter projects based on search term and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === '' || project.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for filter
  const categories = Array.from(new Set(projects.map(project => project.category))).sort();
  
  // Toggle project expansion
  const toggleProjectExpansion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              Explore our ongoing and completed research projects in various fields of computer science and related disciplines.
            </p>
          </div>
          
          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-10 animate-slide-up">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Filter size={18} className="mr-2" />
                  Filter Research Projects
                </h2>
                {categoryFilter && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setCategoryFilter('')}
                    size="sm"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-muted-foreground" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Research Projects */}
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse p-6 border rounded-md">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="space-y-6">
                <p className="text-muted-foreground mb-6">
                  Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
                  {categoryFilter && ` in ${categoryFilter}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
                {filteredProjects.map((project, index) => (
                  <div 
                    key={project.id}
                    className="animate-slide-up bg-white rounded-lg border overflow-hidden shadow-sm"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {project.cover_image_url && (
                      <div className="w-full h-48 overflow-hidden">
                        <img 
                          src={project.cover_image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-serif font-semibold">{project.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.category}</p>
                      
                      <div className={`overflow-hidden transition-all duration-300 ${
                        expandedId === project.id ? 'max-h-[2000px]' : 'max-h-24'
                      }`}>
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: project.description }}
                        />
                      </div>
                      
                      <Button 
                        variant="link" 
                        onClick={() => toggleProjectExpansion(project.id)}
                        className="mt-2 p-0 h-auto text-primary"
                      >
                        {expandedId === project.id ? 'Show Less' : 'Read More'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  No research projects found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('');
                  }}
                  className="mt-4 px-4 py-2 border border-primary text-primary rounded-md hover:bg-accent transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Research;
