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
  prompt: string;
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
    color: "from-rose-500 to-pink-500",
    subcategories: [
      {
        id: "princess",
        name: "Princess Style",
        description: "Elegant princess-themed portraits",
        prompt: "Transform this photo into an elegant princess portrait with soft lighting, royal attire elements, and a magical fairy-tale atmosphere.",
        sampleImages: [
          { id: "princess-1", url: princess1, alt: "Princess style portrait" },
          { id: "princess-2", url: princess1, alt: "Royal princess portrait" },
        ],
      },
      {
        id: "fairy",
        name: "Fairy Tale",
        description: "Magical fairy-themed images",
        prompt: "Create a magical fairy-themed portrait with delicate wings, enchanted forest background, and whimsical lighting.",
        sampleImages: [
          { id: "fairy-1", url: fairy1, alt: "Enchanted fairy portrait" },
          { id: "fairy-2", url: fairy1, alt: "Magical forest fairy" },
        ],
      },
      {
        id: "ballet",
        name: "Ballet Dancer",
        description: "Graceful ballet-themed portraits",
        prompt: "Transform into an elegant ballet dancer portrait with graceful pose, tutu elements, and soft studio lighting.",
        sampleImages: [
          { id: "ballet-1", url: princess1, alt: "Ballet dancer portrait" },
        ],
      },
      {
        id: "mermaid",
        name: "Mermaid Fantasy",
        description: "Underwater mermaid transformations",
        prompt: "Create a mystical mermaid portrait with underwater elements, shimmering scales, and ocean backdrop.",
        sampleImages: [
          { id: "mermaid-1", url: fairy1, alt: "Mermaid fantasy portrait" },
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
        prompt: "Transform this photo into a dynamic superhero portrait with heroic pose elements, dramatic lighting, and powerful energy effects.",
        sampleImages: [
          { id: "superhero-1", url: superhero1, alt: "Superhero transformation" },
          { id: "superhero-2", url: superhero1, alt: "Dynamic hero pose" },
        ],
      },
      {
        id: "sports",
        name: "Sports Star",
        description: "Athletic sports-themed images",
        prompt: "Create a sports star portrait with athletic energy, stadium atmosphere, and dynamic action elements.",
        sampleImages: [
          { id: "sports-1", url: sports1, alt: "Sports star portrait" },
          { id: "sports-2", url: sports1, alt: "Athletic champion style" },
        ],
      },
      {
        id: "astronaut",
        name: "Space Explorer",
        description: "Astronaut and space adventures",
        prompt: "Transform into an astronaut portrait with space suit, cosmic background, and futuristic elements.",
        sampleImages: [
          { id: "astronaut-1", url: superhero1, alt: "Space explorer portrait" },
        ],
      },
      {
        id: "pirate",
        name: "Pirate Adventure",
        description: "Swashbuckling pirate themes",
        prompt: "Create a pirate adventure portrait with captain attire, ship deck background, and treasure elements.",
        sampleImages: [
          { id: "pirate-1", url: sports1, alt: "Pirate adventure portrait" },
        ],
      },
      {
        id: "ninja",
        name: "Ninja Warrior",
        description: "Stealthy ninja transformations",
        prompt: "Transform into a ninja warrior portrait with martial arts pose, traditional attire, and mystical atmosphere.",
        sampleImages: [
          { id: "ninja-1", url: superhero1, alt: "Ninja warrior portrait" },
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
        prompt: "Create a professional business portrait with elegant corporate styling, studio lighting, and confident atmosphere.",
        sampleImages: [
          { id: "professional-1", url: professional1, alt: "Professional portrait" },
          { id: "professional-2", url: professional1, alt: "Corporate style" },
        ],
      },
      {
        id: "glamour",
        name: "Glamour Style",
        description: "High-fashion glamour portraits",
        prompt: "Transform into a high-fashion glamour portrait with sophisticated styling, professional beauty lighting.",
        sampleImages: [
          { id: "glamour-1", url: professional1, alt: "Glamour fashion portrait" },
        ],
      },
      {
        id: "bridal",
        name: "Bridal Beauty",
        description: "Elegant bridal transformations",
        prompt: "Create a stunning bridal portrait with elegant wedding styling, soft romantic lighting, and dreamy atmosphere.",
        sampleImages: [
          { id: "bridal-1", url: princess1, alt: "Bridal beauty portrait" },
        ],
      },
      {
        id: "vintage",
        name: "Vintage Elegance",
        description: "Classic vintage style portraits",
        prompt: "Transform into a vintage elegance portrait with retro styling, classic Hollywood lighting, and timeless atmosphere.",
        sampleImages: [
          { id: "vintage-1", url: professional1, alt: "Vintage elegance portrait" },
        ],
      },
      {
        id: "bohemian",
        name: "Bohemian Spirit",
        description: "Free-spirited bohemian looks",
        prompt: "Create a bohemian spirit portrait with natural outdoor setting, flowing fabrics, and ethereal lighting.",
        sampleImages: [
          { id: "bohemian-1", url: fairy1, alt: "Bohemian spirit portrait" },
        ],
      },
    ],
  },
  {
    id: "men",
    name: "Men",
    description: "Stylish portrait styles for men",
    icon: "👨",
    color: "from-slate-600 to-gray-700",
    subcategories: [
      {
        id: "business",
        name: "Business Executive",
        description: "Professional executive portraits",
        prompt: "Create a professional executive portrait with sophisticated business styling, confident pose, and studio lighting.",
        sampleImages: [
          { id: "business-1", url: professional1, alt: "Business executive portrait" },
        ],
      },
      {
        id: "rugged",
        name: "Rugged Outdoors",
        description: "Adventurous outdoor portraits",
        prompt: "Transform into a rugged outdoor portrait with adventure styling, natural lighting, and wilderness backdrop.",
        sampleImages: [
          { id: "rugged-1", url: sports1, alt: "Rugged outdoor portrait" },
        ],
      },
      {
        id: "fitness",
        name: "Fitness Model",
        description: "Athletic fitness portraits",
        prompt: "Create a fitness model portrait with athletic physique highlight, dynamic pose, and gym or outdoor setting.",
        sampleImages: [
          { id: "fitness-1", url: sports1, alt: "Fitness model portrait" },
        ],
      },
      {
        id: "artistic",
        name: "Artistic Portrait",
        description: "Creative artistic transformations",
        prompt: "Transform into an artistic portrait with creative lighting, dramatic shadows, and fine art aesthetic.",
        sampleImages: [
          { id: "artistic-1", url: professional1, alt: "Artistic portrait" },
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
        prompt: "Transform this photo into a beautiful Diwali celebration portrait with warm golden lighting, diya lamps, rangoli elements.",
        sampleImages: [
          { id: "diwali-1", url: diwali1, alt: "Diwali celebration" },
          { id: "diwali-2", url: diwali2, alt: "Diwali with sparklers" },
          { id: "diwali-3", url: diwali3, alt: "Family Diwali celebration" },
        ],
      },
      {
        id: "holi",
        name: "Holi",
        description: "Festival of Colors",
        prompt: "Transform into a vibrant Holi celebration portrait with colorful powder splashes, joyful atmosphere.",
        sampleImages: [
          { id: "holi-1", url: holi1, alt: "Holi colors celebration" },
          { id: "holi-2", url: holi1, alt: "Vibrant Holi festival" },
        ],
      },
      {
        id: "christmas",
        name: "Christmas",
        description: "Christmas celebration theme",
        prompt: "Create a magical Christmas portrait with festive decorations, warm holiday lighting, snow elements.",
        sampleImages: [
          { id: "christmas-1", url: christmas1, alt: "Christmas celebration" },
          { id: "christmas-2", url: christmas1, alt: "Holiday festive portrait" },
        ],
      },
      {
        id: "navratri",
        name: "Navratri",
        description: "Navratri Garba celebration",
        prompt: "Create a vibrant Navratri portrait with traditional Garba attire, colorful decorations, and festive dance atmosphere.",
        sampleImages: [
          { id: "navratri-1", url: diwali1, alt: "Navratri Garba portrait" },
        ],
      },
      {
        id: "eid",
        name: "Eid Celebration",
        description: "Eid festive portraits",
        prompt: "Transform into an elegant Eid celebration portrait with traditional attire, crescent moon elements, and festive atmosphere.",
        sampleImages: [
          { id: "eid-1", url: diwali2, alt: "Eid celebration portrait" },
        ],
      },
      {
        id: "halloween",
        name: "Halloween",
        description: "Spooky Halloween themes",
        prompt: "Create a fun Halloween portrait with costume elements, spooky decorations, and atmospheric lighting.",
        sampleImages: [
          { id: "halloween-1", url: christmas1, alt: "Halloween themed portrait" },
        ],
      },
      {
        id: "newyear",
        name: "New Year",
        description: "New Year celebration",
        prompt: "Create a glamorous New Year celebration portrait with party atmosphere, sparkles, and midnight countdown elements.",
        sampleImages: [
          { id: "newyear-1", url: diwali3, alt: "New Year celebration portrait" },
        ],
      },
    ],
  },
  {
    id: "family",
    name: "Family",
    description: "Family portrait themes",
    icon: "👨‍👩‍👧‍👦",
    color: "from-teal-500 to-emerald-500",
    subcategories: [
      {
        id: "traditional",
        name: "Traditional Family",
        description: "Classic family portraits",
        prompt: "Create a warm traditional family portrait with elegant styling, soft studio lighting, and timeless composition.",
        sampleImages: [
          { id: "traditional-1", url: professional1, alt: "Traditional family portrait" },
        ],
      },
      {
        id: "outdoor",
        name: "Outdoor Adventure",
        description: "Fun outdoor family photos",
        prompt: "Transform into a joyful outdoor family portrait with natural setting, golden hour lighting, and candid moments.",
        sampleImages: [
          { id: "outdoor-1", url: sports1, alt: "Outdoor family portrait" },
        ],
      },
      {
        id: "holiday",
        name: "Holiday Card",
        description: "Perfect holiday card photos",
        prompt: "Create a festive holiday card portrait with seasonal decorations, matching outfits, and cheerful atmosphere.",
        sampleImages: [
          { id: "holiday-1", url: christmas1, alt: "Holiday card family portrait" },
        ],
      },
    ],
  },
  {
    id: "anime",
    name: "Anime & Cartoon",
    description: "Anime and cartoon transformations",
    icon: "🎨",
    color: "from-pink-500 to-cyan-400",
    subcategories: [
      {
        id: "anime",
        name: "Anime Style",
        description: "Japanese anime transformation",
        prompt: "Transform into an anime style portrait with large expressive eyes, stylized features, and anime art aesthetic.",
        sampleImages: [
          { id: "anime-1", url: fairy1, alt: "Anime style portrait" },
        ],
      },
      {
        id: "pixar",
        name: "Pixar Style",
        description: "3D Pixar-like characters",
        prompt: "Create a Pixar-style 3D character portrait with exaggerated features, vibrant colors, and cinematic lighting.",
        sampleImages: [
          { id: "pixar-1", url: superhero1, alt: "Pixar style portrait" },
        ],
      },
      {
        id: "disney",
        name: "Disney Princess",
        description: "Disney-inspired portraits",
        prompt: "Transform into a Disney princess style portrait with magical elements, fairytale aesthetic, and enchanting atmosphere.",
        sampleImages: [
          { id: "disney-1", url: princess1, alt: "Disney princess portrait" },
        ],
      },
      {
        id: "manga",
        name: "Manga Hero",
        description: "Manga comic book style",
        prompt: "Create a manga hero portrait with dynamic action pose, speed lines, and dramatic manga art styling.",
        sampleImages: [
          { id: "manga-1", url: superhero1, alt: "Manga hero portrait" },
        ],
      },
    ],
  },
  {
    id: "fantasy",
    name: "Fantasy & Sci-Fi",
    description: "Magical and futuristic themes",
    icon: "🔮",
    color: "from-violet-600 to-purple-500",
    subcategories: [
      {
        id: "wizard",
        name: "Wizard & Sorcerer",
        description: "Magical wizard portraits",
        prompt: "Transform into a powerful wizard portrait with mystical robes, magical aura, and enchanted atmosphere.",
        sampleImages: [
          { id: "wizard-1", url: fairy1, alt: "Wizard portrait" },
        ],
      },
      {
        id: "cyberpunk",
        name: "Cyberpunk",
        description: "Futuristic cyberpunk style",
        prompt: "Create a cyberpunk portrait with neon lights, futuristic technology, and dystopian city backdrop.",
        sampleImages: [
          { id: "cyberpunk-1", url: superhero1, alt: "Cyberpunk portrait" },
        ],
      },
      {
        id: "elf",
        name: "Fantasy Elf",
        description: "Elegant elven transformations",
        prompt: "Transform into an ethereal elf portrait with pointed ears, mystical forest setting, and magical elements.",
        sampleImages: [
          { id: "elf-1", url: fairy1, alt: "Fantasy elf portrait" },
        ],
      },
      {
        id: "vampire",
        name: "Gothic Vampire",
        description: "Dark vampire aesthetics",
        prompt: "Create a gothic vampire portrait with dramatic dark styling, mysterious atmosphere, and elegant gothic elements.",
        sampleImages: [
          { id: "vampire-1", url: professional1, alt: "Gothic vampire portrait" },
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