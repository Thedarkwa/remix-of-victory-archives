import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { MiniPlayer } from '@/components/MiniPlayer';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentTrack } = useAudioPlayer();

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
        <header className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
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
