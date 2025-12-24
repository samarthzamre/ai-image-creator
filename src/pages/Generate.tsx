import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Upload, 
  ArrowLeft, 
  Wand2, 
  Download, 
  Loader2, 
  ImageIcon, 
  X,
  CheckCircle 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSubcategoryById, getCategoryById, categories } from "@/lib/categories";
import { saveToHistory, downloadImage } from "@/lib/imageHistory";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryId || "");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const category = selectedCategory ? getCategoryById(selectedCategory) : undefined;
  const subcategory = category && selectedSubcategory 
    ? getSubcategoryById(selectedCategory, selectedSubcategory) 
    : undefined;

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
        description: "Please select a category, subcategory, and upload an image",
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

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4 md:px-8">
        <div className="container-custom max-w-4xl">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Generate</span> Your Image
            </h1>
            <p className="text-muted-foreground text-lg">
              {subcategory 
                ? `Creating ${subcategory.name} style image`
                : "Select a category and upload your photo to get started"
              }
            </p>
          </motion.div>

          {/* Category Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select 
                value={selectedCategory} 
                onValueChange={(val) => {
                  setSelectedCategory(val);
                  setSelectedSubcategory("");
                }}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Style</label>
              <Select 
                value={selectedSubcategory} 
                onValueChange={setSelectedSubcategory}
                disabled={!category}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue placeholder={category ? "Select style" : "Select category first"} />
                </SelectTrigger>
                <SelectContent>
                  {category?.subcategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            {!uploadedImage ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`glass-card border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
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
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-primary/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Upload Your Photo
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PNG, JPG, JPEG (max 10MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="glass-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Original Image */}
                  <div className="relative">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Original Image
                    </h3>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
                      <img
                        src={uploadedImage}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={clearUpload}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Generated Image */}
                  <div className="relative">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Wand2 className="w-4 h-4" />
                      Generated Image
                    </h3>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                      {isGenerating ? (
                        <div className="text-center">
                          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                          <p className="text-muted-foreground">Generating your masterpiece...</p>
                        </div>
                      ) : generatedImage ? (
                        <img
                          src={generatedImage}
                          alt="Generated"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Click generate to create</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              className="btn-primary text-lg px-8 py-4 h-auto w-full sm:w-auto gap-2"
              onClick={handleGenerate}
              disabled={!uploadedImage || !subcategory || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Image
                </>
              )}
            </Button>

            {generatedImage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="btn-secondary text-lg px-8 py-4 h-auto w-full sm:w-auto gap-2">
                    <Download className="w-5 h-5" />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleDownload("png")}>
                    Download as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("jpg")}>
                    Download as JPG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("jpeg")}>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">
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
