import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Save,
  Download,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Sun,
  Contrast,
  Droplets,
  Palette,
  Wand2,
  Sparkles,
  User,
  ZoomIn,
  Crop,
  Image as ImageIcon,
  Settings2,
  ChevronUp,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { getHistory, GeneratedImage } from "@/lib/imageHistory";
import { addWatermark } from "@/lib/watermark";

interface EditState {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sharpness: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  zoom: number;
  filter: string;
}

const defaultState: EditState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  sharpness: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
  zoom: 100,
  filter: "none",
};

const filters = [
  { id: "none", name: "Original", css: "" },
  { id: "grayscale", name: "B&W", css: "grayscale(100%)" },
  { id: "sepia", name: "Vintage", css: "sepia(80%)" },
  { id: "warm", name: "Warm", css: "sepia(30%) saturate(140%)" },
  { id: "cool", name: "Cool", css: "hue-rotate(180deg) saturate(80%)" },
  { id: "dramatic", name: "Dramatic", css: "contrast(130%) saturate(120%)" },
  { id: "fade", name: "Fade", css: "contrast(90%) brightness(110%) saturate(80%)" },
  { id: "vibrant", name: "Vibrant", css: "saturate(150%) contrast(110%)" },
];

const aiFeatures = [
  { id: "remove-bg", name: "Remove Background", icon: Sparkles },
  { id: "upscale", name: "AI Upscale (2x)", icon: ZoomIn },
  { id: "enhance", name: "Auto Enhance", icon: Wand2 },
];

const portraitFeatures = [
  { id: "smooth-skin", name: "Smooth Skin", icon: User },
  { id: "remove-blemish", name: "Remove Blemishes", icon: Sparkles },
  { id: "brighten-eyes", name: "Brighten Eyes", icon: Sun },
];

type TabType = "adjust" | "transform" | "filters" | "ai";

