
import { Button } from '@/components/elements/button';
import Input from '@/components/elements/input';
import InputError from '@/components/elements/input-error';
import Label from '@/components/elements/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AvatarUploadFieldProps {
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
  username?: string;
  error?: string;
  onRemoveImage?: () => void;
}

export default function AvatarUploadField({ imagePreview, onImageChange, username, error }: AvatarUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const getInitials = useInitials();
  const initials = getInitials(username ?? '');

  useEffect(() => {
    if (imagePreview) {
      setPreview(imagePreview);
    }
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log('Handle File Triggered');
    if (file) {
      console.log(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    } else {
      setPreview(null);
      onImageChange(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);

      // Sync with hidden input
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    console.log('File Input Triggered');
    fileInputRef.current?.click();
  };

const img = preview
  ? preview.startsWith('http') || preview.startsWith('data:')
    ? preview
    : '/storage/' + preview
  : undefined;


  return (
    <div className="flex items-start gap-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="border-border h-24 w-24 border-4">
          <AvatarImage src={img} alt={username || ''} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-semibold text-white">
            {initials || 'Y/N'}
          </AvatarFallback>
        </Avatar>

        {preview && (
          <Button type="button" variant="outline" size="sm" onClick={clearImage} className="flex items-center gap-1">
            <X className="h-3 w-3" />
            Remove
          </Button>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          } ${error ? 'border-destructive' : ''}`}
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <div className="space-y-2">
            <Label className="cursor-pointer">
              <span className="text-primary hover:text-primary/80 text-sm font-medium">Click to upload</span>
              <span className="text-muted-foreground text-sm"> or drag and drop</span>
            </Label>
            <Input id="avatar" name="avatar" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef}  className="hidden" />
            <p className="text-muted-foreground text-xs">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
        {error && <InputError message={error} />}
      </div>
    </div>
  );
}
