import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Wand2, Search, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCategories } from "@/lib/useCategories";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { Input } from "@/components/ui/input";

const Categories = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { categories } = useCategories();

  const filteredCategories = useMemo(() => {
    let result = categories;
    
    if (activeCategory) {
      result = result.filter(cat => cat.id === activeCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.filter(
          sub => sub.name.toLowerCase().includes(query) || 
                 sub.description.toLowerCase().includes(query)
        )
      })).filter(cat => 
        cat.name.toLowerCase().includes(query) || 
        cat.subcategories.length > 0
      );
    }
    
    return result;
  }, [searchQuery, activeCategory, categories]);

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-24 md:pt-32 pb-16 px-4 md:px-8">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              All <span className="gradient-text">Categories</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Browse our complete collection of AI transformation styles
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search categories or styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            <button
              onClick={() => setActiveCategory(null)}
              className={`category-pill ${!activeCategory ? 'active' : ''}`}
            >
              All
            </button>
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className={`category-pill ${activeCategory === category.id ? 'active' : ''}`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Categories with Subcategories */}
          <div className="space-y-16">
            {filteredCategories.map((category, catIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.05 }}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const IconComponent = getCategoryIcon(category.id);
                      return (
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      );
                    })()}
                    <div>
                      <h2 className="font-display text-xl font-bold">{category.name}</h2>
                      <p className="text-muted-foreground text-sm">{category.description}</p>
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                <div className="space-y-10">
                  {category.subcategories.map((sub, subIndex) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIndex * 0.05 + subIndex * 0.03 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Link
                            to={`/categories/${category.id}/${sub.id}`}
                            className="font-display text-base font-semibold hover:text-primary transition-colors"
                          >
                            {sub.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">{sub.description}</p>
                        </div>
                        <Link
                          to={`/categories/${category.id}/${sub.id}`}
                          className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                          See all
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* Sample Images */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {sub.sampleImages.slice(0, 5).map((image, imgIndex) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: imgIndex * 0.02 }}
                            onClick={() => navigate(`/generate/${category.id}/${sub.id}`)}
                            className="group cursor-pointer"
                          >
                            <div className="glass-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                              <div className="aspect-square relative overflow-hidden">
                                <img
                                  src={image.url}
                                  alt={image.alt}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                                  <div className="text-center">
                                    <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-primary flex items-center justify-center">
                                      <Wand2 className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                    <p className="text-xs font-medium">Transform</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No categories found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Categories;
