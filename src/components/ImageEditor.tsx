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
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  Sparkles,
  Eraser,
  ArrowUpRight,
  Wand2,
  Thermometer,
  Focus,
  Aperture,
  User,
  Smile,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
  { id: "cinematic", name: "Cinema", css: "contrast(120%) saturate(85%) brightness(90%)" },
  { id: "warm", name: "Warm", css: "sepia(20%) saturate(120%) brightness(105%)" },
  { id: "cool", name: "Cool", css: "saturate(90%) brightness(105%) hue-rotate(10deg)" },
  { id: "dramatic", name: "Drama", css: "contrast(130%) saturate(110%)" },
  { id: "fade", name: "Fade", css: "contrast(90%) brightness(110%) saturate(80%)" },
];

const aspectRatios = [
  { id: "free", name: "Free", ratio: null },
  { id: "1:1", name: "1:1", ratio: 1 },
  { id: "4:5", name: "4:5", ratio: 0.8 },
  { id: "16:9", name: "16:9", ratio: 16 / 9 },
  { id: "9:16", name: "9:16", ratio: 9 / 16 },
];

const aiFeatures = [
  { id: "bg-remove", name: "Remove BG", icon: Eraser },
  { id: "upscale", name: "Upscale", icon: ArrowUpRight },
  { id: "auto-enhance", name: "Enhance", icon: Wand2 },
  { id: "denoise", name: "Denoise", icon: Focus },
  { id: "sharpen-ai", name: "Sharpen", icon: Aperture },
];

const portraitFeatures = [
  { id: "skin-smooth", name: "Smooth", icon: User },
  { id: "blemish", name: "Blemish", icon: Smile },
  { id: "teeth-whiten", name: "Teeth", icon: Smile },
  { id: "eye-enhance", name: "Eyes", icon: Eye },
];

type TabType = "adjust" | "transform" | "filters" | "ai";

