import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Pencil, Trash, Upload, Book, File, Video, FileText, X, BookOpen, ListChecks, Calendar } from 'lucide-react';

// Types
interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  semester: string;
  year: string;
  status: string;
  created_at: string;
}

interface Material {
  id: string;
  course_id: string;
  title: string;
  type: string;
  file_path: string;
  description: string | null;
  created_at: string;
}

// Define material types
const MATERIAL_TYPES = [
  { value: 'pdf', label: 'Lecture Notes (PDF)', icon: FileText },
  { value: 'syllabus', label: 'Syllabus', icon: BookOpen },
  { value: 'assignment', label: 'Assignment', icon: ListChecks },
  { value: 'exam', label: 'Exam', icon: Calendar },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'other', label: 'Other Material', icon: File }
];

// Fetch courses
const fetchCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('year', { ascending: false })
    .order('semester', { ascending: false });
  
  if (error) throw error;
  return data as Course[];
};

// Fetch course materials
const fetchCourseMaterials = async (courseId: string) => {
  const { data, error } = await supabase
    .from('course_materials')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Material[];
};

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
    queryFn: fetchCourses
  });

  // React Query for fetching course materials
  const { data: materials, isLoading: isLoadingMaterials } = useQuery({
    queryKey: ['course-materials', selectedCourse?.id],
    queryFn: () => fetchCourseMaterials(selectedCourse?.id || ''),
    enabled: !!selectedCourse?.id,
  });

  // Create course mutation
  const createCourse = useMutation({
    mutationFn: async (newCourse: Omit<Course, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('courses')
        .insert([newCourse])
        .select();
      
      if (error) throw error;
      return data[0];
    },
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
    mutationFn: async ({ id, ...course }: { id: string } & Omit<Course, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('courses')
        .update(course)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
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
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
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
      
      // 1. Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${courseId}/${type}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('course_materials')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // 2. Get public URL for the uploaded file
      const { data: fileData } = supabase.storage
        .from('course_materials')
        .getPublicUrl(filePath);
      
      // 3. Save material metadata to database
      const { data: material, error: materialError } = await supabase
        .from('course_materials')
        .insert([{
          course_id: courseId,
          title,
          type,
          description: description || null,
          file_path: fileData.publicUrl
        }])
        .select();
      
      if (materialError) throw materialError;
      
      setIsUploading(false);
      return material[0];
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
      setIsUploading(false);
    }
  });

  // Delete material mutation
  const deleteMaterial = useMutation({
    mutationFn: async ({ materialId, filePath }: { materialId: string; filePath: string }) => {
      // 1. Delete the record from the database
      const { error: dbError } = await supabase
        .from('course_materials')
        .delete()
        .eq('id', materialId);
      
      if (dbError) throw dbError;
      
      // 2. Try to delete the file from storage (not critical if it fails)
      // Extract the path relative to the bucket
      const pathParts = filePath.split('course_materials/');
      if (pathParts.length > 1) {
        const storagePath = pathParts[1];
        await supabase.storage
          .from('course_materials')
          .remove([storagePath])
          .catch(error => {
            console.warn('File could not be deleted from storage:', error);
          });
      }
    },
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

  // Group materials by type
  const materialsByType = materials ? materials.reduce((acc, material) => {
    if (!acc[material.type]) {
      acc[material.type] = [];
    }
    acc[material.type].push(material);
    return acc;
  }, {} as Record<string, Material[]>) : {};

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
              <form onSubmit={handleCourseSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Course Title</label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Advanced Machine Learning"
                    value={courseFormData.title}
                    onChange={handleCourseInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium">Course Code</label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="CS 401"
                    value={courseFormData.code}
                    onChange={handleCourseInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Course description"
                    value={courseFormData.description}
                    onChange={handleCourseInputChange}
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="semester" className="text-sm font-medium">Semester</label>
                    <select
                      id="semester"
                      name="semester"
                      className="w-full p-2 border rounded-md"
                      value={courseFormData.semester}
                      onChange={handleCourseInputChange}
                    >
                      <option value="Fall">Fall</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                      <option value="Winter">Winter</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="year" className="text-sm font-medium">Year</label>
                    <Input
                      id="year"
                      name="year"
                      placeholder="2023"
                      value={courseFormData.year}
                      onChange={handleCourseInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">Status</label>
                  <select
                    id="status"
                    name="status"
                    className="w-full p-2 border rounded-md"
                    value={courseFormData.status}
                    onChange={handleCourseInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={resetCourseForm}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Save Course</Button>
                </DialogFooter>
              </form>
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
                  <form onSubmit={handleMaterialSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="material-title" className="text-sm font-medium">Title</label>
                      <Input
                        id="material-title"
                        name="title"
                        placeholder="Lecture 1: Introduction"
                        value={materialFormData.title}
                        onChange={handleMaterialInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="material-type" className="text-sm font-medium">Material Type</label>
                      <select
                        id="material-type"
                        name="type"
                        className="w-full p-2 border rounded-md"
                        value={materialFormData.type}
                        onChange={handleMaterialInputChange}
                      >
                        {MATERIAL_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="material-description" className="text-sm font-medium">Description (optional)</label>
                      <Textarea
                        id="material-description"
                        name="description"
                        placeholder="Brief description of this material"
                        value={materialFormData.description}
                        onChange={handleMaterialInputChange}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">File Upload</label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 flex flex-col items-center justify-center">
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept={
                            ['pdf', 'syllabus', 'assignment', 'exam'].includes(materialFormData.type) 
                              ? '.pdf' 
                              : materialFormData.type === 'video' 
                                ? '.mp4,.webm,.mov' 
                                : '*'
                          }
                        />
                        {selectedFile ? (
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              {['pdf', 'syllabus', 'assignment', 'exam'].includes(materialFormData.type) && 
                                <FileText size={32} className="text-blue-500 mb-2" />}
                              {materialFormData.type === 'video' && 
                                <Video size={32} className="text-red-500 mb-2" />}
                              {!['pdf', 'syllabus', 'assignment', 'exam', 'video'].includes(materialFormData.type) && 
                                <File size={32} className="text-gray-500 mb-2" />}
                            </div>
                            <p className="text-sm font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => setSelectedFile(null)}
                            >
                              <X size={14} className="mr-1" /> Remove
                            </Button>
                          </div>
                        ) : (
                          <label htmlFor="file-upload" className="cursor-pointer text-center">
                            <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {['pdf', 'syllabus', 'assignment', 'exam'].includes(materialFormData.type) 
                                ? 'PDF files only' 
                                : materialFormData.type === 'video' 
                                  ? 'Video files only (MP4, WebM, MOV)' 
                                  : 'All file types supported'}
                            </p>
                          </label>
                        )}
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {
                        resetMaterialForm();
                        setIsAddMaterialDialogOpen(false);
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={!selectedFile || isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload Material'}
                      </Button>
                    </DialogFooter>
                  </form>
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
          <form onSubmit={handleCourseSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">Course Title</label>
              <Input
                id="edit-title"
                name="title"
                value={courseFormData.title}
                onChange={handleCourseInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-code" className="text-sm font-medium">Course Code</label>
              <Input
                id="edit-code"
                name="code"
                value={courseFormData.code}
                onChange={handleCourseInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
              <Textarea
                id="edit-description"
                name="description"
                value={courseFormData.description}
                onChange={handleCourseInputChange}
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-semester" className="text-sm font-medium">Semester</label>
                <select
                  id="edit-semester"
                  name="semester"
                  className="w-full p-2 border rounded-md"
                  value={courseFormData.semester}
                  onChange={handleCourseInputChange}
                >
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-year" className="text-sm font-medium">Year</label>
                <Input
                  id="edit-year"
                  name="year"
                  value={courseFormData.year}
                  onChange={handleCourseInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-status" className="text-sm font-medium">Status</label>
              <select
                id="edit-status"
                name="status"
                className="w-full p-2 border rounded-md"
                value={courseFormData.status}
                onChange={handleCourseInputChange}
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditCourseDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Course</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="materials" disabled={!selectedCourse}>Course Materials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="mt-6">
          {isLoadingCourses ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading courses...</p>
            </div>
          ) : !courses || courses.length === 0 ? (
            <div className="p-8 text-center">
              <Book size={48} className="text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No courses found. Add your first course!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="bg-accent/30 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.code}</CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        course.status === 'active' ? 'bg-green-100 text-green-800' :
                        course.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-base font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.semester} {course.year}</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm line-clamp-3">{course.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" size="sm" onClick={() => handleCourseSelect(course)}>
                      Manage Materials
                    </Button>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditCourseClick(course)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteCourseClick(course.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="materials" className="mt-6">
          {!selectedCourse ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Please select a course first</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-accent/20 p-4 rounded-md">
                <h3 className="text-lg font-medium">{selectedCourse.code}: {selectedCourse.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedCourse.semester} {selectedCourse.year}</p>
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
              
              {isLoadingMaterials ? (
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
                    onClick={() => setIsAddMaterialDialogOpen(true)}
                  >
                    <Upload size={16} className="mr-2" />
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
                        <a 
                          href={material.file_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary text-sm hover:underline"
                        >
                          View Material
                        </a>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteMaterialClick(material)}
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
                              <a 
                                href={material.file_path} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary text-sm hover:underline"
                              >
                                View Material
                              </a>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteMaterialClick(material)}
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeachingManagement;
