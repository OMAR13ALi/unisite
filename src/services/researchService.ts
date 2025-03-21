
import { supabase } from '@/integrations/supabase/client';

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
}

// Fetch research projects
export const fetchResearchProjects = async () => {
  const { data, error } = await supabase
    .from('research_projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as ResearchProject[];
};

// Create a new research project
export const createResearchProject = async (newProject: Omit<ResearchProject, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('research_projects')
    .insert([newProject])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Update an existing research project
export const updateResearchProject = async ({ id, ...project }: { id: string } & Omit<ResearchProject, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('research_projects')
    .update(project)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Delete a research project
export const deleteResearchProject = async (id: string) => {
  const { error } = await supabase
    .from('research_projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};
