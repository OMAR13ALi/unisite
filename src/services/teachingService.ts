
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/components/teaching/CourseList';
import { Material } from '@/components/teaching/MaterialsView';

// Fetch courses
export const fetchCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('year', { ascending: false })
    .order('semester', { ascending: false });
  
  if (error) throw error;
  return data as Course[];
};

// Fetch course materials
export const fetchCourseMaterials = async (courseId: string): Promise<Material[]> => {
  const { data, error } = await supabase
    .from('course_materials')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Material[];
};

// Create a new course
export const createCourse = async (newCourse: Omit<Course, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('courses')
    .insert([newCourse])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Update an existing course
export const updateCourse = async (id: string, course: Omit<Course, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('courses')
    .update(course)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Delete a course
export const deleteCourse = async (id: string) => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Upload a material
export interface UploadMaterialParams {
  courseId: string;
  title: string;
  type: string;
  description: string;
  file: File;
}

export const uploadMaterial = async ({
  courseId,
  title,
  type,
  description,
  file
}: UploadMaterialParams) => {
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
  
  return material[0];
};

// Delete a material and its file
export const deleteMaterial = async (materialId: string, filePath: string) => {
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
};
