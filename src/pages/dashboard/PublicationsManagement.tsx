
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePublicationsManagement } from '@/hooks/usePublicationsManagement';
import AddPublicationDialog from '@/components/publications/AddPublicationDialog';
import EditPublicationDialog from '@/components/publications/EditPublicationDialog';
import PublicationList from '@/components/publications/PublicationList';

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
    handleAbstractChange,
    handleSubmit,
    resetForm,
    handleEditClick,
    handleDeleteClick
  } = usePublicationsManagement();

  if (!isAdmin) {
    return <p>You do not have permission to access this page.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-medium">Publications Management</h2>
        <AddPublicationDialog 
          formData={formData}
          handleInputChange={handleInputChange}
          handleAbstractChange={handleAbstractChange}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />
      </div>

      {/* Edit Publication Dialog */}
      <EditPublicationDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        formData={formData}
        selectedPublication={selectedPublication}
        handleInputChange={handleInputChange}
        handleAbstractChange={handleAbstractChange}
        handleSubmit={handleSubmit}
      />

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
