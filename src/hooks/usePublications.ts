
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Publication } from '@/components/publications/PublicationsTable';

export interface PublicationFormData {
  title: string;
  authors: string;
  venue: string;
  date: string;
  doi: string;
  abstract: string;
  pdf_url: string;
}

export const usePublications = () => {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [formData, setFormData] = useState<PublicationFormData>({
    title: '',
    authors: '',
    venue: '',
    date: '',
    doi: '',
    abstract: '',
    pdf_url: ''
  });

  // Fetch publications
  const fetchPublications = async () => {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data as Publication[];
  };

  // Query for publications
  const { data: publications, isLoading } = useQuery({
    queryKey: ['publications'],
    queryFn: fetchPublications
  });

  // Create publication mutation
  const createPublication = useMutation({
    mutationFn: async (newPublication: Omit<Publication, 'id' | 'created_at' | 'authors'> & { authors: string }) => {
      // Convert comma-separated authors to array
      const authorArray = newPublication.authors.split(',').map(author => author.trim());
      
      const { data, error } = await supabase
        .from('publications')
        .insert([{ ...newPublication, authors: authorArray }])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success('Publication created successfully');
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating publication:', error);
      toast.error('Failed to create publication');
    }
  });

  // Update publication mutation
  const updatePublication = useMutation({
    mutationFn: async ({ id, ...publication }: { id: string } & Omit<Publication, 'id' | 'created_at' | 'authors'> & { authors: string }) => {
      // Convert comma-separated authors to array
      const authorArray = publication.authors.split(',').map(author => author.trim());
      
      const { data, error } = await supabase
        .from('publications')
        .update({ ...publication, authors: authorArray })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success('Publication updated successfully');
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating publication:', error);
      toast.error('Failed to update publication');
    }
  });

  // Delete publication mutation
  const deletePublication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success('Publication deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting publication:', error);
      toast.error('Failed to delete publication');
    }
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPublication) {
      updatePublication.mutate({ id: selectedPublication.id, ...formData });
    } else {
      createPublication.mutate(formData);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      venue: '',
      date: '',
      doi: '',
      abstract: '',
      pdf_url: ''
    });
    setSelectedPublication(null);
  };

  // Open edit dialog with publication data
  const handleEditClick = (publication: Publication) => {
    setSelectedPublication(publication);
    setFormData({
      title: publication.title,
      authors: publication.authors.join(', '),
      venue: publication.venue,
      date: publication.date,
      doi: publication.doi || '',
      abstract: publication.abstract,
      pdf_url: publication.pdf_url || ''
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      deletePublication.mutate(id);
    }
  };

  return {
    publications,
    isLoading,
    formData,
    selectedPublication,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleInputChange,
    handleSubmit,
    handleEditClick,
    handleDeleteClick,
    resetForm
  };
};
