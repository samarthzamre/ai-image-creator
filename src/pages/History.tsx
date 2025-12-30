import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  History as HistoryIcon, 
  Trash2, 
  Download, 
  Clock, 
  ImageIcon,
  ArrowRight,
  Pencil
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getHistory, removeFromHistory, clearHistory, downloadImage, GeneratedImage } from "@/lib/imageHistory";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const History = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [history, setHistory] = useState<GeneratedImage[]>(getHistory());

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getTimeRemaining = (timestamp: number): string => {
    const expiryMs = 24 * 60 * 60 * 1000;
    const remaining = timestamp + expiryMs - Date.now();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const handleRemove = (id: string) => {
    removeFromHistory(id);
    setHistory(getHistory());
    toast({
      title: "Image removed",
      description: "The image has been removed from your history",
    });
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
    toast({
      title: "History cleared",
      description: "All images have been removed from your history",
    });
  };

  const handleDownload = async (image: GeneratedImage, format: "png" | "jpg" | "jpeg") => {
    try {
      await downloadImage(image.generatedImage, `ai-${image.subcategoryName}-${image.id}`, format);
      toast({
        title: "Download started",
        description: `Your image is being downloaded as ${format.toUpperCase()}`,
      });
    } catch {
      toast({
        title: "Download failed",
        description: "Could not download the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4 md:px-8">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12"
          >
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                Your <span className="gradient-text">History</span>
              </h1>
              <p className="text-muted-foreground">
                Generated images are stored locally for 24 hours
              </p>
            </div>

            {history.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="glass-card border-destructive/50 text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your generated images. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="btn-secondary">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </motion.div>

          {/* History Grid */}
          {history.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {history.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card-hover overflow-hidden group"
                  >
                    {/* Image Preview */}
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={image.generatedImage}
                        alt={`${image.subcategoryName} style`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{image.subcategoryName}</h3>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                          {image.categoryName}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(image.createdAt)}
                        </span>
                        <span className="text-xs">
                          {getTimeRemaining(image.createdAt)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 flex-1"
                          onClick={() => navigate(`/edit/${image.id}`)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" className="btn-primary h-9">
                              <Download className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleDownload(image, "png")}>
                              Download PNG
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(image, "jpg")}>
                              Download JPG
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(image, "jpeg")}>
                              Download JPEG
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9"
                          onClick={() => handleRemove(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-primary/20 flex items-center justify-center">
                <HistoryIcon className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-semibold mb-3">
                No images yet
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start generating AI images and they'll appear here. Images are stored locally for 24 hours.
              </p>
              <Link to="/generate">
                <Button className="btn-primary gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Generate Your First Image
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default History;
