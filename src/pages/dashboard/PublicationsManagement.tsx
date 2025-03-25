
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    venue: '',
    date: new Date().getFullYear().toString(),
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
  const createPub = useMutation({
    mutationFn: createPublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success('Publication created successfully');
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating publication:', error);
      toast.error('Failed to create publication');
    }
  });

  // Update publication mutation
  const updatePub = useMutation({
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
  const deletePub = useMutation({
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
      updatePub.mutate({ id: selectedPublication.id, ...formData });
    } else {
      createPub.mutate(formData);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      venue: '',
      date: new Date().getFullYear().toString(),
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
      deletePub.mutate(id);
    }
  };

  if (!isAdmin) {
    return <p>You do not have permission to access this page.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-medium">Publications Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Publication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] max-h-[85vh] p-0">
            <DialogHeader className="px-6 pt-6 pb-0">
              <DialogTitle>Add New Publication</DialogTitle>
            </DialogHeader>
            <div className="px-6 py-2 flex-1 h-full">
              <PublicationForm 
                formData={formData}
                selectedPublication={null}
                handleInputChange={handleInputChange}
                handleAbstractChange={handleAbstractChange}
                handleImageUpload={handleImageUpload}
                handleSubmit={handleSubmit}
                resetForm={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Publication Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle>Edit Publication</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-2 flex-1 h-full">
            <PublicationForm 
              formData={formData}
              selectedPublication={selectedPublication}
              handleInputChange={handleInputChange}
              handleAbstractChange={handleAbstractChange}
              handleImageUpload={handleImageUpload}
              handleSubmit={handleSubmit}
              resetForm={() => setIsEditDialogOpen(false)}
            />
          </div>
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
