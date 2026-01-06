import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, Search, Grid3X3, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const placeholderImages = [
  { id: 1, title: 'Sunday Service', event: 'Church Service', date: 'Dec 2024' },
  { id: 2, title: 'Christmas Concert', event: 'Christmas', date: 'Dec 2024' },
  { id: 3, title: 'Team Building', event: 'Retreat', date: 'Nov 2024' },
  { id: 4, title: 'Choir Practice', event: 'Rehearsal', date: 'Nov 2024' },
  { id: 5, title: 'Anniversary', event: 'Celebration', date: 'Oct 2024' },
  { id: 6, title: 'Outreach Program', event: 'Community', date: 'Oct 2024' },
];

const Images = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [gridSize, setGridSize] = useState<'small' | 'large'>('large');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ImageIcon size={24} />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Photo Gallery</h1>
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
          <Input placeholder="Search images..." className="pl-10" />
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

      {/* Image Grid */}
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
        {placeholderImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * index }}
            className="group cursor-pointer"
            onClick={() => setSelectedImage(image.id)}
          >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-magenta/10 to-magenta-dark/20">
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                <h3 className="font-semibold text-cream text-sm">{image.title}</h3>
                <p className="text-cream/70 text-xs">{image.event} • {image.date}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

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
              className="max-w-4xl w-full aspect-video bg-gradient-to-br from-primary/20 via-magenta/20 to-magenta-dark/20 rounded-xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageIcon className="h-24 w-24 text-muted-foreground/30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center p-8 border-2 border-dashed border-border rounded-xl"
      >
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          Upload your photos
        </h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Image upload functionality will be available soon. Share your choir memories!
        </p>
      </motion.div>
    </div>
  );
};

export default Images;
