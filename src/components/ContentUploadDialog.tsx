import { useState, useRef } from 'react';
import { Upload, X, Loader2, Link } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
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
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    if (activeTab === 'file') {
      if (!file || !title) {
        toast.error('Please fill in all required fields');
        return;
      }
    } else {
      if (!url || !title) {
        toast.error('Please fill in all required fields');
        return;
      }
      // Basic URL validation
      try {
        new URL(url);
      } catch {
        toast.error('Please enter a valid URL');
        return;
      }
    }

    setUploading(true);

    try {
      if (activeTab === 'file' && file) {
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
            content_type: 'file',
          });

        if (dbError) throw dbError;
      } else {
        // Insert URL-based record
        const { error: dbError } = await supabase
          .from(contentType)
          .insert({
            title,
            description: description || null,
            file_url: url,
            file_name: null,
            uploaded_by: user.id,
            content_type: 'url',
          });

        if (dbError) throw dbError;
      }

      toast.success('Content added successfully!');
      setOpen(false);
      resetForm();
      onUploadComplete();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to add content');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setUrl('');
    setActiveTab('file');
  };

  const isValid = activeTab === 'file' ? (file && title) : (url && title);

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
          <DialogTitle>Add {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'file' | 'url')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload size={16} />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link size={16} />
              Share URL
            </TabsTrigger>
          </TabsList>
          
          <div className="space-y-4 mt-4">
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
            
            <TabsContent value="file" className="mt-0">
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
            </TabsContent>
            
            <TabsContent value="url" className="mt-0">
              <div>
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or any media URL"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  YouTube, Vimeo, SoundCloud, Spotify, or any other media link
                </p>
              </div>
            </TabsContent>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={uploading || !isValid}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {activeTab === 'file' ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  activeTab === 'file' ? 'Upload' : 'Add Link'
                )}
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ContentUploadDialog;