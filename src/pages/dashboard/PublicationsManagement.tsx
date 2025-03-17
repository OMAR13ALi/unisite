
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import PublicationForm from '@/components/publications/PublicationForm';
import PublicationsTable from '@/components/publications/PublicationsTable';
import { usePublications } from '@/hooks/usePublications';

const PublicationsManagement = () => {
  const { isAdmin } = useAuth();
  const {
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
  } = usePublications();

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
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Publication</DialogTitle>
            </DialogHeader>
            <PublicationForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={resetForm}
              isEditing={false}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Publication Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Publication</DialogTitle>
          </DialogHeader>
          <PublicationForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditDialogOpen(false)}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      {/* Publications Table */}
      <div className="rounded-md border bg-white">
        <PublicationsTable
          publications={publications || []}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>
    </div>
  );
};

export default PublicationsManagement;
