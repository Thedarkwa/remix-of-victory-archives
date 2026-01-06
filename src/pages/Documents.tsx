import { motion } from 'framer-motion';
import { FolderOpen, FileText, Download, Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const placeholderDocs = [
  { id: 1, title: 'Choir Guidelines 2024', type: 'PDF', date: 'Jan 2024', category: 'Guidelines' },
  { id: 2, title: 'Rehearsal Schedule - Q1', type: 'PDF', date: 'Dec 2024', category: 'Schedule' },
  { id: 3, title: 'Christmas Event Plan', type: 'DOCX', date: 'Dec 2024', category: 'Event' },
  { id: 4, title: 'Member Directory', type: 'XLSX', date: 'Nov 2024', category: 'Directory' },
  { id: 5, title: 'Annual Report 2024', type: 'PDF', date: 'Dec 2024', category: 'Report' },
];

const categoryColors: Record<string, string> = {
  Guidelines: 'bg-primary/10 text-primary',
  Schedule: 'bg-magenta-light/10 text-magenta-light',
  Event: 'bg-magenta/10 text-magenta',
  Directory: 'bg-magenta-dark/10 text-magenta-dark',
  Report: 'bg-primary/10 text-primary',
};

const Documents = () => {
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
            <FolderOpen size={24} />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Documents</h1>
        </div>
        <p className="text-muted-foreground">
          Access important files, schedules, and guidelines
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
          <Input placeholder="Search documents..." className="pl-10" />
        </div>
      </motion.div>

      {/* Category Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {['All', 'Guidelines', 'Schedule', 'Event', 'Directory', 'Report'].map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              cat === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Documents List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {placeholderDocs.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="card-hover">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{doc.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">{doc.type}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {doc.date}
                    </span>
                  </div>
                </div>
                <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColors[doc.category]}`}>
                  {doc.category}
                </span>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Download size={18} />
                </Button>
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
        <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          Document management coming soon
        </h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Upload and organize your important choir documents in one place.
        </p>
      </motion.div>
    </div>
  );
};

export default Documents;
