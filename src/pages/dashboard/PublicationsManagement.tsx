
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import PublicationForm from '@/components/publications/PublicationForm';
import PublicationList from '@/components/publications/PublicationList';
import { 
  Publication, 
  fetchPublications, 
  createPublication, 
  updatePublication, 
  deletePublication 
} from '@/services/publicationsService';

const PublicationsManagement = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    venue: '',
    date: '',
    doi: '',
    abstract: '',
    pdf_url: ''
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
      deletePublicationMutation.mutate(id);
    }
  };

  if (!isAdmin) {
    return <p>You do not have permission to access this page.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-medium">Publications Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Publication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Add New Publication</DialogTitle>
            </DialogHeader>
            <PublicationForm 
              formData={formData}
              selectedPublication={null}
              handleInputChange={handleInputChange}
              handleAbstractChange={handleAbstractChange}
              handleSubmit={handleSubmit}
              resetForm={resetForm}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Publication Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Edit Publication</DialogTitle>
          </DialogHeader>
          <PublicationForm 
            formData={formData}
            selectedPublication={selectedPublication}
            handleInputChange={handleInputChange}
            handleAbstractChange={handleAbstractChange}
            handleSubmit={handleSubmit}
            resetForm={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Publications Table */}
      <div className="rounded-md border bg-white">
        <PublicationList 
          publications={publications || []}
          isLoading={isLoading}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      </div>
    </div>
  );
};

export default PublicationsManagement;
