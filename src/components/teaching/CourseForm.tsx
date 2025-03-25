
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import ImageUploader from '@/components/ui/ImageUploader';

interface CourseFormProps {
  formData: {
    title: string;
    code: string;
    description: string;
    semester: string;
    year: string;
    status: string;
    cover_image_url?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageUpload: (url: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  isEditing: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  formData,
  handleInputChange,
  handleImageUpload,
  handleSubmit,
  resetForm,
  isEditing
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <label htmlFor="cover_image" className="text-sm font-medium">Cover Image (Optional)</label>
        <ImageUploader 
          initialImageUrl={formData.cover_image_url} 
          onImageUploaded={handleImageUpload}
          bucket="course-images"
          folder="covers"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Course Title</label>
        <Input
          id="title"
          name="title"
          placeholder="Advanced Machine Learning"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="code" className="text-sm font-medium">Course Code</label>
        <Input
          id="code"
          name="code"
          placeholder="CS 401"
          value={formData.code}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          name="description"
          placeholder="Course description"
          value={formData.description}
          onChange={handleInputChange}
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
            value={formData.semester}
            onChange={handleInputChange}
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
            value={formData.year}
            onChange={handleInputChange}
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
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={resetForm}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">{isEditing ? 'Update Course' : 'Save Course'}</Button>
      </DialogFooter>
    </form>
  );
};

export default CourseForm;
