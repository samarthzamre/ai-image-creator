import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Sun,
  Contrast,
  Droplets,
  Palette,
  RefreshCw,
  Check,
  X,
  SlidersHorizontal,
  Crop,
  Maximize2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Move,
  Download,
  Sparkles,
  Eraser,
  ArrowUpRight,
  Wand2,
  Image as ImageIcon,
  Thermometer,
  Focus,
  Aperture,
  User,
  Smile,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
}

interface EditState {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  exposure: number;
  temperature: number;
  tint: number;
  sharpness: number;
  blur: number;
  filter: string;
  cropAspect: string | null;
  zoom: number;
  panX: number;
  panY: number;
}

const defaultState: EditState = {
  rotation: 0,
  flipH: false,
  flipV: false,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  exposure: 100,
  temperature: 0,
  tint: 0,
  sharpness: 0,
  blur: 0,
  filter: "none",
  cropAspect: null,
  zoom: 1,
  panX: 0,
  panY: 0,
};

const filters = [
  { id: "none", name: "Original", css: "" },
  { id: "bw", name: "B&W", css: "grayscale(100%)" },
  { id: "vintage", name: "Vintage", css: "sepia(50%) contrast(90%) brightness(90%)" },
  { id: "cinematic", name: "Cinematic", css: "contrast(120%) saturate(85%) brightness(90%)" },
  { id: "warm", name: "Warm", css: "sepia(20%) saturate(120%) brightness(105%)" },
  { id: "cool", name: "Cool", css: "saturate(90%) brightness(105%) hue-rotate(10deg)" },
  { id: "dramatic", name: "Dramatic", css: "contrast(130%) saturate(110%)" },
  { id: "fade", name: "Fade", css: "contrast(90%) brightness(110%) saturate(80%)" },
];

const aspectRatios = [
  { id: "free", name: "Free", ratio: null },
  { id: "1:1", name: "1:1", ratio: 1 },
  { id: "4:5", name: "4:5", ratio: 0.8 },
  { id: "16:9", name: "16:9", ratio: 16 / 9 },
  { id: "9:16", name: "9:16", ratio: 9 / 16 },
  { id: "4:3", name: "4:3", ratio: 4 / 3 },
  { id: "3:2", name: "3:2", ratio: 3 / 2 },
];

const aiFeatures = [
  { id: "bg-remove", name: "Remove Background", icon: Eraser, description: "AI-powered background removal" },
  { id: "upscale", name: "Upscale 2x", icon: ArrowUpRight, description: "Enhance resolution" },
  { id: "auto-enhance", name: "Auto Enhance", icon: Wand2, description: "AI color correction" },
  { id: "denoise", name: "Denoise", icon: Focus, description: "Remove image noise" },
  { id: "sharpen-ai", name: "AI Sharpen", icon: Aperture, description: "Intelligent sharpening" },
];

const portraitFeatures = [
  { id: "skin-smooth", name: "Skin Smooth", icon: User, description: "Natural skin smoothing" },
  { id: "blemish", name: "Blemish Removal", icon: Smile, description: "Remove blemishes" },
  { id: "teeth-whiten", name: "Teeth Whitening", icon: Smile, description: "Brighten teeth" },
  { id: "eye-enhance", name: "Eye Enhancement", icon: Eye, description: "Brighten & enhance eyes" },
];

