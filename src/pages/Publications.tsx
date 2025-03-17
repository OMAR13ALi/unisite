
import React, { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import PublicationCard, { Publication } from '@/components/ui/PublicationCard';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Function to fetch publications from Supabase
const fetchPublications = async () => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data as Publication[];
};

const Publications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // Fetch publications using React Query
  const { data: publications = [], isLoading } = useQuery({
    queryKey: ['publications'],
    queryFn: fetchPublications
  });
  
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  // Filter publications based on search and year filter
  const filteredPublications = publications.filter(pub => {
    const matchesSearch = searchTerm === '' || 
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pub.venue.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesYear = yearFilter === '' || pub.date === yearFilter;
    
    return matchesSearch && matchesYear;
  });
  
  // Get unique years for filter
  const years = Array.from(new Set(publications.map(pub => pub.date))).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <PageTransition>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 animate-slide-down">
              Publications
            </h1>
            <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              Browse my academic publications, including journal articles, conference papers, and book chapters.
            </p>
          </div>
          
          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-10 animate-slide-up">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-muted-foreground" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search publications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                  >
                    <option value="">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Publications List */}
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
            ) : filteredPublications.length > 0 ? (
              <div className="space-y-2">
                <p className="text-muted-foreground mb-6">
                  Showing {filteredPublications.length} {filteredPublications.length === 1 ? 'publication' : 'publications'}
                  {yearFilter && ` from ${yearFilter}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
                {filteredPublications.map((pub, index) => (
                  <div
                    key={pub.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <PublicationCard 
                      publication={pub}
                      isExpanded={expandedIds.has(pub.id)}
                      onToggleExpand={() => toggleExpand(pub.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  No publications found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setYearFilter('');
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

export default Publications;