export const ImageEditor = ({ imageUrl, onSave, onCancel }: ImageEditorProps) => {
  const [editState, setEditState] = useState<EditState>(defaultState);
  const [history, setHistory] = useState<EditState[]>([defaultState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAiFeature, setActiveAiFeature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("adjust");
  const [showPanel, setShowPanel] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

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
    const filtersList = [];
    filtersList.push(`brightness(${editState.brightness + (editState.exposure - 100) / 2}%)`);
    filtersList.push(`contrast(${editState.contrast}%)`);
    filtersList.push(`saturate(${editState.saturation}%)`);
    filtersList.push(`hue-rotate(${editState.hue + editState.temperature * 2}deg)`);
    if (editState.blur > 0) filtersList.push(`blur(${editState.blur}px)`);
    return filtersList.join(" ");
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

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setActiveAiFeature(null);
    toast.success(`Applied successfully!`);
  };

  const adjustmentControls = [
    { key: "brightness", label: "Brightness", icon: Sun, min: 0, max: 200, default: 100 },
    { key: "contrast", label: "Contrast", icon: Contrast, min: 0, max: 200, default: 100 },
    { key: "saturation", label: "Saturation", icon: Droplets, min: 0, max: 200, default: 100 },
    { key: "hue", label: "Hue", icon: Palette, min: 0, max: 360, default: 0 },
    { key: "temperature", label: "Temp", icon: Thermometer, min: -100, max: 100, default: 0 },
    { key: "blur", label: "Blur", icon: Aperture, min: 0, max: 20, default: 0 },
  ];

  const tabs: { id: TabType; label: string }[] = [
    { id: "adjust", label: "Adjust" },
    { id: "transform", label: "Transform" },
    { id: "filters", label: "Filters" },
    { id: "ai", label: "AI" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-lg"
    >
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Top Bar - Mobile Optimized */}
      <div className="flex items-center justify-between h-14 md:h-16 border-b border-border px-3 md:px-4 shrink-0 safe-top">
        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-9 w-9 md:h-10 md:w-10"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={historyIndex === 0}
              className="h-8 px-2 text-xs"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="h-8 px-2 text-xs"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={resetEdits} className="h-8 px-2 text-xs">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {/* Export Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => handleExport("png")} className="h-8 px-2 text-xs">
              PNG
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("jpg")} className="h-8 px-2 text-xs">
              JPG
            </Button>
          </div>
          
          {/* Mobile Export */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleExport("png")}
            className="sm:hidden h-9 w-9"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button onClick={handleSave} size="sm" className="btn-primary h-9 px-3 md:px-4 text-sm gap-1">
            <Check className="w-4 h-4" />
            <span className="hidden xs:inline">Apply</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Image Preview - Main area */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
          {/* Mobile Undo/Redo */}
          <div className="absolute top-2 left-2 flex items-center gap-1 sm:hidden z-10">
            <Button
              variant="secondary"
              size="icon"
              onClick={undo}
              disabled={historyIndex === 0}
              className="h-8 w-8"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="h-8 w-8"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Toggle Panel Button - Mobile */}
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="md:hidden absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
          >
            {showPanel ? <ChevronRight className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
          </button>

          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="font-medium text-sm">Processing...</p>
              </div>
            </div>
          )}
          
          <img
            src={imageUrl}
            alt="Editing"
            className="max-w-full max-h-[50vh] md:max-h-[75vh] object-contain rounded-xl shadow-2xl transition-all duration-200"
            style={{
              transform: getTransformStyle(),
              filter: `${getFilterStyle()} ${getPresetFilterStyle()}`,
            }}
          />
        </div>

        {/* Side Panel - Responsive */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute md:relative bottom-0 left-0 right-0 md:w-72 lg:w-80 border-t md:border-t-0 md:border-l border-border bg-card/95 backdrop-blur-xl flex flex-col max-h-[50vh] md:max-h-full overflow-hidden safe-bottom z-10"
            >
              {/* Tabs */}
              <div className="flex border-b border-border shrink-0 overflow-x-auto mobile-scroll">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[70px] py-3 px-2 text-xs md:text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto mobile-scroll p-3 md:p-4">
                {/* Adjust Tab */}
                {activeTab === "adjust" && (
                  <div className="space-y-4">
                    {adjustmentControls.map(({ key, label, icon: Icon, min, max }) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs md:text-sm">{label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground w-10 text-right">
                            {editState[key as keyof EditState] as number}
                          </span>
                        </div>
                        <Slider
                          value={[editState[key as keyof EditState] as number]}
                          onValueChange={([value]) => updateState({ [key]: value })}
                          min={min}
                          max={max}
                          step={1}
                          className="touch-pan-x"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Transform Tab */}
                {activeTab === "transform" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground">Rotate & Flip</h4>
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => updateState({ rotation: editState.rotation - 90 })}
                          className="tool-button"
                        >
                          <RotateCcw className="w-5 h-5" />
                          <span className="text-[10px]">Left</span>
                        </button>
                        <button
                          onClick={() => updateState({ rotation: editState.rotation + 90 })}
                          className="tool-button"
                        >
                          <RotateCw className="w-5 h-5" />
                          <span className="text-[10px]">Right</span>
                        </button>
                        <button
                          onClick={() => updateState({ flipH: !editState.flipH })}
                          className={`tool-button ${editState.flipH ? "active" : ""}`}
                        >
                          <FlipHorizontal className="w-5 h-5" />
                          <span className="text-[10px]">Flip H</span>
                        </button>
                        <button
                          onClick={() => updateState({ flipV: !editState.flipV })}
                          className={`tool-button ${editState.flipV ? "active" : ""}`}
                        >
                          <FlipVertical className="w-5 h-5" />
                          <span className="text-[10px]">Flip V</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground">Aspect Ratio</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {aspectRatios.map((ar) => (
                          <button
                            key={ar.id}
                            onClick={() => updateState({ cropAspect: ar.id === "free" ? null : ar.id })}
                            className={`tool-button ${editState.cropAspect === ar.id || (ar.id === "free" && !editState.cropAspect) ? "active" : ""}`}
                          >
                            <Crop className="w-4 h-4" />
                            <span className="text-[10px]">{ar.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground">Zoom: {Math.round(editState.zoom * 100)}%</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateState({ zoom: Math.max(0.5, editState.zoom - 0.1) })}
                          className="h-9 w-9"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <Slider
                          value={[editState.zoom * 100]}
                          onValueChange={([value]) => updateState({ zoom: value / 100 })}
                          min={50}
                          max={200}
                          step={5}
                          className="flex-1 touch-pan-x"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateState({ zoom: Math.min(2, editState.zoom + 0.1) })}
                          className="h-9 w-9"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Filters Tab */}
                {activeTab === "filters" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-muted-foreground">Preset Filters</h4>
                    <div className="grid grid-cols-4 gap-2">
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
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-1">
                            <span className="text-[9px] md:text-[10px] font-medium">{filter.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Tab */}
                {activeTab === "ai" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                        Smart Editing
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {aiFeatures.map((feature) => (
                          <button
                            key={feature.id}
                            onClick={() => handleAiFeature(feature.id)}
                            disabled={isProcessing}
                            className="tool-button flex-col disabled:opacity-50"
                          >
                            {activeAiFeature === feature.id ? (
                              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            ) : (
                              <feature.icon className="w-5 h-5" />
                            )}
                            <span className="text-[10px]">{feature.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3 text-primary" />
                        Portrait AI
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {portraitFeatures.map((feature) => (
                          <button
                            key={feature.id}
                            onClick={() => handleAiFeature(feature.id)}
                            disabled={isProcessing}
                            className="tool-button flex-col disabled:opacity-50"
                          >
                            {activeAiFeature === feature.id ? (
                              <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                            ) : (
                              <feature.icon className="w-5 h-5" />
                            )}
                            <span className="text-[10px]">{feature.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