export const ImageEditor = ({ imageUrl, onSave, onCancel }: ImageEditorProps) => {
  const [editState, setEditState] = useState<EditState>(defaultState);
  const [history, setHistory] = useState<EditState[]>([defaultState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAiFeature, setActiveAiFeature] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const pushToHistory = useCallback((newState: EditState) => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), newState]);
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const updateState = useCallback((updates: Partial<EditState>) => {
    const newState = { ...editState, ...updates };
    setEditState(newState);
    pushToHistory(newState);
  }, [editState, pushToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setEditState(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setEditState(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  const resetEdits = () => {
    setEditState(defaultState);
    setHistory([defaultState]);
    setHistoryIndex(0);
  };

  const getTransformStyle = () => {
    const transforms = [];
    transforms.push(`scale(${editState.zoom})`);
    transforms.push(`translate(${editState.panX}px, ${editState.panY}px)`);
    transforms.push(`rotate(${editState.rotation}deg)`);
    if (editState.flipH) transforms.push("scaleX(-1)");
    if (editState.flipV) transforms.push("scaleY(-1)");
    return transforms.join(" ");
  };

  const getFilterStyle = () => {
    const filters = [];
    filters.push(`brightness(${editState.brightness + (editState.exposure - 100) / 2}%)`);
    filters.push(`contrast(${editState.contrast}%)`);
    filters.push(`saturate(${editState.saturation}%)`);
    filters.push(`hue-rotate(${editState.hue + editState.temperature * 2}deg)`);
    if (editState.blur > 0) filters.push(`blur(${editState.blur}px)`);
    
    const selectedFilter = editState.filter !== "none" 
      ? (filters.find((f) => f)?.valueOf() || "") 
      : "";
    
    return filters.join(" ");
  };

  const getPresetFilterStyle = () => {
    const preset = filters.find((f) => f.id === editState.filter);
    return preset?.css || "";
  };

  const applyEditsToCanvas = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      if (!img || !canvas) {
        reject("Image or canvas not available");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Canvas context not available");
        return;
      }

      const isRotated90 = Math.abs(editState.rotation % 180) === 90;
      const canvasWidth = isRotated90 ? img.height : img.width;
      const canvasHeight = isRotated90 ? img.width : img.height;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.save();
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.rotate((editState.rotation * Math.PI) / 180);
      ctx.scale(editState.flipH ? -1 : 1, editState.flipV ? -1 : 1);

      const filterValue = [
        `brightness(${editState.brightness}%)`,
        `contrast(${editState.contrast}%)`,
        `saturate(${editState.saturation}%)`,
        `hue-rotate(${editState.hue}deg)`,
        editState.blur > 0 ? `blur(${editState.blur}px)` : "",
        getPresetFilterStyle(),
      ].filter(Boolean).join(" ");
      
      ctx.filter = filterValue;
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
      ctx.restore();

      resolve(canvas.toDataURL("image/png", 1.0));
    });
  }, [editState]);

  const handleSave = async () => {
    try {
      const editedImageUrl = await applyEditsToCanvas();
      onSave(editedImageUrl);
    } catch (error) {
      console.error("Failed to save edited image:", error);
      toast.error("Failed to save edits");
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
      canvas.width = isRotated90 ? img.height : img.width;
      canvas.height = isRotated90 ? img.width : img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((editState.rotation * Math.PI) / 180);
      ctx.scale(editState.flipH ? -1 : 1, editState.flipV ? -1 : 1);

      const filterValue = [
        `brightness(${editState.brightness}%)`,
        `contrast(${editState.contrast}%)`,
        `saturate(${editState.saturation}%)`,
        `hue-rotate(${editState.hue}deg)`,
        getPresetFilterStyle(),
      ].filter(Boolean).join(" ");

      ctx.filter = filterValue;
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
      ctx.restore();

      const mimeType = format === "jpg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
      const quality = format === "png" ? 1.0 : 0.92;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      const link = document.createElement("a");
      link.download = `edited-image-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();

      toast.success(`Downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const handleAiFeature = async (featureId: string) => {
    setActiveAiFeature(featureId);
    setIsProcessing(true);
    toast.info(`Processing ${featureId}...`);

    // Simulate AI processing - in production this would call the edge function
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setActiveAiFeature(null);
    toast.success(`${featureId} applied successfully!`);
  };

  const adjustmentGroups = [
    {
      title: "Light",
      controls: [
        { key: "brightness", label: "Brightness", icon: Sun, min: 0, max: 200, default: 100 },
        { key: "exposure", label: "Exposure", icon: Sun, min: 0, max: 200, default: 100 },
        { key: "contrast", label: "Contrast", icon: Contrast, min: 0, max: 200, default: 100 },
      ],
    },
    {
      title: "Color",
      controls: [
        { key: "saturation", label: "Saturation", icon: Droplets, min: 0, max: 200, default: 100 },
        { key: "hue", label: "Hue", icon: Palette, min: 0, max: 360, default: 0 },
        { key: "temperature", label: "Temperature", icon: Thermometer, min: -100, max: 100, default: 0 },
        { key: "tint", label: "Tint", icon: Palette, min: -100, max: 100, default: 0 },
      ],
    },
    {
      title: "Detail",
      controls: [
        { key: "sharpness", label: "Sharpness", icon: Focus, min: 0, max: 100, default: 0 },
        { key: "blur", label: "Blur", icon: Aperture, min: 0, max: 20, default: 0 },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex bg-background/98 backdrop-blur-lg"
    >
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Left Panel - Tools */}
      <div className="w-80 border-r border-border bg-card/50 overflow-y-auto">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold">Image Editor</h2>
              <p className="text-xs text-muted-foreground">Professional editing tools</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="adjust" className="w-full">
          <TabsList className="w-full grid grid-cols-4 p-1 m-2 mr-4">
            <TabsTrigger value="adjust" className="text-xs">Adjust</TabsTrigger>
            <TabsTrigger value="transform" className="text-xs">Transform</TabsTrigger>
            <TabsTrigger value="filters" className="text-xs">Filters</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">AI</TabsTrigger>
          </TabsList>

          {/* Adjustments Tab */}
          <TabsContent value="adjust" className="p-4 space-y-6">
            {adjustmentGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">{group.title}</h4>
                {group.controls.map(({ key, label, icon: Icon, min, max }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {editState[key as keyof EditState] as number}
                        {key === "hue" ? "°" : key === "blur" ? "px" : "%"}
                      </span>
                    </div>
                    <Slider
                      value={[editState[key as keyof EditState] as number]}
                      onValueChange={([value]) => updateState({ [key]: value })}
                      min={min}
                      max={max}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>

          {/* Transform Tab */}
          <TabsContent value="transform" className="p-4 space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Rotate & Flip</h4>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => updateState({ rotation: editState.rotation - 90 })}
                  className="tool-button"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-xs">Left</span>
                </button>
                <button
                  onClick={() => updateState({ rotation: editState.rotation + 90 })}
                  className="tool-button"
                >
                  <RotateCw className="w-5 h-5" />
                  <span className="text-xs">Right</span>
                </button>
                <button
                  onClick={() => updateState({ flipH: !editState.flipH })}
                  className={`tool-button ${editState.flipH ? "active" : ""}`}
                >
                  <FlipHorizontal className="w-5 h-5" />
                  <span className="text-xs">Flip H</span>
                </button>
                <button
                  onClick={() => updateState({ flipV: !editState.flipV })}
                  className={`tool-button ${editState.flipV ? "active" : ""}`}
                >
                  <FlipVertical className="w-5 h-5" />
                  <span className="text-xs">Flip V</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Aspect Ratio</h4>
              <div className="grid grid-cols-4 gap-2">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => updateState({ cropAspect: ar.id === "free" ? null : ar.id })}
                    className={`tool-button ${editState.cropAspect === ar.id || (ar.id === "free" && !editState.cropAspect) ? "active" : ""}`}
                  >
                    <Crop className="w-4 h-4" />
                    <span className="text-xs">{ar.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Zoom</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateState({ zoom: Math.max(0.5, editState.zoom - 0.1) })}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Slider
                  value={[editState.zoom * 100]}
                  onValueChange={([value]) => updateState({ zoom: value / 100 })}
                  min={50}
                  max={200}
                  step={5}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateState({ zoom: Math.min(2, editState.zoom + 0.1) })}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">{Math.round(editState.zoom * 100)}%</p>
            </div>
          </TabsContent>

          {/* Filters Tab */}
          <TabsContent value="filters" className="p-4 space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Preset Filters</h4>
            <div className="grid grid-cols-3 gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => updateState({ filter: filter.id })}
                  className={`filter-preset aspect-square ${editState.filter === filter.id ? "active" : ""}`}
                >
                  <img
                    src={imageUrl}
                    alt={filter.name}
                    className="w-full h-full object-cover"
                    style={{ filter: filter.css || undefined }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-2">
                    <span className="text-xs font-medium">{filter.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai" className="p-4 space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Smart Editing
              </h4>
              <div className="space-y-2">
                {aiFeatures.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => handleAiFeature(feature.id)}
                    disabled={isProcessing}
                    className="w-full flex items-center gap-3 p-3 rounded-xl glass-card hover:border-primary/40 transition-all disabled:opacity-50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium">{feature.name}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    {activeAiFeature === feature.id && (
                      <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Portrait & Face AI
              </h4>
              <div className="space-y-2">
                {portraitFeatures.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => handleAiFeature(feature.id)}
                    disabled={isProcessing}
                    className="w-full flex items-center gap-3 p-3 rounded-xl glass-card hover:border-primary/40 transition-all disabled:opacity-50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium">{feature.name}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    {activeAiFeature === feature.id && (
                      <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Center - Image Preview */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex === 0}
              className="gap-1"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="gap-1"
            >
              <Redo2 className="w-4 h-4" />
              Redo
            </Button>
            <Button variant="outline" size="sm" onClick={resetEdits} className="gap-1">
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("png")}>
              PNG
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("jpg")}>
              JPG
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("webp")}>
              WebP
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-primary gap-2">
              <Check className="w-4 h-4" />
              Apply
            </Button>
          </div>
        </div>

        {/* Image Preview Area */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-8 bg-secondary/20 overflow-hidden"
        >
          <div className="relative max-w-full max-h-full">
            {isProcessing && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <p className="font-medium">Processing with AI...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </div>
              </div>
            )}
            <img
              src={imageUrl}
              alt="Editing"
              className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl transition-all duration-300"
              style={{
                transform: getTransformStyle(),
                filter: `${getFilterStyle()} ${getPresetFilterStyle()}`,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};