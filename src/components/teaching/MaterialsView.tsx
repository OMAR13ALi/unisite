
import React from 'react';
import { Button } from '@/components/ui/button';
import { File, Trash, FileText, BookOpen, ListChecks, Calendar, Video } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Course } from './CourseList';

export interface Material {
  id: string;
  course_id: string;
  title: string;
  type: string;
  file_path: string;
  description: string | null;
  created_at: string;
}

// Define material types
export const MATERIAL_TYPES = [
  { value: 'pdf', label: 'Lecture Notes (PDF)', icon: FileText },
  { value: 'syllabus', label: 'Syllabus', icon: BookOpen },
  { value: 'assignment', label: 'Assignment', icon: ListChecks },
  { value: 'exam', label: 'Exam', icon: Calendar },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'other', label: 'Other Material', icon: File }
];

interface MaterialsViewProps {
  course: Course;
  materials: Material[];
  isLoading: boolean;
  materialsView: 'all' | 'by-type';
  setMaterialsView: (view: 'all' | 'by-type') => void;
  onDeleteMaterial: (material: Material) => void;
  onUploadClick: () => void;
}

const MaterialsView: React.FC<MaterialsViewProps> = ({
  course,
  materials,
  isLoading,
  materialsView,
  setMaterialsView,
  onDeleteMaterial,
  onUploadClick
}) => {
  // Get icon for material type
  const getMaterialTypeIcon = (type: string) => {
    const materialType = MATERIAL_TYPES.find(mt => mt.value === type);
    const Icon = materialType?.icon || File;
    return <Icon className="h-6 w-6 text-primary shrink-0 mt-1" />;
  };

  // Get display name for material type
  const getMaterialTypeLabel = (type: string) => {
    return MATERIAL_TYPES.find(mt => mt.value === type)?.label || type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Group materials by type
  const materialsByType = materials ? materials.reduce((acc, material) => {
    if (!acc[material.type]) {
      acc[material.type] = [];
    }
    acc[material.type].push(material);
    return acc;
  }, {} as Record<string, Material[]>) : {};

  // Check if material is a video file
  const isVideoFile = (filePath: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    return videoExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  };

  // Render material content based on type
  const renderMaterialContent = (material: Material) => {
    if (material.type === 'video' || isVideoFile(material.file_path)) {
      return (
        <a 
          href={material.file_path} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary text-sm hover:underline"
        >
          View Video
        </a>
      );
    }
    
    return (
      <a 
        href={material.file_path} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary text-sm hover:underline"
      >
        View Material
      </a>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-accent/20 p-4 rounded-md">
        <h3 className="text-lg font-medium">{course.code}: {course.title}</h3>
        <p className="text-sm text-muted-foreground">{course.semester} {course.year}</p>
      </div>
      
      {/* View toggle */}
      <div className="flex justify-end mb-4">
        <div className="border rounded-md p-1 flex">
          <Button 
            variant={materialsView === 'all' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setMaterialsView('all')}
            className="text-xs"
          >
            All Materials
          </Button>
          <Button 
            variant={materialsView === 'by-type' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setMaterialsView('by-type')}
            className="text-xs"
          >
            By Category
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading course materials...</p>
        </div>
      ) : !materials || materials.length === 0 ? (
        <div className="p-8 text-center">
          <File size={48} className="text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No materials found for this course yet.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onUploadClick}
          >
            Upload Your First Material
          </Button>
        </div>
      ) : materialsView === 'all' ? (
        // All materials view
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {materials.map((material) => (
            <Card key={material.id} className="overflow-hidden">
              <div className="h-32 bg-muted flex items-center justify-center">
                {getMaterialTypeIcon(material.type)}
              </div>
              <CardContent className="pt-4">
                <h4 className="font-medium line-clamp-2">{material.title}</h4>
                <p className="text-xs text-primary mt-1">
                  {getMaterialTypeLabel(material.type)}
                </p>
                {material.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{material.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Added on {new Date(material.created_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                {renderMaterialContent(material)}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDeleteMaterial(material)}
                >
                  <Trash size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        // By type view
        <div className="space-y-8">
          {Object.entries(materialsByType).map(([type, typeMaterials]) => (
            <div key={type}>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                {getMaterialTypeIcon(type)}
                <span>{getMaterialTypeLabel(type)}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {typeMaterials.map(material => (
                  <Card key={material.id} className="overflow-hidden">
                    <CardContent className="pt-4">
                      <h4 className="font-medium line-clamp-2">{material.title}</h4>
                      {material.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{material.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Added on {new Date(material.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      {renderMaterialContent(material)}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDeleteMaterial(material)}
                      >
                        <Trash size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialsView;
