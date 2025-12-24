export interface Subcategory {
  id: string;
  name: string;
  description: string;
  prompt: string; // Hidden prompt for AI generation
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    id: "girls",
    name: "Girls",
    description: "Beautiful portrait styles for girls",
    icon: "👧",
    color: "from-pink-500 to-rose-500",
    subcategories: [
      {
        id: "princess",
        name: "Princess Style",
        description: "Elegant princess-themed portraits",
        prompt: "Transform this photo into an elegant princess portrait with soft lighting, royal attire elements, and a magical fairy-tale atmosphere. Keep the subject's face recognizable while enhancing with subtle sparkles and ethereal glow.",
      },
      {
        id: "fairy",
        name: "Fairy Tale",
        description: "Magical fairy-themed images",
        prompt: "Create a magical fairy-themed portrait with delicate wings, enchanted forest background, and whimsical lighting. Maintain facial features while adding ethereal elements.",
      },
      {
        id: "modern",
        name: "Modern Portrait",
        description: "Contemporary stylish portraits",
        prompt: "Create a modern, stylish portrait with contemporary fashion elements, professional lighting, and a clean aesthetic. Keep the subject recognizable with enhanced features.",
      },
    ],
  },
  {
    id: "boys",
    name: "Boys",
    description: "Cool portrait styles for boys",
    icon: "👦",
    color: "from-blue-500 to-indigo-500",
    subcategories: [
      {
        id: "superhero",
        name: "Superhero Style",
        description: "Action-packed superhero portraits",
        prompt: "Transform this photo into a dynamic superhero portrait with heroic pose elements, dramatic lighting, and powerful energy effects. Keep the subject recognizable while adding superhero costume elements.",
      },
      {
        id: "sports",
        name: "Sports Star",
        description: "Athletic sports-themed images",
        prompt: "Create a sports star portrait with athletic energy, stadium atmosphere, and dynamic action elements. Maintain facial features while adding professional sports styling.",
      },
      {
        id: "adventure",
        name: "Adventure Theme",
        description: "Explorer and adventure style",
        prompt: "Create an adventure-themed portrait with explorer elements, natural outdoor settings, and adventurous atmosphere. Keep the subject recognizable with adventure gear styling.",
      },
    ],
  },
  {
    id: "women",
    name: "Women",
    description: "Elegant portrait styles for women",
    icon: "👩",
    color: "from-purple-500 to-violet-500",
    subcategories: [
      {
        id: "professional",
        name: "Professional",
        description: "Corporate and business portraits",
        prompt: "Create a professional business portrait with elegant corporate styling, studio lighting, and confident atmosphere. Keep the subject recognizable with refined professional appearance.",
      },
      {
        id: "glamour",
        name: "Glamour Style",
        description: "High-fashion glamour portraits",
        prompt: "Transform into a high-fashion glamour portrait with sophisticated styling, professional beauty lighting, and magazine-quality finish. Maintain facial features with enhanced glamour elements.",
      },
      {
        id: "traditional",
        name: "Traditional",
        description: "Cultural and traditional styles",
        prompt: "Create a beautiful traditional portrait with elegant cultural styling, warm lighting, and graceful atmosphere. Keep the subject recognizable with traditional attire elements.",
      },
    ],
  },
  {
    id: "festivals",
    name: "Festivals",
    description: "Festive celebration themes",
    icon: "🎉",
    color: "from-amber-500 to-orange-500",
    subcategories: [
      {
        id: "diwali",
        name: "Diwali",
        description: "Festival of Lights celebration",
        prompt: "Transform this photo into a beautiful Diwali celebration portrait with warm golden lighting, diya lamps, rangoli elements, and festive Indian traditional attire. Add sparklers and fireworks in the background while keeping the subject clearly recognizable.",
      },
      {
        id: "dussehra",
        name: "Dussehra",
        description: "Victory celebration theme",
        prompt: "Create a Dussehra festival portrait with vibrant celebration elements, traditional decorations, and the spirit of victory over evil. Include festival elements while maintaining the subject's recognizable features.",
      },
      {
        id: "sankranti",
        name: "Sankranti",
        description: "Harvest festival celebration",
        prompt: "Create a Makar Sankranti celebration portrait with colorful kites, traditional attire, and harvest festival atmosphere. Add festive elements while keeping the subject clearly recognizable.",
      },
      {
        id: "holi",
        name: "Holi",
        description: "Festival of Colors",
        prompt: "Transform into a vibrant Holi celebration portrait with colorful powder splashes, joyful atmosphere, and festive energy. Add bright colors artistically while maintaining the subject's recognizable features.",
      },
      {
        id: "christmas",
        name: "Christmas",
        description: "Christmas celebration theme",
        prompt: "Create a magical Christmas portrait with festive decorations, warm holiday lighting, snow elements, and Christmas cheer. Add Santa hat or winter elements while keeping the subject recognizable.",
      },
    ],
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((cat) => cat.id === id);
};

export const getSubcategoryById = (
  categoryId: string,
  subcategoryId: string
): Subcategory | undefined => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find((sub) => sub.id === subcategoryId);
};

export const findSubcategoryAcrossCategories = (
  subcategoryId: string
): { category: Category; subcategory: Subcategory } | undefined => {
  for (const category of categories) {
    const subcategory = category.subcategories.find(
      (sub) => sub.id === subcategoryId
    );
    if (subcategory) {
      return { category, subcategory };
    }
  }
  return undefined;
};
