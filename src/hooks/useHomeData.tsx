
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Function to fetch professor profile
export const fetchProfessorProfile = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_admin', true)
    .single();
  
  if (error) {
    console.error('Error fetching professor profile:', error);
    return {
      first_name: 'John',
      last_name: 'Smith',
      title: 'Professor of Computer Science'
    };
  }
  
  return data;
};

// Function to fetch recent publications
export const fetchRecentPublications = async () => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('date', { ascending: false })
    .limit(3);
  
  if (error) throw error;
  return data || [];
};

// Function to fetch active courses
export const fetchActiveCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('status', 'active')
    .order('code', { ascending: true })
    .limit(3);
  
  if (error) throw error;
  return data || [];
};

// Function to fetch research highlights
export const fetchResearchHighlights = async () => {
  const { data, error } = await supabase
    .from('research_projects')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3);
  
  if (error) throw error;
  return data || [];
};

// Custom hook to get all home page data
export const useHomeData = () => {
  // Fetch professor profile
  const { data: professor } = useQuery({
    queryKey: ['professorProfile'],
    queryFn: fetchProfessorProfile
  });

  // Fetch publications
  const { data: publications = [] } = useQuery({
    queryKey: ['recentPublications'],
    queryFn: fetchRecentPublications
  });

  // Fetch courses
  const { data: courses = [] } = useQuery({
    queryKey: ['activeCourses'],
    queryFn: fetchActiveCourses
  });

  // Fetch research projects
  const { data: researchProjects = [] } = useQuery({
    queryKey: ['researchHighlights'],
    queryFn: fetchResearchHighlights
  });

  return { professor, publications, courses, researchProjects };
};

// Helper function to strip HTML tags safely
export const stripHtml = (html: string) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};
