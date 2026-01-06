import { motion } from 'framer-motion';
import { Video as VideoIcon, Play, Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const placeholderVideos = [
  { id: 1, title: 'Sunday Service Performance', date: 'Dec 15, 2024', duration: '12:34', event: 'Sunday Service' },
  { id: 2, title: 'Christmas Carol Night', date: 'Dec 24, 2024', duration: '45:20', event: 'Christmas' },
  { id: 3, title: 'Weekly Rehearsal Session', date: 'Dec 10, 2024', duration: '1:30:00', event: 'Rehearsal' },
  { id: 4, title: 'Anniversary Celebration', date: 'Nov 28, 2024', duration: '25:15', event: 'Anniversary' },
];

const Videos = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <VideoIcon size={24} />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Video Gallery</h1>
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
          <Input placeholder="Search videos..." className="pl-10" />
        </div>
      </motion.div>

      {/* Video Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {placeholderVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="card-hover overflow-hidden">
              {/* Video Thumbnail Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-navy to-navy-dark flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors" />
                <button className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center text-gold-foreground group-hover:scale-110 transition-transform shadow-lg">
                  <Play size={28} className="ml-1" />
                </button>
                <span className="absolute bottom-3 right-3 px-2 py-1 bg-navy-dark/80 text-cream text-xs rounded">
                  {video.duration}
                </span>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">{video.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {video.date}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                    {video.event}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty state */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center p-8 border-2 border-dashed border-border rounded-xl"
      >
        <VideoIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          More videos coming soon
        </h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Video upload functionality will be available soon. Capture and share your choir moments!
        </p>
      </motion.div>
    </div>
  );
};

export default Videos;
