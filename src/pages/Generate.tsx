import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { 
  Upload, 
  ArrowLeft, 
  Wand2, 
  Download, 
  Loader2, 
  ImageIcon, 
  X,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSubcategoryById, getCategoryById } from "@/lib/categories";
import { saveToHistory, downloadImage } from "@/lib/imageHistory";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Generate = () => {
  const { categoryId, subcategoryId } = useParams<{
    categoryId?: string;
    subcategoryId?: string;
  }>();
  const { toast } = useToast();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const category = categoryId ? getCategoryById(categoryId) : undefined;
  const subcategory = category && subcategoryId 
    ? getSubcategoryById(categoryId, subcategoryId) 
    : undefined;

  // Get the first sample image as reference
  const referenceImage = subcategory?.sampleImages?.[0];

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, JPEG)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setGeneratedImage(null);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleGenerate = async () => {
    if (!uploadedImage || !subcategory || !category) {
      toast({
        title: "Missing requirements",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API call - replace with actual Gemini API integration
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // For demo, we'll use the uploaded image with a filter effect
      // In production, this would call the Gemini API
      setGeneratedImage(uploadedImage);
      
      // Save to history
      saveToHistory({
        originalImage: uploadedImage,
        generatedImage: uploadedImage,
        categoryId: category.id,
        subcategoryId: subcategory.id,
        categoryName: category.name,
        subcategoryName: subcategory.name,
      });

      toast({
        title: "Image generated!",
        description: "Your AI image has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (format: "png" | "jpg" | "jpeg") => {
    if (!generatedImage) return;
    
    try {
      await downloadImage(generatedImage, `ai-generated-${Date.now()}`, format);
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

  const clearUpload = () => {
    setUploadedImage(null);
    setGeneratedImage(null);
  };

  // If no category/subcategory selected, redirect user
  if (!category || !subcategory) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="pt-32 pb-16 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">Choose a Style First</h1>
            <p className="text-muted-foreground mb-8">
              Please select a category and style to generate your AI image
            </p>
            <Link to="/categories">
              <Button className="btn-primary gap-2">
                <Sparkles className="w-5 h-5" />
                Browse Categories
              </Button>
            </Link>
          </motion.div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-28 pb-16 px-4 md:px-8">
        <div className="container-custom max-w-6xl">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to={`/categories/${categoryId}/${subcategoryId}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to {subcategory.name} Styles
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
              <span className="text-2xl">{category.icon}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {category.name} • {subcategory.name}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
              Create Your <span className="gradient-text">{subcategory.name}</span> Look
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Upload your photo and let AI transform it into this stunning style
            </p>
          </motion.div>

          {/* Main Content - Two Column Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Left Side - Reference Image */}
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">Reference Style</h3>
                  <p className="text-sm text-muted-foreground">Your photo will be transformed like this</p>
                </div>
              </div>
              
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary/50 relative group">
                {referenceImage ? (
                  <img
                    src={referenceImage.url}
                    alt={referenceImage.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                )}
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass-card px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Wand2 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{subcategory.name} Style</p>
                      <p className="text-xs text-muted-foreground">{subcategory.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Upload / Result */}
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                  {generatedImage ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Upload className="w-5 h-5 text-accent" />
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">
                    {generatedImage ? "Generated Result" : "Your Photo"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {generatedImage ? "Download your AI masterpiece" : "Upload to start transformation"}
                  </p>
                </div>
              </div>

              {/* Upload / Preview Area */}
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary/30 relative">
                {!uploadedImage ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 border-dashed rounded-xl ${
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer text-center p-8 w-full h-full flex flex-col items-center justify-center">
                      <motion.div 
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                      >
                        <Upload className="w-10 h-10 text-primary" />
                      </motion.div>
                      <h3 className="font-display text-xl font-semibold mb-2">
                        Upload Your Photo
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Drag & drop or click to browse
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="px-2 py-1 rounded bg-secondary text-xs font-medium">PNG</span>
                        <span className="px-2 py-1 rounded bg-secondary text-xs font-medium">JPG</span>
                        <span className="px-2 py-1 rounded bg-secondary text-xs font-medium">JPEG</span>
                        <span className="text-xs">Max 10MB</span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {/* Show generated or original image */}
                    <img
                      src={generatedImage || uploadedImage}
                      alt={generatedImage ? "Generated" : "Original"}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Loading Overlay */}
                    {isGenerating && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="relative w-20 h-20 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <Wand2 className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                          <p className="font-medium text-lg mb-1">Creating Magic...</p>
                          <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Clear button */}
                    {!isGenerating && (
                      <button
                        onClick={clearUpload}
                        className="absolute top-3 right-3 w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:bg-destructive/20 hover:border-destructive/50 transition-colors group"
                      >
                        <X className="w-5 h-5 group-hover:text-destructive" />
                      </button>
                    )}

                    {/* Status Badge */}
                    {!isGenerating && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className={`glass-card px-4 py-2 flex items-center gap-2 ${generatedImage ? 'border-success/30' : ''}`}>
                          {generatedImage ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span className="text-sm font-medium text-success">Generation Complete</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Ready to transform</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              className="btn-primary text-lg px-10 py-5 h-auto w-full sm:w-auto gap-3"
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {generatedImage ? "Regenerate" : "Generate Image"}
                </>
              )}
            </Button>

            {generatedImage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="btn-secondary text-lg px-10 py-5 h-auto w-full sm:w-auto gap-3">
                    <Download className="w-5 h-5" />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-card border-border">
                  <DropdownMenuItem onClick={() => handleDownload("png")} className="cursor-pointer">
                    Download as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("jpg")} className="cursor-pointer">
                    Download as JPG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("jpeg")} className="cursor-pointer">
                    Download as JPEG
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </motion.div>

          {/* Success Message */}
          {generatedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass-card border-success/20">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">
                  Image saved to history for 24 hours
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Generate;
