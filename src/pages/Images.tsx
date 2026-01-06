import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, Search, Grid3X3, LayoutGrid, Upload, Trash2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import ContentUploadDialog from '@/components/ContentUploadDialog';
import { toast } from 'sonner';

interface ImageItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  created_at: string;
}

const Images = () => {
  const { role, loading: roleLoading } = useUserRole();
  const [items, setItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [gridSize, setGridSize] = useState<'small' | 'large'>('large');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAdmin = role === 'admin';

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (item: ImageItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    setDeletingId(item.id);
    try {
      const urlParts = item.file_url.split('/');
      const filePath = urlParts.slice(-2).join('/');
      
      await supabase.storage.from('images').remove([filePath]);
      
      const { error } = await supabase.from('images').delete().eq('id', item.id);
      if (error) throw error;
      
      toast.success('Image deleted successfully');
      setSelectedImage(null);
      fetchItems();
    } catch (error: any) {
      toast.error('Failed to delete image');
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
              <ImageIcon size={24} />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Photo Gallery</h1>
          </div>
          {isAdmin && (
            <ContentUploadDialog
              contentType="images"
              acceptedFileTypes="image/*"
              onUploadComplete={fetchItems}
            >
              <Button className="flex items-center gap-2">
                <Upload size={16} />
                Upload Image
              </Button>
            </ContentUploadDialog>
          )}
        </div>
        <p className="text-muted-foreground">
          Browse choir photos and memories
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search images..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={gridSize === 'large' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setGridSize('large')}
          >
            <LayoutGrid size={18} />
          </Button>
          <Button
            variant={gridSize === 'small' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setGridSize('small')}
          >
            <Grid3X3 size={18} />
          </Button>
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
          className={`grid gap-4 ${
            gridSize === 'large' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              className="group cursor-pointer relative"
              onClick={() => setSelectedImage(item)}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                <img 
                  src={item.file_url} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                  <h3 className="font-semibold text-cream text-sm">{item.title}</h3>
                  {item.description && (
                    <p className="text-cream/70 text-xs truncate">{item.description}</p>
                  )}
                </div>
                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={(e) => handleDelete(item, e)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </Button>
                )}
              </div>
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
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'No results found' : 'No images uploaded yet'}
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {isAdmin 
              ? "Click the 'Upload Image' button to add photos."
              : 'Check back later for new image uploads.'}
          </p>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-dark/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-cream/70 hover:text-cream"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.file_url} 
                alt={selectedImage.title}
                className="w-full h-full object-contain rounded-xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-navy-dark/90 to-transparent rounded-b-xl">
                <h3 className="font-semibold text-cream">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-cream/70 text-sm">{selectedImage.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Images;
