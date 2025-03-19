
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { FileText, Video, File, X, Upload } from 'lucide-react';

// Define material types
export const MATERIAL_TYPES = [
  { value: 'pdf', label: 'Lecture Notes (PDF)', icon: FileText },
  { value: 'syllabus', label: 'Syllabus', icon: FileText },
  { value: 'assignment', label: 'Assignment', icon: FileText },
  { value: 'exam', label: 'Exam', icon: FileText },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'other', label: 'Other Material', icon: File }
];

interface MaterialUploadFormProps {
  formData: {
    title: string;
    type: string;
    description: string;
    file: File | null;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  isUploading: boolean;
}

const MaterialUploadForm: React.FC<MaterialUploadFormProps> = ({
  formData,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  resetForm,
  selectedFile,
  setSelectedFile,
  isUploading
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <label htmlFor="material-title" className="text-sm font-medium">Title</label>
        <Input
          id="material-title"
          name="title"
          placeholder="Lecture 1: Introduction"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="material-type" className="text-sm font-medium">Material Type</label>
        <select
          id="material-type"
          name="type"
          className="w-full p-2 border rounded-md"
          value={formData.type}
          onChange={handleInputChange}
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
          value={formData.description}
          onChange={handleInputChange}
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
              ['pdf', 'syllabus', 'assignment', 'exam'].includes(formData.type) 
                ? '.pdf' 
                : formData.type === 'video' 
                  ? '.mp4,.webm,.mov' 
                  : '*'
            }
          />
          {selectedFile ? (
            <div className="text-center">
              <div className="flex items-center justify-center">
                {['pdf', 'syllabus', 'assignment', 'exam'].includes(formData.type) && 
                  <FileText size={32} className="text-blue-500 mb-2" />}
                {formData.type === 'video' && 
                  <Video size={32} className="text-red-500 mb-2" />}
                {!['pdf', 'syllabus', 'assignment', 'exam', 'video'].includes(formData.type) && 
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
                {['pdf', 'syllabus', 'assignment', 'exam'].includes(formData.type) 
                  ? 'PDF files only' 
                  : formData.type === 'video' 
                    ? 'Video files only (MP4, WebM, MOV)' 
                    : 'All file types supported'}
              </p>
            </label>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button type="submit" disabled={!selectedFile || isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Material'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MaterialUploadForm;
