import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ContentUploadDialogProps {
  contentType: 'music' | 'scores' | 'videos' | 'images' | 'documents';
  acceptedFileTypes: string;
  onUploadComplete: () => void;
  children: React.ReactNode;
}

const ContentUploadDialog = ({ 
  contentType, 
  acceptedFileTypes, 
  onUploadComplete, 
  children 
}: ContentUploadDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !user) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(contentType)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(contentType)
        .getPublicUrl(filePath);

      // Insert record into database
      const { error: dbError } = await supabase
        .from(contentType)
        .insert({
          title,
          description: description || null,
          file_url: publicUrl,
          file_name: file.name,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      toast.success('Content uploaded successfully!');
      setOpen(false);
      setTitle('');
      setDescription('');
      setFile(null);
      onUploadComplete();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload content');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <Label>File *</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFileTypes}
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-foreground truncate max-w-[200px]">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload size={24} />
                  <span className="text-sm">Click to select a file</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading || !file || !title}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentUploadDialog;
