
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
import ProjectForm from '@/components/research/ProjectForm';
import ProjectList from '@/components/research/ProjectList';
import { 
  ResearchProject, 
  fetchResearchProjects, 
  createResearchProject, 
  updateResearchProject, 
  deleteResearchProject 
} from '@/services/researchService';

const ResearchManagement = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'active'
  });

  // React Query for fetching research projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['research-projects'],
    queryFn: fetchResearchProjects
  });

  // Create project mutation
  const createProject = useMutation({
    mutationFn: createResearchProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research-projects'] });
      toast.success('Research project created successfully');
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast.error('Failed to create research project');
    }
  });

  // Update project mutation
  const updateProject = useMutation({
    mutationFn: updateResearchProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research-projects'] });
      toast.success('Research project updated successfully');
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast.error('Failed to update research project');
    }
  });

  // Delete project mutation
  const deleteProject = useMutation({
    mutationFn: deleteResearchProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research-projects'] });
      toast.success('Research project deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete research project');
    }
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle rich text editor changes
  const handleDescriptionChange = (content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject) {
      updateProject.mutate({ id: selectedProject.id, ...formData });
    } else {
      createProject.mutate(formData);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      status: 'active'
    });
    setSelectedProject(null);
  };

  // Open edit dialog with project data
  const handleEditClick = (project: ResearchProject) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      status: project.status
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this research project?')) {
      deleteProject.mutate(id);
    }
  };

  if (!isAdmin) {
    return <p>You do not have permission to access this page.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-medium">Research Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Research Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Add New Research Project</DialogTitle>
            </DialogHeader>
            <ProjectForm 
              formData={formData}
              selectedProject={null}
              handleInputChange={handleInputChange}
              handleDescriptionChange={handleDescriptionChange}
              handleSubmit={handleSubmit}
              resetForm={resetForm}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Edit Research Project</DialogTitle>
          </DialogHeader>
          <ProjectForm 
            formData={formData}
            selectedProject={selectedProject}
            handleInputChange={handleInputChange}
            handleDescriptionChange={handleDescriptionChange}
            handleSubmit={handleSubmit}
            resetForm={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Research Projects Table */}
      <div className="rounded-md border bg-white">
        <ProjectList 
          projects={projects || []}
          isLoading={isLoading}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      </div>
    </div>
  );
};

export default ResearchManagement;
