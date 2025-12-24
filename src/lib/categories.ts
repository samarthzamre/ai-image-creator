// Sample images imports
import diwali1 from "@/assets/samples/diwali-1.jpg";
import diwali2 from "@/assets/samples/diwali-2.jpg";
import diwali3 from "@/assets/samples/diwali-3.jpg";
import holi1 from "@/assets/samples/holi-1.jpg";
import christmas1 from "@/assets/samples/christmas-1.jpg";
import princess1 from "@/assets/samples/princess-1.jpg";
import fairy1 from "@/assets/samples/fairy-1.jpg";
import superhero1 from "@/assets/samples/superhero-1.jpg";
import sports1 from "@/assets/samples/sports-1.jpg";
import professional1 from "@/assets/samples/professional-1.jpg";

export interface SampleImage {
  id: string;
  url: string;
  alt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  prompt: string; // Hidden prompt for AI generation
  sampleImages: SampleImage[];
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
        sampleImages: [
          { id: "princess-1", url: princess1, alt: "Princess style portrait with tiara and castle" },
          { id: "princess-2", url: princess1, alt: "Royal princess portrait" },
          { id: "princess-3", url: princess1, alt: "Magical princess transformation" },
        ],
      },
      {
        id: "fairy",
        name: "Fairy Tale",
        description: "Magical fairy-themed images",
        prompt: "Create a magical fairy-themed portrait with delicate wings, enchanted forest background, and whimsical lighting. Maintain facial features while adding ethereal elements.",
        sampleImages: [
          { id: "fairy-1", url: fairy1, alt: "Enchanted fairy portrait" },
          { id: "fairy-2", url: fairy1, alt: "Magical forest fairy" },
          { id: "fairy-3", url: fairy1, alt: "Fairy tale transformation" },
        ],
      },
      {
        id: "modern",
        name: "Modern Portrait",
        description: "Contemporary stylish portraits",
        prompt: "Create a modern, stylish portrait with contemporary fashion elements, professional lighting, and a clean aesthetic. Keep the subject recognizable with enhanced features.",
        sampleImages: [
          { id: "modern-1", url: professional1, alt: "Modern stylish portrait" },
          { id: "modern-2", url: professional1, alt: "Contemporary portrait style" },
        ],
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
        sampleImages: [
          { id: "superhero-1", url: superhero1, alt: "Superhero transformation portrait" },
          { id: "superhero-2", url: superhero1, alt: "Dynamic hero pose" },
          { id: "superhero-3", url: superhero1, alt: "Action superhero style" },
        ],
      },
      {
        id: "sports",
        name: "Sports Star",
        description: "Athletic sports-themed images",
        prompt: "Create a sports star portrait with athletic energy, stadium atmosphere, and dynamic action elements. Maintain facial features while adding professional sports styling.",
        sampleImages: [
          { id: "sports-1", url: sports1, alt: "Sports star portrait" },
          { id: "sports-2", url: sports1, alt: "Athletic champion style" },
          { id: "sports-3", url: sports1, alt: "Stadium sports transformation" },
        ],
      },
      {
        id: "adventure",
        name: "Adventure Theme",
        description: "Explorer and adventure style",
        prompt: "Create an adventure-themed portrait with explorer elements, natural outdoor settings, and adventurous atmosphere. Keep the subject recognizable with adventure gear styling.",
        sampleImages: [
          { id: "adventure-1", url: sports1, alt: "Adventure explorer portrait" },
          { id: "adventure-2", url: sports1, alt: "Outdoor adventure style" },
        ],
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
        sampleImages: [
          { id: "professional-1", url: professional1, alt: "Professional business portrait" },
          { id: "professional-2", url: professional1, alt: "Corporate executive style" },
          { id: "professional-3", url: professional1, alt: "Business woman portrait" },
        ],
      },
      {
        id: "glamour",
        name: "Glamour Style",
        description: "High-fashion glamour portraits",
        prompt: "Transform into a high-fashion glamour portrait with sophisticated styling, professional beauty lighting, and magazine-quality finish. Maintain facial features with enhanced glamour elements.",
        sampleImages: [
          { id: "glamour-1", url: professional1, alt: "Glamour fashion portrait" },
          { id: "glamour-2", url: professional1, alt: "High fashion style" },
        ],
      },
      {
        id: "traditional",
        name: "Traditional",
        description: "Cultural and traditional styles",
        prompt: "Create a beautiful traditional portrait with elegant cultural styling, warm lighting, and graceful atmosphere. Keep the subject recognizable with traditional attire elements.",
        sampleImages: [
          { id: "traditional-1", url: diwali1, alt: "Traditional cultural portrait" },
          { id: "traditional-2", url: diwali1, alt: "Elegant traditional style" },
        ],
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
        sampleImages: [
          { id: "diwali-1", url: diwali1, alt: "Diwali celebration with diyas and traditional attire" },
          { id: "diwali-2", url: diwali2, alt: "Diwali portrait with sparklers and fireworks" },
          { id: "diwali-3", url: diwali3, alt: "Family Diwali celebration with rangoli" },
        ],
      },
      {
        id: "dussehra",
        name: "Dussehra",
        description: "Victory celebration theme",
        prompt: "Create a Dussehra festival portrait with vibrant celebration elements, traditional decorations, and the spirit of victory over evil. Include festival elements while maintaining the subject's recognizable features.",
        sampleImages: [
          { id: "dussehra-1", url: diwali2, alt: "Dussehra victory celebration" },
          { id: "dussehra-2", url: diwali2, alt: "Traditional Dussehra portrait" },
        ],
      },
      {
        id: "sankranti",
        name: "Sankranti",
        description: "Harvest festival celebration",
        prompt: "Create a Makar Sankranti celebration portrait with colorful kites, traditional attire, and harvest festival atmosphere. Add festive elements while keeping the subject clearly recognizable.",
        sampleImages: [
          { id: "sankranti-1", url: diwali3, alt: "Sankranti kite festival portrait" },
          { id: "sankranti-2", url: diwali3, alt: "Harvest festival celebration" },
        ],
      },
      {
        id: "holi",
        name: "Holi",
        description: "Festival of Colors",
        prompt: "Transform into a vibrant Holi celebration portrait with colorful powder splashes, joyful atmosphere, and festive energy. Add bright colors artistically while maintaining the subject's recognizable features.",
        sampleImages: [
          { id: "holi-1", url: holi1, alt: "Holi colors celebration portrait" },
          { id: "holi-2", url: holi1, alt: "Vibrant Holi festival transformation" },
          { id: "holi-3", url: holi1, alt: "Festival of colors portrait" },
        ],
      },
      {
        id: "christmas",
        name: "Christmas",
        description: "Christmas celebration theme",
        prompt: "Create a magical Christmas portrait with festive decorations, warm holiday lighting, snow elements, and Christmas cheer. Add Santa hat or winter elements while keeping the subject recognizable.",
        sampleImages: [
          { id: "christmas-1", url: christmas1, alt: "Christmas celebration with Santa hat" },
          { id: "christmas-2", url: christmas1, alt: "Holiday festive portrait" },
          { id: "christmas-3", url: christmas1, alt: "Winter Christmas transformation" },
        ],
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
