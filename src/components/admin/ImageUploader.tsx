
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  existingImageUrl?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded,
  existingImageUrl 
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Create a simulated upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);

      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      clearInterval(progressInterval);
      
      if (error) throw error;

      setUploadProgress(100);
      
      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from('product-images').getPublicUrl(filePath);

      setPreview(publicUrl);
      onImageUploaded(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUploaded('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
            className="cursor-pointer"
          />
        </div>
        {preview && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRemoveImage}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading image... {uploadProgress}%
          </div>
        </div>
      )}

      {preview && !uploading && (
        <div className="space-y-2">
          <div className="border rounded-md overflow-hidden w-full max-w-md h-64 bg-muted relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
            <div className="absolute top-2 right-2 bg-background rounded-full p-1 shadow">
              <Check className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Image uploaded successfully! Click the X button to remove it.
          </p>
        </div>
      )}

      {!preview && !uploading && (
        <div className="border border-dashed rounded-md p-6 text-center">
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Upload a product image</p>
          <p className="text-xs text-muted-foreground mt-1">
            Supported formats: JPG, PNG, WEBP. Max size: 5MB
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
