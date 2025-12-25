export const addWatermark = (
  imageUrl: string,
  watermarkText: string = "AI ImageGen"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject("Canvas context not available");
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Calculate watermark dimensions
      const minDimension = Math.min(img.width, img.height);
      const fontSize = Math.max(16, Math.floor(minDimension / 25));
      const padding = Math.floor(fontSize * 0.8);

      // Set font style
      ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;
      
      // Measure text
      const textMetrics = ctx.measureText(watermarkText);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;

      // Position for bottom-right corner
      const x = img.width - textWidth - padding * 2;
      const y = img.height - padding * 1.5;

      // Draw semi-transparent background
      const bgPadding = padding * 0.5;
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.roundRect(
        x - bgPadding,
        y - textHeight - bgPadding,
        textWidth + bgPadding * 2,
        textHeight + bgPadding * 2,
        8
      );
      ctx.fill();

      // Draw text with gradient effect
      const gradient = ctx.createLinearGradient(x, 0, x + textWidth, 0);
      gradient.addColorStop(0, "#a855f7");
      gradient.addColorStop(0.5, "#ec4899");
      gradient.addColorStop(1, "#a855f7");
      
      ctx.fillStyle = gradient;
      ctx.fillText(watermarkText, x, y);

      // Add subtle border/glow effect
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.strokeText(watermarkText, x, y);

      resolve(canvas.toDataURL("image/png", 1.0));
    };

    img.onerror = () => {
      reject("Failed to load image");
    };

    img.src = imageUrl;
  });
};