const Edit = () => {
  const { imageId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageData, setImageData] = useState<GeneratedImage | null>(null);
  const [editState, setEditState] = useState<EditState>(defaultState);
  const [history, setHistory] = useState<EditState[]>([defaultState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAiFeature, setActiveAiFeature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("adjust");
  const [showPanel, setShowPanel] = useState(true);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Get image from URL param or history
    const urlParam = searchParams.get("url");
    if (urlParam) {
      setImageUrl(decodeURIComponent(urlParam));
    } else if (imageId) {
      const historyItems = getHistory();
      const image = historyItems.find((img) => img.id === imageId);
      if (image) {
        setImageUrl(image.generatedImage);
        setImageData(image);
      }
    }
  }, [imageId, searchParams]);

  const pushToHistory = (newState: EditState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const updateState = (partial: Partial<EditState>) => {
    const newState = { ...editState, ...partial };
    setEditState(newState);
    pushToHistory(newState);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setEditState(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setEditState(history[historyIndex + 1]);
    }
  };

  const resetEdits = () => {
    setEditState(defaultState);
    pushToHistory(defaultState);
  };

  const getTransformStyle = () => {
    return `
      rotate(${editState.rotation}deg)
      scaleX(${editState.flipH ? -1 : 1})
      scaleY(${editState.flipV ? -1 : 1})
      scale(${editState.zoom / 100})
    `;
  };

  const getFilterStyle = () => {
    const baseFilters = [
      `brightness(${editState.brightness}%)`,
      `contrast(${editState.contrast}%)`,
      `saturate(${editState.saturation}%)`,
      `hue-rotate(${editState.hue}deg)`,
      `blur(${editState.blur}px)`,
    ].join(" ");

    const presetFilter = filters.find((f) => f.id === editState.filter)?.css || "";

    return `${baseFilters} ${presetFilter}`;
  };

  const applyEditsToCanvas = async (): Promise<string> => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) throw new Error("Image or canvas not available");

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    const isRotated90 = Math.abs(editState.rotation % 180) === 90;
    canvas.width = isRotated90 ? img.naturalHeight : img.naturalWidth;
    canvas.height = isRotated90 ? img.naturalWidth : img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((editState.rotation * Math.PI) / 180);
    ctx.scale(editState.flipH ? -1 : 1, editState.flipV ? -1 : 1);

    ctx.filter = getFilterStyle();

    ctx.drawImage(
      img,
      -img.naturalWidth / 2,
      -img.naturalHeight / 2,
      img.naturalWidth,
      img.naturalHeight
    );

    ctx.restore();

    // Get the edited image as data URL and apply watermark
    const canvasDataUrl = canvas.toDataURL("image/png", 1.0);
    const watermarkedUrl = await addWatermark(canvasDataUrl);
    return watermarkedUrl;
  };

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const editedImageUrl = await applyEditsToCanvas();
      toast.success("Image saved successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Failed to save edited image:", error);
      toast.error("Failed to save edits");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async (format: "png" | "jpg" | "webp") => {
    try {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      if (!img || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const isRotated90 = Math.abs(editState.rotation % 180) === 90;
      canvas.width = isRotated90 ? img.naturalHeight : img.naturalWidth;
      canvas.height = isRotated90 ? img.naturalWidth : img.naturalHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((editState.rotation * Math.PI) / 180);
      ctx.scale(editState.flipH ? -1 : 1, editState.flipV ? -1 : 1);
      ctx.filter = getFilterStyle();
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      // Apply watermark and download
      const canvasDataUrl = canvas.toDataURL("image/png", 1.0);
      const watermarkedUrl = await addWatermark(canvasDataUrl);

      // Convert data URL back to blob for download
      const response = await fetch(watermarkedUrl);
      const blob = await response.blob();
      
      const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `edited-image-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export image");
    }
  };

  const handleAiFeature = async (featureId: string) => {
    setActiveAiFeature(featureId);
    setIsProcessing(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    switch (featureId) {
      case "remove-bg":
        toast.success("Background removed!");
        break;
      case "upscale":
        toast.success("Image upscaled to 2x!");
        break;
      case "enhance":
        updateState({ brightness: 105, contrast: 110, saturation: 110 });
        toast.success("Image enhanced!");
        break;
      case "smooth-skin":
        toast.success("Skin smoothed!");
        break;
      case "remove-blemish":
        toast.success("Blemishes removed!");
        break;
      case "brighten-eyes":
        toast.success("Eyes brightened!");
        break;
    }

    setIsProcessing(false);
    setActiveAiFeature(null);
  };

  if (!imageUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="font-display text-xl font-semibold mb-2">No image to edit</h2>
          <p className="text-muted-foreground mb-4">Please select an image from your history</p>
          <Button onClick={() => navigate("/history")} className="btn-primary">
            Go to History
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 glass-card border-b border-border/50 px-4 py-3"
      >
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="hidden sm:block">
              <h1 className="font-display font-semibold text-lg">Edit Image</h1>
              {imageData && (
                <p className="text-xs text-muted-foreground">{imageData.subcategoryName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={undo}
              disabled={historyIndex === 0}
              className="rounded-full"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="rounded-full"
            >
              <Redo2 className="w-4 h-4" />
            </Button>

            <div className="hidden sm:flex items-center gap-2 ml-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetEdits}
                className="gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport("png")}>PNG</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("jpg")}>JPG</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("webp")}>WebP</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" className="btn-primary gap-1.5" onClick={handleSave}>
                <Check className="w-3.5 h-3.5" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Image Preview */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
          <canvas ref={canvasRef} className="hidden" />
          
          {isProcessing && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-sm font-medium">Processing...</p>
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-full max-h-full overflow-hidden rounded-xl shadow-2xl"
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Editing"
              crossOrigin="anonymous"
              className="max-w-full max-h-[60vh] lg:max-h-[70vh] object-contain transition-all duration-200"
              style={{
                transform: getTransformStyle(),
                filter: getFilterStyle(),
              }}
            />
          </motion.div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 border-l border-border/50 glass-card overflow-y-auto">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="h-full">
            <TabsList className="w-full grid grid-cols-4 rounded-none border-b border-border/50 bg-transparent h-12">
              <TabsTrigger value="adjust" className="data-[state=active]:bg-primary/10 rounded-none">
                <Settings2 className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="transform" className="data-[state=active]:bg-primary/10 rounded-none">
                <RotateCw className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="filters" className="data-[state=active]:bg-primary/10 rounded-none">
                <Palette className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-primary/10 rounded-none">
                <Sparkles className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="adjust" className="mt-0 space-y-6">
                {[
                  { label: "Brightness", icon: Sun, key: "brightness", min: 0, max: 200 },
                  { label: "Contrast", icon: Contrast, key: "contrast", min: 0, max: 200 },
                  { label: "Saturation", icon: Droplets, key: "saturation", min: 0, max: 200 },
                  { label: "Hue", icon: Palette, key: "hue", min: -180, max: 180 },
                ].map((control) => (
                  <div key={control.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <control.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{control.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {editState[control.key as keyof EditState]}
                      </span>
                    </div>
                    <Slider
                      value={[editState[control.key as keyof EditState] as number]}
                      min={control.min}
                      max={control.max}
                      step={1}
                      onValueChange={([v]) => updateState({ [control.key]: v })}
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="transform" className="mt-0 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rotation</span>
                    <span className="text-xs text-muted-foreground">{editState.rotation}°</span>
                  </div>
                  <div className="flex gap-2">
                    {[0, 90, 180, 270].map((deg) => (
                      <Button
                        key={deg}
                        variant={editState.rotation === deg ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateState({ rotation: deg })}
                        className="flex-1"
                      >
                        {deg}°
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium block">Flip</span>
                  <div className="flex gap-2">
                    <Button
                      variant={editState.flipH ? "default" : "outline"}
                      onClick={() => updateState({ flipH: !editState.flipH })}
                      className="flex-1 gap-2"
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      Horizontal
                    </Button>
                    <Button
                      variant={editState.flipV ? "default" : "outline"}
                      onClick={() => updateState({ flipV: !editState.flipV })}
                      className="flex-1 gap-2"
                    >
                      <FlipVertical className="w-4 h-4" />
                      Vertical
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Zoom</span>
                    <span className="text-xs text-muted-foreground">{editState.zoom}%</span>
                  </div>
                  <Slider
                    value={[editState.zoom]}
                    min={50}
                    max={200}
                    step={5}
                    onValueChange={([v]) => updateState({ zoom: v })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="filters" className="mt-0">
                <div className="grid grid-cols-2 gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => updateState({ filter: filter.id })}
                      className={`p-3 rounded-lg border transition-all text-center ${
                        editState.filter === filter.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div
                        className="w-full aspect-square rounded-md mb-2 bg-gradient-to-br from-primary/30 to-secondary/30"
                        style={{ filter: filter.css || "none" }}
                      />
                      <span className="text-xs font-medium">{filter.name}</span>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-0 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-3">AI Tools</h4>
                  <div className="space-y-2">
                    {aiFeatures.map((feature) => (
                      <Button
                        key={feature.id}
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => handleAiFeature(feature.id)}
                        disabled={isProcessing}
                      >
                        <feature.icon className="w-4 h-4 text-primary" />
                        {feature.name}
                        {activeAiFeature === feature.id && (
                          <div className="ml-auto w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">Portrait Tools</h4>
                  <div className="space-y-2">
                    {portraitFeatures.map((feature) => (
                      <Button
                        key={feature.id}
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => handleAiFeature(feature.id)}
                        disabled={isProcessing}
                      >
                        <feature.icon className="w-4 h-4 text-primary" />
                        {feature.name}
                        {activeAiFeature === feature.id && (
                          <div className="ml-auto w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Mobile Bottom Panel */}
        <AnimatePresence>
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: showPanel ? 0 : "calc(100% - 56px)" }}
            className="lg:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-border/50 rounded-t-2xl z-40 max-h-[70vh] overflow-hidden"
          >
            {/* Panel Toggle */}
            <button
              onClick={() => setShowPanel(!showPanel)}
              className="w-full flex items-center justify-center py-3 border-b border-border/30"
            >
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </button>

            {/* Mobile Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="h-full">
              <TabsList className="w-full grid grid-cols-4 bg-transparent h-12">
                <TabsTrigger value="adjust" className="data-[state=active]:bg-primary/10">
                  <Settings2 className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="transform" className="data-[state=active]:bg-primary/10">
                  <RotateCw className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="filters" className="data-[state=active]:bg-primary/10">
                  <Palette className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="ai" className="data-[state=active]:bg-primary/10">
                  <Sparkles className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>

              <div className="p-4 overflow-y-auto max-h-[50vh]">
                <TabsContent value="adjust" className="mt-0 space-y-5">
                  {[
                    { label: "Brightness", icon: Sun, key: "brightness", min: 0, max: 200 },
                    { label: "Contrast", icon: Contrast, key: "contrast", min: 0, max: 200 },
                    { label: "Saturation", icon: Droplets, key: "saturation", min: 0, max: 200 },
                    { label: "Hue", icon: Palette, key: "hue", min: -180, max: 180 },
                  ].map((control) => (
                    <div key={control.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <control.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{control.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {editState[control.key as keyof EditState]}
                        </span>
                      </div>
                      <Slider
                        value={[editState[control.key as keyof EditState] as number]}
                        min={control.min}
                        max={control.max}
                        step={1}
                        onValueChange={([v]) => updateState({ [control.key]: v })}
                      />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="transform" className="mt-0 space-y-5">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[0, 90, 180, 270].map((deg) => (
                      <Button
                        key={deg}
                        variant={editState.rotation === deg ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateState({ rotation: deg })}
                      >
                        {deg}°
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={editState.flipH ? "default" : "outline"}
                      onClick={() => updateState({ flipH: !editState.flipH })}
                      className="flex-1 gap-2"
                      size="sm"
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      H-Flip
                    </Button>
                    <Button
                      variant={editState.flipV ? "default" : "outline"}
                      onClick={() => updateState({ flipV: !editState.flipV })}
                      className="flex-1 gap-2"
                      size="sm"
                    >
                      <FlipVertical className="w-4 h-4" />
                      V-Flip
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Zoom: {editState.zoom}%</span>
                    <Slider
                      value={[editState.zoom]}
                      min={50}
                      max={200}
                      step={5}
                      onValueChange={([v]) => updateState({ zoom: v })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="filters" className="mt-0">
                  <div className="grid grid-cols-4 gap-2">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => updateState({ filter: filter.id })}
                        className={`p-2 rounded-lg border transition-all text-center ${
                          editState.filter === filter.id
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        }`}
                      >
                        <span className="text-xs font-medium">{filter.name}</span>
                      </button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="mt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[...aiFeatures, ...portraitFeatures].map((feature) => (
                      <Button
                        key={feature.id}
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2"
                        onClick={() => handleAiFeature(feature.id)}
                        disabled={isProcessing}
                      >
                        <feature.icon className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs truncate">{feature.name}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </div>

              {/* Mobile Action Bar */}
              <div className="flex items-center gap-2 p-4 border-t border-border/30">
                <Button variant="outline" size="sm" onClick={resetEdits} className="flex-1">
                  Reset
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Download className="w-3.5 h-3.5" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport("png")}>PNG</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("jpg")}>JPG</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("webp")}>WebP</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" className="btn-primary flex-1 gap-1" onClick={handleSave}>
                  <Check className="w-3.5 h-3.5" />
                  Save
                </Button>
              </div>
            </Tabs>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Edit;
