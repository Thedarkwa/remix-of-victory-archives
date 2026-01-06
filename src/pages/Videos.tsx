import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video as VideoIcon, Play, Search, Upload, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import ContentUploadDialog from '@/components/ContentUploadDialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string | null;
  content_type: string;
  created_at: string;
}

const Videos = () => {
  const { role, loading: roleLoading } = useUserRole();
  const [items, setItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAdmin = role === 'admin';

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (item: VideoItem) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setDeletingId(item.id);
    try {
      if (item.content_type === 'file') {
        const urlParts = item.file_url.split('/');
        const filePath = urlParts.slice(-2).join('/');
        await supabase.storage.from('videos').remove([filePath]);
      }
      
      const { error } = await supabase.from('videos').delete().eq('id', item.id);
      if (error) throw error;
      
      toast.success('Item deleted successfully');
      fetchItems();
    } catch (error: any) {
      toast.error('Failed to delete item');
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
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <VideoIcon size={24} />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Video Gallery</h1>
          </div>
          {isAdmin && (
            <ContentUploadDialog
              contentType="videos"
              acceptedFileTypes="video/*"
              onUploadComplete={fetchItems}
            >
              <Button className="flex items-center gap-2">
                <Upload size={16} />
                Upload Video
              </Button>
            </ContentUploadDialog>
          )}
        </div>
        <p className="text-muted-foreground">
          Watch rehearsal sessions and performance recordings
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
            placeholder="Search videos..." 
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="card-hover overflow-hidden">
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-video bg-gradient-to-br from-navy to-navy-dark flex items-center justify-center group cursor-pointer block"
                >
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors" />
                  <div className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center text-gold-foreground group-hover:scale-110 transition-transform shadow-lg">
                    {item.content_type === 'url' ? (
                      <ExternalLink size={28} />
                    ) : (
                      <Play size={28} className="ml-1" />
                    )}
                  </div>
                </a>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.description || format(new Date(item.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive flex-shrink-0"
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
          <VideoIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'No results found' : 'No videos uploaded yet'}
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {isAdmin 
              ? "Click the 'Upload Video' button to add a video."
              : 'Check back later for new video uploads.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Videos;
