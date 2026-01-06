import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Music, Volume2 } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const formatTime = (time: number) => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const MiniPlayer = () => {
  const { currentTrack, isPlaying, currentTime, duration, toggle, seek, stop } = useAudioPlayer();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:left-[280px]"
      >
        {/* Progress bar on top */}
        <div className="h-1 bg-muted">
          <motion.div 
            className="h-full bg-gold"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-card/95 backdrop-blur-lg border-t border-border px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            {/* Track info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                <Music size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentTrack.description || currentTrack.file_name || 'Now Playing'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-gold/10 text-gold hover:bg-gold hover:text-gold-foreground"
                onClick={toggle}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </Button>
            </div>

            {/* Timeline - hidden on mobile */}
            <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md">
              <span className="text-xs text-muted-foreground w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={(value) => seek(value[0])}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10">
                {formatTime(duration)}
              </span>
            </div>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={stop}
            >
              <X size={18} />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
