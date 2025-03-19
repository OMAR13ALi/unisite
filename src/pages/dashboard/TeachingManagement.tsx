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
  DialogClose
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Upload } from 'lucide-react';

// Import components
import CourseForm from '@/components/teaching/CourseForm';
import CourseList, { Course } from '@/components/teaching/CourseList';
import MaterialUploadForm from '@/components/teaching/MaterialUploadForm';
import MaterialsView, { Material } from '@/components/teaching/MaterialsView';

// Import services
import * as teachingService from '@/services/teachingService';

const TeachingManagement = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false);
  const [isAddMaterialDialogOpen, setIsAddMaterialDialogOpen] = useState(false);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    code: '',
    description: '',
    semester: 'Fall',
    year: new Date().getFullYear().toString(),
    status: 'active'
  });
  const [materialFormData, setMaterialFormData] = useState({
    title: '',
    type: 'pdf',
    description: '',
    file: null as File | null
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [materialsView, setMaterialsView] = useState<'all' | 'by-type'>('all');

  // React Query for fetching courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: teachingService.fetchCourses
  });

  // React Query for fetching course materials
  const { data: materials, isLoading: isLoadingMaterials } = useQuery({
    queryKey: ['course-materials', selectedCourse?.id],
    queryFn: () => selectedCourse ? teachingService.fetchCourseMaterials(selectedCourse.id) : Promise.resolve([]),
    enabled: !!selectedCourse?.id,
  });

  // Create course mutation
  const createCourse = useMutation({
    mutationFn: teachingService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
      resetCourseForm();
    },
    onError: (error) => {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
    }
  });

  // Update course mutation
  const updateCourse = useMutation({
    mutationFn: ({ id, ...course }: { id: string } & Omit<Course, 'id' | 'created_at'>) => 
      teachingService.updateCourse(id, course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully');
      setIsEditCourseDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    }
  });

  // Delete course mutation
  const deleteCourse = useMutation({
    mutationFn: teachingService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      if (selectedCourse) {
        setSelectedCourse(null);
      }
      toast.success('Course deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  });

  // Upload material mutation
  const uploadMaterial = useMutation({
    mutationFn: async ({ 
      courseId, 
      title, 
      type, 
      description, 
      file 
    }: { 
      courseId: string;
      title: string;
      type: string;
      description: string;
      file: File;
    }) => {
      setIsUploading(true);
      try {
        const result = await teachingService.uploadMaterial({
          courseId,
          title,
          type,
          description,
          file
        });
        setIsUploading(false);
        return result;
      } catch (error) {
        setIsUploading(false);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-materials', selectedCourse?.id] });
      toast.success('Course material uploaded successfully');
      setIsAddMaterialDialogOpen(false);
      resetMaterialForm();
    },
    onError: (error) => {
      console.error('Error uploading material:', error);
      toast.error('Failed to upload course material');
    }
  });

  // Delete material mutation
  const deleteMaterial = useMutation({
    mutationFn: ({ materialId, filePath }: { materialId: string; filePath: string }) => 
      teachingService.deleteMaterial(materialId, filePath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-materials', selectedCourse?.id] });
      toast.success('Course material deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete course material');
    }
  });

  // Handle form input changes
  const handleCourseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourseFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMaterialInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMaterialFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      
      // Auto-detect file type for PDFs
      const fileName = e.target.files[0].name.toLowerCase();
      if (fileName.endsWith('.pdf')) {
        // Keep the current type if it's a PDF-compatible type
        const isPdfType = ['pdf', 'syllabus', 'assignment', 'exam'].includes(materialFormData.type);
        if (!isPdfType) {
          setMaterialFormData(prev => ({ ...prev, type: 'pdf' }));
        }
      } else if (fileName.endsWith('.mp4') || fileName.endsWith('.webm') || fileName.endsWith('.mov')) {
        setMaterialFormData(prev => ({ ...prev, type: 'video' }));
      } else {
        setMaterialFormData(prev => ({ ...prev, type: 'other' }));
      }
    }
  };

  // Handle form submissions
  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse) {
      updateCourse.mutate({ id: selectedCourse.id, ...courseFormData });
    } else {
      createCourse.mutate(courseFormData);
    }
  };

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedFile) {
      toast.error('Please select a course and upload a file');
      return;
    }
    
    uploadMaterial.mutate({
      courseId: selectedCourse.id,
      title: materialFormData.title,
      type: materialFormData.type,
      description: materialFormData.description,
      file: selectedFile
    });
  };

  // Reset form fields
  const resetCourseForm = () => {
    setCourseFormData({
      title: '',
      code: '',
      description: '',
      semester: 'Fall',
      year: new Date().getFullYear().toString(),
      status: 'active'
    });
    setSelectedCourse(null);
  };

  const resetMaterialForm = () => {
    setMaterialFormData({
      title: '',
      type: 'pdf',
      description: '',
      file: null
    });
    setSelectedFile(null);
  };

  // Open edit dialog with course data
  const handleEditCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setCourseFormData({
      title: course.title,
      code: course.code,
      description: course.description,
      semester: course.semester,
      year: course.year,
      status: course.status
    });
    setIsEditCourseDialogOpen(true);
  };

  // Handle course selection for materials view
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setActiveTab('materials');
  };

  // Handle delete confirmations
  const handleDeleteCourseClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all associated materials.')) {
      deleteCourse.mutate(id);
    }
  };

  const handleDeleteMaterialClick = (material: Material) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      deleteMaterial.mutate({ 
        materialId: material.id, 
        filePath: material.file_path 
      });
    }
  };

  if (!isAdmin) {
    return <p>You do not have permission to access this page.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-medium">Teaching Management</h2>
        {activeTab === 'courses' ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
              </DialogHeader>
              <CourseForm 
                formData={courseFormData}
                handleInputChange={handleCourseInputChange}
                handleSubmit={handleCourseSubmit}
                resetForm={resetCourseForm}
                isEditing={false}
              />
            </DialogContent>
          </Dialog>
        ) : (
          selectedCourse && (
            <div className="flex gap-2">
              <Dialog open={isAddMaterialDialogOpen} onOpenChange={setIsAddMaterialDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload size={16} className="mr-2" />
                    Upload Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Upload Course Material</DialogTitle>
                  </DialogHeader>
                  <MaterialUploadForm 
                    formData={materialFormData}
                    handleInputChange={handleMaterialInputChange}
                    handleFileChange={handleFileChange}
                    handleSubmit={handleMaterialSubmit}
                    resetForm={() => {
                      resetMaterialForm();
                      setIsAddMaterialDialogOpen(false);
                    }}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    isUploading={isUploading}
                  />
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" onClick={() => setActiveTab('courses')}>
                Back to Courses
              </Button>
            </div>
          )
        )}
      </div>

      {/* Edit Course Dialog */}
      <Dialog open={isEditCourseDialogOpen} onOpenChange={setIsEditCourseDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <CourseForm 
            formData={courseFormData}
            handleInputChange={handleCourseInputChange}
            handleSubmit={handleCourseSubmit}
            resetForm={() => setIsEditCourseDialogOpen(false)}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="materials" disabled={!selectedCourse}>Course Materials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="mt-6">
          <CourseList 
            courses={courses || []}
            isLoading={isLoadingCourses}
            onSelectCourse={handleCourseSelect}
            onEditCourse={handleEditCourseClick}
            onDeleteCourse={handleDeleteCourseClick}
          />
        </TabsContent>
        
        <TabsContent value="materials" className="mt-6">
          {!selectedCourse ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Please select a course first</p>
            </div>
          ) : (
            <MaterialsView 
              course={selectedCourse}
              materials={materials || []}
              isLoading={isLoadingMaterials}
              materialsView={materialsView}
              setMaterialsView={setMaterialsView}
              onDeleteMaterial={handleDeleteMaterialClick}
              onUploadClick={() => setIsAddMaterialDialogOpen(true)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeachingManagement;
