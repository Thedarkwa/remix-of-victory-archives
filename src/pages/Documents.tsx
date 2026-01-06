import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, FileText, Download, Search, Upload, Trash2, Loader2, ExternalLink, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import ContentUploadDialog from '@/components/ContentUploadDialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DocumentItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string | null;
  content_type: string;
  created_at: string;
}

const getFileExtension = (filename: string | null) => {
  if (!filename) return 'LINK';
  return filename.split('.').pop()?.toUpperCase() || 'FILE';
};

const Documents = () => {
  const { role, loading: roleLoading } = useUserRole();
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAdmin = role === 'admin';

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (item: DocumentItem) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    setDeletingId(item.id);
    try {
      if (item.content_type === 'file') {
        const urlParts = item.file_url.split('/');
        const filePath = urlParts.slice(-2).join('/');
        await supabase.storage.from('documents').remove([filePath]);
      }
      
      const { error } = await supabase.from('documents').delete().eq('id', item.id);
      if (error) throw error;
      
      toast.success('Document deleted successfully');
      fetchItems();
    } catch (error: any) {
      toast.error('Failed to delete document');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FolderOpen size={24} />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Documents</h1>
          </div>
          {isAdmin && (
            <ContentUploadDialog
              contentType="documents"
              acceptedFileTypes=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              onUploadComplete={fetchItems}
            >
              <Button className="flex items-center gap-2">
                <Upload size={16} />
                Upload Document
              </Button>
            </ContentUploadDialog>
          )}
        </div>
        <p className="text-muted-foreground">
          Access important files, schedules, and guidelines
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search documents..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredItems.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="card-hover">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{getFileExtension(item.file_name)}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(item.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      asChild
                      title="View"
                    >
                      <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                        {item.content_type === 'url' ? <ExternalLink size={18} /> : <Eye size={18} />}
                      </a>
                    </Button>
                    {item.content_type === 'file' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-gold"
                        asChild
                        title="Download"
                      >
                        <a href={item.file_url} download={item.file_name || item.title}>
                          <Download size={18} />
                        </a>
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center p-8 border-2 border-dashed border-border rounded-xl"
        >
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'No results found' : 'No documents uploaded yet'}
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {isAdmin 
              ? "Click the 'Upload Document' button to add files."
              : 'Check back later for new document uploads.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Documents;
