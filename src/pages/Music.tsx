import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music as MusicIcon, Play, Pause, Search, Upload, Trash2, Loader2, ExternalLink, Volume2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import ContentUploadDialog from '@/components/ContentUploadDialog';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';

interface MusicItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string | null;
  content_type: string;
  created_at: string;
}

const Music = () => {
  const { role, loading: roleLoading } = useUserRole();
  const [items, setItems] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isAdmin = role === 'admin';

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('music')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching music:', error);
      toast.error('Failed to load music');
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (item: MusicItem) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setDeletingId(item.id);
    try {
      if (item.content_type === 'file') {
        const urlParts = item.file_url.split('/');
        const filePath = urlParts.slice(-2).join('/');
        await supabase.storage.from('music').remove([filePath]);
      }
      
      const { error } = await supabase.from('music').delete().eq('id', item.id);
      if (error) throw error;
      
      toast.success('Item deleted successfully');
      if (playingId === item.id) {
        setPlayingId(null);
        audioRef.current?.pause();
      }
      fetchItems();
    } catch (error: any) {
      toast.error('Failed to delete item');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePlayPause = (item: MusicItem) => {
    if (item.content_type === 'url') {
      window.open(item.file_url, '_blank');
      return;
    }

    if (playingId === item.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = item.file_url;
        audioRef.current.play();
        setPlayingId(item.id);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlayingId(null)}
        onLoadedMetadata={handleTimeUpdate}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <MusicIcon size={24} />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Music Library</h1>
          </div>
          {isAdmin && (
            <ContentUploadDialog
              contentType="music"
              acceptedFileTypes="audio/*"
              onUploadComplete={fetchItems}
            >
              <Button className="flex items-center gap-2">
                <Upload size={16} />
                Upload Music
              </Button>
            </ContentUploadDialog>
          )}
        </div>
        <p className="text-muted-foreground">
          Browse and listen to choir recordings and audio files
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
            placeholder="Search music..." 
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
          className="grid gap-4"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className={`card-hover ${playingId === item.id ? 'ring-2 ring-gold' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePlayPause(item)}
                      className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-gold-foreground transition-colors flex-shrink-0"
                    >
                      {item.content_type === 'url' ? (
                        <ExternalLink size={20} />
                      ) : playingId === item.id ? (
                        <Pause size={20} />
                      ) : (
                        <Play size={20} className="ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.description || item.file_name || (item.content_type === 'url' ? 'External link' : '')}
                      </p>
                    </div>
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
                  
                  {/* Audio Player Controls */}
                  {playingId === item.id && item.content_type === 'file' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      <div className="flex items-center gap-3">
                        <Volume2 size={16} className="text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground w-10">{formatTime(currentTime)}</span>
                        <Slider
                          value={[currentTime]}
                          max={duration || 100}
                          step={0.1}
                          onValueChange={handleSeek}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
                      </div>
                    </motion.div>
                  )}
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
          <MusicIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'No results found' : 'No music uploaded yet'}
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {isAdmin 
              ? "Click the 'Upload Music' button to add your first track."
              : 'Check back later for new music uploads.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Music;
