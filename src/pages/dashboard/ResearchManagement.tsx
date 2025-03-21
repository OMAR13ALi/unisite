
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell,
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash, CheckCircle, XCircle } from 'lucide-react';

// Types
interface ResearchProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
}

// Fetch research projects
const fetchResearchProjects = async () => {
  const { data, error } = await supabase
    .from('research_projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as ResearchProject[];
};

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
    mutationFn: async (newProject: Omit<ResearchProject, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('research_projects')
        .insert([newProject])
        .select();
      
      if (error) throw error;
      return data[0];
    },
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
    mutationFn: async ({ id, ...project }: { id: string } & Omit<ResearchProject, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('research_projects')
        .update(project)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
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
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('research_projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
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
                <Button type="submit">Save Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Edit Research Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">Title</label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-category" className="text-sm font-medium">Category</label>
              <Input
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
              <RichTextEditor
                content={formData.description}
                onChange={handleDescriptionChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-status" className="text-sm font-medium">Status</label>
              <select
                id="edit-status"
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
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Research Projects Table */}
      <div className="rounded-md border bg-white">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading research projects...</p>
          </div>
        ) : !projects || projects.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No research projects found. Add your first project!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : project.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status === 'active' && <CheckCircle size={12} className="mr-1" />}
                      {project.status === 'on-hold' && <XCircle size={12} className="mr-1" />}
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditClick(project)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteClick(project.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ResearchManagement;
