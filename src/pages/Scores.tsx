import { motion } from 'framer-motion';
import { FileText, Download, Eye, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const voiceParts = ['All', 'Soprano', 'Alto', 'Tenor', 'Bass'];

const placeholderScores = [
  { id: 1, title: 'Amazing Grace - Full Score', part: 'All', pages: 4 },
  { id: 2, title: 'Total Praise - Soprano', part: 'Soprano', pages: 2 },
  { id: 3, title: 'How Great Thou Art - Alto', part: 'Alto', pages: 3 },
  { id: 4, title: 'Hallelujah Chorus - Tenor', part: 'Tenor', pages: 5 },
];

const Scores = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-navy-light/10 flex items-center justify-center text-navy-light">
            <FileText size={24} />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Sheet Music</h1>
        </div>
        <p className="text-muted-foreground">
          Access and download choir scores organized by voice parts
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search scores..." className="pl-10" />
        </div>
      </motion.div>

      {/* Voice Part Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="mb-6 flex-wrap h-auto gap-2 bg-transparent p-0">
            {voiceParts.map((part) => (
              <TabsTrigger
                key={part}
                value={part}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-full border border-border"
              >
                {part}
              </TabsTrigger>
            ))}
          </TabsList>

          {voiceParts.map((part) => (
            <TabsContent key={part} value={part}>
              <div className="grid gap-4">
                {placeholderScores
                  .filter((score) => part === 'All' || score.part === part)
                  .map((score, index) => (
                    <motion.div
                      key={score.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="card-hover">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="w-12 h-12 rounded-lg bg-navy/10 flex items-center justify-center text-navy">
                            <FileText size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{score.title}</h3>
                            <p className="text-sm text-muted-foreground">{score.pages} pages • PDF</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                              <Eye size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-gold">
                              <Download size={18} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* Empty state */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center p-8 border-2 border-dashed border-border rounded-xl"
      >
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          Upload coming soon
        </h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Score upload functionality will be available soon. Stay tuned!
        </p>
      </motion.div>
    </div>
  );
};

export default Scores;
