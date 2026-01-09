import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Music,
  FileText,
  Video,
  Image,
  FolderOpen,
  User,
  LogOut,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const baseNavItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Music, label: 'Music', path: '/music' },
  { icon: FileText, label: 'Scores', path: '/scores' },
  { icon: Video, label: 'Videos', path: '/videos' },
  { icon: Image, label: 'Images', path: '/images' },
  { icon: FolderOpen, label: 'Documents', path: '/documents' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const adminNavItem = { icon: Shield, label: 'Admin', path: '/admin' };

export const AppSidebar = ({ isOpen, onClose }: AppSidebarProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

  // Build nav items based on role
  const navItems = isAdmin 
    ? [baseNavItems[0], adminNavItem, ...baseNavItems.slice(1)]
    : baseNavItems;

  const handleSignOut = async () => {
    await signOut();
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy-dark/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-[280px] sidebar-gradient z-50 flex flex-col lg:translate-x-0"
        style={{ transform: 'none' }}
      >
        {/* Close button - mobile only */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-sidebar-foreground/70 hover:text-sidebar-foreground lg:hidden"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src={logo} alt="Victory Vocals" className="h-12 w-auto" />
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold text-sidebar-foreground">
                Victory
              </span>
              <span className="text-xs text-magenta-light tracking-widest">
                RESOURCES
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-sidebar-accent text-magenta-light'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-magenta-light"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          {/* User info */}
          <Link 
            to="/profile" 
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-magenta-light/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-magenta to-magenta-dark flex items-center justify-center text-sm font-display font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {displayName}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user?.email}
              </p>
            </div>
          </Link>

          {/* Logout button */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-destructive transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};
