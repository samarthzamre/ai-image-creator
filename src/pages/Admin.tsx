import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Save,
  FolderPlus,
  X,
  ChevronDown,
  ChevronRight,
  Edit2,
  Eye,
  Sparkles,
  Settings,
  Home,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { saveAdminCategories, getAdminCategories, AdminCategory, AdminSubcategory, AdminSampleImage } from "@/lib/useCategories";

const defaultColors = [
  "from-rose-500 to-pink-500",
  "from-blue-500 to-indigo-500",
  "from-purple-500 to-violet-500",
  "from-amber-500 to-orange-500",
  "from-teal-500 to-emerald-500",
  "from-pink-500 to-cyan-400",
  "from-violet-600 to-purple-500",
  "from-slate-600 to-gray-700",
];

const Admin = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Load categories from localStorage on mount
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  
  // Load existing admin categories on mount
  useEffect(() => {
    const existing = getAdminCategories();
    if (existing.length > 0) {
      setCategories(existing);
    }
  }, []);
  
  // New category form
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "🎨",
    color: defaultColors[0],
  });
  
  // New subcategory form
  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    description: "",
    prompt: "",
  });

  const [uploadingImages, setUploadingImages] = useState<AdminSampleImage[]>([]);

  const generateId = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({ title: "Error", description: "Category name is required", variant: "destructive" });
      return;
    }

    const category: AdminCategory = {
      id: generateId(newCategory.name),
      name: newCategory.name,
      description: newCategory.description,
      icon: newCategory.icon,
      color: newCategory.color,
      subcategories: [],
    };

    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    saveAdminCategories(updatedCategories);
    setNewCategory({ name: "", description: "", icon: "🎨", color: defaultColors[0] });
    setIsAddingCategory(false);
    toast({ title: "Success", description: "Category added and synced to website" });
  };

  const handleAddSubcategory = () => {
    if (!selectedCategory || !newSubcategory.name) {
      toast({ title: "Error", description: "Subcategory name is required", variant: "destructive" });
      return;
    }

    const subcategory: AdminSubcategory = {
      id: generateId(newSubcategory.name),
      name: newSubcategory.name,
      description: newSubcategory.description,
      prompt: newSubcategory.prompt,
      sampleImages: [...uploadingImages],
    };

    const updatedCategories = categories.map(cat => 
      cat.id === selectedCategory 
        ? { ...cat, subcategories: [...cat.subcategories, subcategory] }
        : cat
    );

    setCategories(updatedCategories);
    saveAdminCategories(updatedCategories);
    setNewSubcategory({ name: "", description: "", prompt: "" });
    setUploadingImages([]);
    setIsAddingSubcategory(false);
    toast({ title: "Success", description: "Subcategory added and synced to website" });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: AdminSampleImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url: event.target?.result as string,
          alt: file.name.replace(/\.[^/.]+$/, ""),
        };
        setUploadingImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCoverImageUpload = (categoryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const updatedCategories = categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, coverImage: event.target?.result as string }
          : cat
      );
      setCategories(updatedCategories);
      saveAdminCategories(updatedCategories);
    };
    reader.readAsDataURL(file);
  };

  const removeUploadingImage = (imageId: string) => {
    setUploadingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    saveAdminCategories(updatedCategories);
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }
    toast({ title: "Deleted", description: "Category removed and synced" });
  };

  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    const updatedCategories = categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId) }
        : cat
    );
    setCategories(updatedCategories);
    saveAdminCategories(updatedCategories);
    toast({ title: "Deleted", description: "Subcategory removed and synced" });
  };

  const handleSaveToStorage = () => {
    saveAdminCategories(categories);
    toast({ title: "Saved", description: "All changes synced to website" });
  };

  const selectedCat = categories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/30">
        <div className="container-custom flex items-center justify-between h-14 md:h-16 px-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Back to Site</span>
            </Link>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-lg">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <Eye className="w-4 h-4" />
                View Site
              </Button>
            </Link>
            <Button onClick={handleSaveToStorage} size="sm" className="btn-primary gap-2">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container-custom py-6 px-4">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar - Categories List */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="glass-card p-4 rounded-xl sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-lg">Categories</h2>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsAddingCategory(true)}
                  className="gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </div>

              {/* Categories List */}
              <div className="space-y-2 max-h-[60vh] overflow-y-auto mobile-scroll">
                {categories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderPlus className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No categories yet</p>
                    <p className="text-xs">Add your first category</p>
                  </div>
                ) : (
                  categories.map((category) => (
                    <motion.div
                      key={category.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedCategory === category.id 
                          ? "bg-primary/10 border border-primary/30" 
                          : "bg-secondary/30 hover:bg-secondary/50 border border-transparent"
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedSubcategory(null);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {category.coverImage ? (
                          <img 
                            src={category.coverImage} 
                            alt={category.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-lg`}>
                            {category.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{category.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {category.subcategories.length} styles
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCategory(category.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9">
            {selectedCategory && selectedCat ? (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Category Details */}
                <div className="glass-card p-4 md:p-6 rounded-xl">
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* Cover Image */}
                    <div className="relative group">
                      <input
                        type="file"
                        ref={coverInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleCoverImageUpload(selectedCategory, e)}
                      />
                      {selectedCat.coverImage ? (
                        <img 
                          src={selectedCat.coverImage} 
                          alt={selectedCat.name}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover"
                        />
                      ) : (
                        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gradient-to-br ${selectedCat.color} flex items-center justify-center text-3xl md:text-4xl`}>
                          {selectedCat.icon}
                        </div>
                      )}
                      <button
                        onClick={() => coverInputRef.current?.click()}
                        className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center"
                      >
                        <Upload className="w-6 h-6 text-primary" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <h2 className="font-display text-xl md:text-2xl font-bold mb-1">{selectedCat.name}</h2>
                      <p className="text-muted-foreground text-sm">{selectedCat.description}</p>
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                          {selectedCat.subcategories.length} subcategories
                        </span>
                        <span className="text-xs px-2 py-1 rounded-md bg-secondary">
                          {selectedCat.subcategories.reduce((acc, sub) => acc + sub.sampleImages.length, 0)} images
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                <div className="glass-card p-4 md:p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold text-lg">Subcategories & Images</h3>
                    <Button 
                      size="sm" 
                      onClick={() => setIsAddingSubcategory(true)}
                      className="gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Style
                    </Button>
                  </div>

                  {selectedCat.subcategories.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No subcategories yet</p>
                      <p className="text-sm">Add styles with sample images</p>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="space-y-3">
                      {selectedCat.subcategories.map((sub) => (
                        <AccordionItem 
                          key={sub.id} 
                          value={sub.id}
                          className="bg-secondary/30 rounded-lg border border-border/50 overflow-hidden"
                        >
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-center gap-3 text-left">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                                {sub.sampleImages[0] ? (
                                  <img 
                                    src={sub.sampleImages[0].url} 
                                    alt={sub.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{sub.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {sub.sampleImages.length} images
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-xs text-muted-foreground">Description</Label>
                                <p className="text-sm">{sub.description}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">AI Prompt</Label>
                                <p className="text-sm bg-secondary/50 p-2 rounded-md">{sub.prompt}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground mb-2 block">Sample Images</Label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                  {sub.sampleImages.map((img) => (
                                    <div key={img.id} className="aspect-square rounded-lg overflow-hidden">
                                      <img 
                                        src={img.url} 
                                        alt={img.alt}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteSubcategory(selectedCategory, sub.id)}
                                className="gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Style
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-8 md:p-16 rounded-xl text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                <h2 className="font-display text-xl md:text-2xl font-bold mb-2">Welcome to Admin Panel</h2>
                <p className="text-muted-foreground mb-6">
                  Select a category to manage or create a new one
                </p>
                <Button onClick={() => setIsAddingCategory(true)} className="btn-primary gap-2">
                  <Plus className="w-4 h-4" />
                  Add First Category
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., Festivals, Portrait, etc."
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Brief description of this category"
                rows={2}
              />
            </div>
            <div>
              <Label>Icon (Emoji)</Label>
              <Input
                value={newCategory.icon}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                placeholder="🎨"
                className="text-2xl"
              />
            </div>
            <div>
              <Label>Color Theme</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {defaultColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} ${
                      newCategory.color === color ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddingCategory(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddCategory} className="flex-1 btn-primary">
                Add Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={isAddingSubcategory} onOpenChange={setIsAddingSubcategory}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Style</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Style Name</Label>
              <Input
                value={newSubcategory.name}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                placeholder="e.g., Diwali Celebration"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newSubcategory.description}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                placeholder="Brief description"
                rows={2}
              />
            </div>
            <div>
              <Label>AI Prompt</Label>
              <Textarea
                value={newSubcategory.prompt}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, prompt: e.target.value })}
                placeholder="Detailed prompt for AI image generation..."
                rows={3}
              />
            </div>
            <div>
              <Label className="mb-2 block">Sample Images</Label>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full gap-2 h-20 border-dashed"
              >
                <Upload className="w-5 h-5" />
                Click to upload images
              </Button>
              
              {uploadingImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {uploadingImages.map((img) => (
                    <div key={img.id} className="relative group aspect-square">
                      <img 
                        src={img.url} 
                        alt={img.alt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeUploadingImage(img.id)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingSubcategory(false);
                  setUploadingImages([]);
                }} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleAddSubcategory} className="flex-1 btn-primary">
                Add Style
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
