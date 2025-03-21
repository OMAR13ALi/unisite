
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog';
import { ResearchProject } from '@/services/researchService';

interface ProjectFormProps {
  formData: {
    title: string;
    description: string;
    category: string;
    status: string;
  };
  selectedProject: ResearchProject | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDescriptionChange: (content: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  formData,
  selectedProject,
  handleInputChange,
  handleDescriptionChange,
  handleSubmit,
  resetForm
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <Input
          id="title"
          name="title"
          placeholder="Research project title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">Category</label>
        <Input
          id="category"
          name="category"
          placeholder="E.g., AI, Machine Learning, Quantum Computing"
          value={formData.category}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <RichTextEditor
          content={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Detailed description of the research project"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">Status</label>
        <select
          id="status"
          name="status"
          className="w-full p-2 border rounded-md"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={resetForm}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">{selectedProject ? 'Update' : 'Save'} Project</Button>
      </DialogFooter>
    </form>
  );
};

export default ProjectForm;
