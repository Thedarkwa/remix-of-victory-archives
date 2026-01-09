import { useState, useEffect, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { MiniPlayer } from '@/components/MiniPlayer';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentTrack } = useAudioPlayer();
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Swipe detection
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Fetch avatar URL
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', user.id)
        .single();
      
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    };
    
    fetchAvatar();
  }, [user?.id]);

  // Swipe gesture handlers
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current === null || touchEndX.current === null) return;
      
      const swipeDistance = touchEndX.current - touchStartX.current;
      const minSwipeDistance = 50;
      
      // Swipe right to open (only if starting from left edge)
      if (swipeDistance > minSwipeDistance && touchStartX.current < 50) {
        setSidebarOpen(true);
      }
      
      // Swipe left to close
      if (swipeDistance < -minSwipeDistance && sidebarOpen) {
        setSidebarOpen(false);
      }
      
      touchStartX.current = null;
      touchEndX.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sidebarOpen]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - always visible on desktop */}
      <div className="hidden lg:block">
        <AppSidebar isOpen={true} onClose={() => {}} />
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="lg:ml-[280px]">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          {/* User avatar in mobile header */}
          <Link to="/profile" className="flex items-center gap-2">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-primary/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-xs font-display font-bold text-primary-foreground">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
        </header>

        {/* Page content */}
        <main className={`p-4 lg:p-8 ${currentTrack ? 'pb-24' : ''}`}>
          <Outlet />
        </main>
      </div>

      {/* Persistent Mini Player */}
      <MiniPlayer />
    </div>
  );
};
