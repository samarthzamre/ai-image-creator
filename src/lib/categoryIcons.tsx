import {
  Baby,
  User,
  Users,
  PartyPopper,
  Palette,
  Wand2,
  Sparkles,
  Crown,
  Briefcase,
  Mountain,
  Dumbbell,
  Paintbrush,
  Camera,
  Heart,
  Star,
  Zap,
  Ghost,
  type LucideIcon,
} from "lucide-react";

// Map category IDs to Lucide icons
export const categoryIconMap: Record<string, LucideIcon> = {
  girls: Baby,
  boys: User,
  women: Crown,
  men: Briefcase,
  festivals: PartyPopper,
  family: Users,
  anime: Palette,
  fantasy: Wand2,
};

// Get icon component for a category
export const getCategoryIcon = (categoryId: string): LucideIcon => {
  return categoryIconMap[categoryId] || Sparkles;
};

// Default gradient colors for categories
export const categoryColors: Record<string, string> = {
  girls: "from-rose-500 to-pink-500",
  boys: "from-blue-500 to-indigo-500",
  women: "from-purple-500 to-violet-500",
  men: "from-slate-600 to-gray-700",
  festivals: "from-amber-500 to-orange-500",
  family: "from-teal-500 to-emerald-500",
  anime: "from-pink-500 to-cyan-400",
  fantasy: "from-violet-600 to-purple-500",
};
