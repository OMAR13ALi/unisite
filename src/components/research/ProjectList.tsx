
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell,
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ResearchProject } from '@/services/researchService';
import { Pencil, Trash, CheckCircle, XCircle, ImageIcon } from 'lucide-react';

interface ProjectListProps {
  projects: ResearchProject[];
  isLoading: boolean;
  handleEditClick: (project: ResearchProject) => void;
  handleDeleteClick: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading,
  handleEditClick,
  handleDeleteClick
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading research projects...</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No research projects found. Add your first project!</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cover Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>
              {project.cover_image_url ? (
                <img 
                  src={project.cover_image_url} 
                  alt={project.title} 
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                  <ImageIcon size={16} className="text-muted-foreground" />
                </div>
              )}
            </TableCell>
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
  );
};

export default ProjectList;
