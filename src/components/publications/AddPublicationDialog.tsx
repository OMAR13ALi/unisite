
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import PublicationForm from '@/components/publications/PublicationForm';
import { PublicationFormData } from '@/hooks/usePublicationsManagement';

interface AddPublicationDialogProps {
  formData: PublicationFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAbstractChange: (content: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

const AddPublicationDialog: React.FC<AddPublicationDialogProps> = ({
  formData,
  handleInputChange,
  handleAbstractChange,
  handleSubmit,
  resetForm
}) => {
  return (
    <Dialog>
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
            handleSubmit={handleSubmit}
            resetForm={resetForm}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPublicationDialog;
