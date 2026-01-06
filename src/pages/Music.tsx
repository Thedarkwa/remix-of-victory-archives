import { motion } from 'framer-motion';
import { Music as MusicIcon, Play, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const placeholderTracks = [
  { id: 1, title: 'Amazing Grace', composer: 'John Newton', category: 'Hymn' },
  { id: 2, title: 'How Great Thou Art', composer: 'Carl Boberg', category: 'Hymn' },
  { id: 3, title: 'Total Praise', composer: 'Richard Smallwood', category: 'Gospel' },
  { id: 4, title: 'Hallelujah Chorus', composer: 'G.F. Handel', category: 'Classical' },
];

const Music = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
            <MusicIcon size={24} />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Music Library</h1>
        </div>
        <p className="text-muted-foreground">
          Browse and listen to choir recordings and audio files
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search music..." className="pl-10" />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          Filter
        </Button>
      </motion.div>

      {/* Music Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4"
      >
        {placeholderTracks.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="card-hover">
              <CardContent className="flex items-center gap-4 p-4">
                <button className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-gold-foreground transition-colors">
                  <Play size={20} className="ml-0.5" />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{track.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{track.composer}</p>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                  {track.category}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty state note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center p-8 border-2 border-dashed border-border rounded-xl"
      >
        <MusicIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          Ready to upload music?
        </h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Music upload functionality will be available soon. Check back later to add your choir's recordings.
        </p>
      </motion.div>
    </div>
  );
};

export default Music;
