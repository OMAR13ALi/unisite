
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Publication, 
  fetchPublications, 
  createPublication, 
  updatePublication, 
  deletePublication 
} from '@/services/publicationsService';

export interface PublicationFormData {
  title: string;
  authors: string;
  venue: string;
  date: string;
  doi: string;
  abstract: string;
  pdf_url: string;
  cover_image_url?: string;
}

export const usePublicationsManagement = () => {
  const queryClient = useQueryClient();
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PublicationFormData>({
    title: '',
    authors: '',
    venue: '',
    date: '',
    doi: '',
    abstract: '',
    pdf_url: '',
    cover_image_url: ''
  });

  // React Query for fetching publications
  const { data: publications, isLoading } = useQuery({
    queryKey: ['publications'],
    queryFn: fetchPublications
  });

  // Create publication mutation
  const createPublicationMutation = useMutation({
    mutationFn: createPublication,
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
  const updatePublicationMutation = useMutation({
    mutationFn: updatePublication,
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
  const deletePublicationMutation = useMutation({
    mutationFn: deletePublication,
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

  // Handle rich text editor changes
  const handleAbstractChange = (content: string) => {
    setFormData(prev => ({ ...prev, abstract: content }));
  };
  
  // Handle image upload
  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, cover_image_url: url }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPublication) {
      updatePublicationMutation.mutate({ id: selectedPublication.id, ...formData });
    } else {
      createPublicationMutation.mutate(formData);
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
      pdf_url: '',
      cover_image_url: ''
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
      pdf_url: publication.pdf_url || '',
      cover_image_url: publication.cover_image_url || ''
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      deletePublicationMutation.mutate(id);
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
    handleAbstractChange,
    handleImageUpload,
    handleSubmit,
    resetForm,
    handleEditClick,
    handleDeleteClick
  };
};
