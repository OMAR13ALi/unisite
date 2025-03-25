
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploaderProps {
  initialImageUrl?: string;
  onImageUploaded: (url: string) => void;
  bucket: string;
  folder: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImageUrl,
  onImageUploaded,
  bucket,
  folder
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);

  const generateUniqueFileName = (originalName: string) => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExt = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${fileExt}`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // convert to MB
    
    if (fileSize > 5) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    try {
      setIsUploading(true);
      
      // Check if bucket exists, if not, create it
      const { data: bucketExists } = await supabase.storage.getBucket(bucket);
      if (!bucketExists) {
        await supabase.storage.createBucket(bucket, {
          public: true
        });
      }
      
      const filePath = `${folder}/${generateUniqueFileName(file.name)}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: publicUrl } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      setImageUrl(publicUrl.publicUrl);
      onImageUploaded(publicUrl.publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(undefined);
    onImageUploaded('');
  };

  return (
    <div className="space-y-2">
      {imageUrl ? (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Cover" 
            className="w-full h-48 object-cover rounded-md"
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <Image className="w-12 h-12 mx-auto text-gray-400" />
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              {isUploading ? "Uploading..." : "PNG, JPG or WEBP up to 5MB"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            disabled={isUploading}
          >
            <label className="cursor-pointer flex items-center">
              <Upload size={16} className="mr-2" />
              {isUploading ? "Uploading..." : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
