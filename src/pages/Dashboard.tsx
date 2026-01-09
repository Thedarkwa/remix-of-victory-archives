import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Music, FileText, Video, Image, FolderOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import choirImage from '@/assets/choir-image.jfif';

const resourceCards = [
  {
    title: 'Music',
    description: 'Audio files and recordings',
    icon: Music,
    path: '/music',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    title: 'Scores',
    description: 'Sheet music and arrangements',
    icon: FileText,
    path: '/scores',
    color: 'from-magenta-light/20 to-magenta-light/5',
    iconColor: 'text-magenta-light',
  },
  {
    title: 'Videos',
    description: 'Rehearsals and performances',
    icon: Video,
    path: '/videos',
    color: 'from-magenta/20 to-magenta/5',
    iconColor: 'text-magenta',
  },
  {
    title: 'Images',
    description: 'Photos and memories',
    icon: Image,
    path: '/images',
    color: 'from-magenta-dark/20 to-magenta-dark/5',
    iconColor: 'text-magenta-dark',
  },
  {
    title: 'Documents',
    description: 'Schedules and guidelines',
    icon: FolderOpen,
    path: '/documents',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const Dashboard = () => {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Member';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
          Welcome back, <span className="text-gradient-magenta">{displayName}</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Access all Victory Vocals GH resources in one place
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-hero rounded-2xl p-6 lg:p-8 mb-10 relative overflow-hidden"
      >
        <img 
          src={choirImage} 
          alt="Victory Vocals GH Choir" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy-dark/70" />
        <div className="relative z-10">
          <h2 className="font-display text-xl font-semibold text-cream mb-4">
            Victory Resources
          </h2>
          <p className="text-cream/80 max-w-2xl">
            Your central digital archive for all choir resources. Explore our collection of 
            music, scores, videos, images, and important documents.
          </p>
        </div>
      </motion.div>

      {/* Resource Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {resourceCards.map((resource) => (
          <motion.div key={resource.title} variants={itemVariants}>
            <Link to={resource.path}>
              <Card className="card-hover cursor-pointer border-border/50 h-full">
                <CardHeader className={`bg-gradient-to-br ${resource.color} rounded-t-lg`}>
                  <div className={`w-12 h-12 rounded-xl bg-card flex items-center justify-center ${resource.iconColor}`}>
                    <resource.icon size={24} />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="font-display text-lg mb-1">{resource.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;
