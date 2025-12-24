export interface GeneratedImage {
  id: string;
  originalImage: string;
  generatedImage: string;
  categoryId: string;
  subcategoryId: string;
  categoryName: string;
  subcategoryName: string;
  createdAt: number;
}

const STORAGE_KEY = "ai-imagegen-history";
const EXPIRY_HOURS = 24;

export const saveToHistory = (image: Omit<GeneratedImage, "id" | "createdAt">): GeneratedImage => {
  const history = getHistory();
  const newImage: GeneratedImage = {
    ...image,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  
  history.unshift(newImage);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  
  return newImage;
};

export const getHistory = (): GeneratedImage[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const history: GeneratedImage[] = JSON.parse(stored);
    const now = Date.now();
    const expiryMs = EXPIRY_HOURS * 60 * 60 * 1000;
    
    // Filter out expired images
    const validHistory = history.filter((img) => now - img.createdAt < expiryMs);
    
    // Update storage if some were expired
    if (validHistory.length !== history.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validHistory));
    }
    
    return validHistory;
  } catch {
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const removeFromHistory = (id: string): void => {
  const history = getHistory();
  const filtered = history.filter((img) => img.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const downloadImage = async (
  imageUrl: string,
  filename: string,
  format: "png" | "jpg" | "jpeg" = "png"
): Promise<void> => {
  try {
    // If it's a base64 image, convert format
    if (imageUrl.startsWith("data:image")) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${filename}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    // For URL-based images, fetch and convert
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
};
