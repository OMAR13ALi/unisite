
import { supabase } from '@/integrations/supabase/client';

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  date: string;
  doi?: string;
  abstract: string;
  pdf_url?: string;
  cover_image_url?: string;
  created_at: string;
}

// Fetch publications
export const fetchPublications = async () => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data as Publication[];
};

// Create a new publication
export const createPublication = async (newPublication: Omit<Publication, 'id' | 'created_at' | 'authors'> & { authors: string }) => {
  // Convert comma-separated authors to array
  const authorArray = newPublication.authors.split(',').map(author => author.trim());
  
  // Preserve HTML content in abstract
  const { data, error } = await supabase
    .from('publications')
    .insert([{ 
      ...newPublication, 
      authors: authorArray
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Update an existing publication
export const updatePublication = async ({ id, ...publication }: { id: string } & Omit<Publication, 'id' | 'created_at' | 'authors'> & { authors: string }) => {
  // Convert comma-separated authors to array
  const authorArray = publication.authors.split(',').map(author => author.trim());
  
  // Preserve HTML content in abstract
  const { data, error } = await supabase
    .from('publications')
    .update({ 
      ...publication, 
      authors: authorArray
    })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Delete a publication
export const deletePublication = async (id: string) => {
  const { error } = await supabase
    .from('publications')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};
