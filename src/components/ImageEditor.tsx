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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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
}

const defaultState: EditState = {
  rotation: 0,
  flipH: false,
  flipV: false,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
};

export const ImageEditor = ({ imageUrl, onSave, onCancel }: ImageEditorProps) => {
  const [editState, setEditState] = useState<EditState>(defaultState);
  const [activeTab, setActiveTab] = useState<"transform" | "adjust">("transform");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load image on mount
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const getTransformStyle = () => {
    const transforms = [];
    transforms.push(`rotate(${editState.rotation}deg)`);
    if (editState.flipH) transforms.push("scaleX(-1)");
    if (editState.flipV) transforms.push("scaleY(-1)");
    return transforms.join(" ");
  };

  const getFilterStyle = () => {
    return `
      brightness(${editState.brightness}%) 
      contrast(${editState.contrast}%) 
      saturate(${editState.saturation}%) 
      hue-rotate(${editState.hue}deg)
    `;
  };

  const rotate = (direction: "cw" | "ccw") => {
    setEditState((prev) => ({
      ...prev,
      rotation: prev.rotation + (direction === "cw" ? 90 : -90),
    }));
  };

  const flip = (direction: "h" | "v") => {
    setEditState((prev) => ({
      ...prev,
      flipH: direction === "h" ? !prev.flipH : prev.flipH,
      flipV: direction === "v" ? !prev.flipV : prev.flipV,
    }));
  };

  const resetEdits = () => {
    setEditState(defaultState);
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

      // Calculate canvas size based on rotation
      const isRotated90 = Math.abs(editState.rotation % 180) === 90;
      const canvasWidth = isRotated90 ? img.height : img.width;
      const canvasHeight = isRotated90 ? img.width : img.height;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Apply transformations
      ctx.save();
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.rotate((editState.rotation * Math.PI) / 180);
      ctx.scale(editState.flipH ? -1 : 1, editState.flipV ? -1 : 1);

      // Apply filters
      ctx.filter = `brightness(${editState.brightness}%) contrast(${editState.contrast}%) saturate(${editState.saturation}%) hue-rotate(${editState.hue}deg)`;

      // Draw image centered
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
      ctx.restore();

      // Get the edited image as data URL
      resolve(canvas.toDataURL("image/png", 1.0));
    });
  }, [editState]);

  const handleSave = async () => {
    try {
      const editedImageUrl = await applyEditsToCanvas();
      onSave(editedImageUrl);
    } catch (error) {
      console.error("Failed to save edited image:", error);
    }
  };

  const adjustmentControls = [
    { key: "brightness", label: "Brightness", icon: Sun, min: 0, max: 200 },
    { key: "contrast", label: "Contrast", icon: Contrast, min: 0, max: 200 },
    { key: "saturation", label: "Saturation", icon: Droplets, min: 0, max: 200 },
    { key: "hue", label: "Hue", icon: Palette, min: 0, max: 360 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-lg"
    >
      <div className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="glass-card p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg">Edit Image</h2>
                <p className="text-sm text-muted-foreground">Adjust your image before saving</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Image Preview */}
          <div className="aspect-video bg-secondary/30 rounded-xl overflow-hidden flex items-center justify-center p-4">
            <img
              src={imageUrl}
              alt="Editing"
              className="max-w-full max-h-full object-contain rounded-lg transition-all duration-300"
              style={{
                transform: getTransformStyle(),
                filter: getFilterStyle(),
              }}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === "transform" ? "default" : "outline"}
              onClick={() => setActiveTab("transform")}
              className="flex-1"
            >
              Transform
            </Button>
            <Button
              variant={activeTab === "adjust" ? "default" : "outline"}
              onClick={() => setActiveTab("adjust")}
              className="flex-1"
            >
              Adjustments
            </Button>
          </div>

          {/* Controls */}
          <AnimatePresence mode="wait">
            {activeTab === "transform" ? (
              <motion.div
                key="transform"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-4 gap-3"
              >
                <Button
                  variant="outline"
                  onClick={() => rotate("ccw")}
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-xs">Rotate Left</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => rotate("cw")}
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  <RotateCw className="w-5 h-5" />
                  <span className="text-xs">Rotate Right</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => flip("h")}
                  className={`flex flex-col gap-1 h-auto py-3 ${editState.flipH ? "border-primary bg-primary/10" : ""}`}
                >
                  <FlipHorizontal className="w-5 h-5" />
                  <span className="text-xs">Flip H</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => flip("v")}
                  className={`flex flex-col gap-1 h-auto py-3 ${editState.flipV ? "border-primary bg-primary/10" : ""}`}
                >
                  <FlipVertical className="w-5 h-5" />
                  <span className="text-xs">Flip V</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="adjust"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {adjustmentControls.map(({ key, label, icon: Icon, min, max }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {editState[key as keyof EditState]}
                        {key === "hue" ? "°" : "%"}
                      </span>
                    </div>
                    <Slider
                      value={[editState[key as keyof EditState] as number]}
                      onValueChange={([value]) =>
                        setEditState((prev) => ({ ...prev, [key]: value }))
                      }
                      min={min}
                      max={max}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={resetEdits} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-primary flex-1 gap-2">
              <Check className="w-4 h-4" />
              Apply Changes
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
