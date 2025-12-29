import { useState, useEffect, useCallback } from "react";
import { categories as defaultCategories, Category, Subcategory, SampleImage } from "./categories";

const STORAGE_KEY = "admin-categories";

export interface AdminCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  coverImage?: string;
  subcategories: AdminSubcategory[];
}

export interface AdminSubcategory {
  id: string;
  name: string;
  description: string;
  prompt: string;
  sampleImages: AdminSampleImage[];
}

export interface AdminSampleImage {
  id: string;
  url: string;
  alt: string;
}

// Convert admin categories to the Category format used in the app
const convertToAppFormat = (adminCats: AdminCategory[]): Category[] => {
  return adminCats.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    icon: cat.icon,
    color: cat.color,
    subcategories: cat.subcategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      prompt: sub.prompt,
      sampleImages: sub.sampleImages.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
      })),
    })),
  }));
};

// Hook to get merged categories (default + admin-added)
export const useCategories = () => {
  const [adminCategories, setAdminCategories] = useState<AdminCategory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load admin categories from localStorage
  const loadAdminCategories = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAdminCategories(parsed);
      }
    } catch (error) {
      console.error("Failed to load admin categories:", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadAdminCategories();

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadAdminCategories();
      }
    };

    // Custom event for same-tab sync
    const handleCustomUpdate = () => {
      loadAdminCategories();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("admin-categories-updated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("admin-categories-updated", handleCustomUpdate);
    };
  }, [loadAdminCategories]);

  // Merge default categories with admin-added categories
  const allCategories: Category[] = [
    ...defaultCategories,
    ...convertToAppFormat(adminCategories),
  ];

  // Get category by ID (check both default and admin)
  const getCategoryById = (id: string): Category | undefined => {
    return allCategories.find((cat) => cat.id === id);
  };

  // Get subcategory by ID
  const getSubcategoryById = (categoryId: string, subcategoryId: string): Subcategory | undefined => {
    const category = getCategoryById(categoryId);
    return category?.subcategories.find((sub) => sub.id === subcategoryId);
  };

  // Find subcategory across all categories
  const findSubcategoryAcrossCategories = (subcategoryId: string): { category: Category; subcategory: Subcategory } | undefined => {
    for (const category of allCategories) {
      const subcategory = category.subcategories.find((sub) => sub.id === subcategoryId);
      if (subcategory) {
        return { category, subcategory };
      }
    }
    return undefined;
  };

  return {
    categories: allCategories,
    adminCategories,
    defaultCategories,
    isLoaded,
    getCategoryById,
    getSubcategoryById,
    findSubcategoryAcrossCategories,
    refresh: loadAdminCategories,
  };
};

// Helper to save admin categories and notify listeners
export const saveAdminCategories = (categories: AdminCategory[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new CustomEvent("admin-categories-updated"));
};

// Helper to get admin categories directly (for non-hook contexts)
export const getAdminCategories = (): AdminCategory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load admin categories:", error);
  }
  return [];
};