
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import PublicationForm from '@/components/publications/PublicationForm';
import { Publication } from '@/services/publicationsService';
import { PublicationFormData } from '@/hooks/usePublicationsManagement';

interface EditPublicationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: PublicationFormData;
  selectedPublication: Publication | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAbstractChange: (content: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const EditPublicationDialog: React.FC<EditPublicationDialogProps> = ({
  isOpen,
  setIsOpen,
  formData,
  selectedPublication,
  handleInputChange,
  handleAbstractChange,
  handleSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            handleSubmit={handleSubmit}
            resetForm={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPublicationDialog;
