import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCategories } from "@/lib/useCategories";

export const CategoriesSection = () => {
  const { categories } = useCategories();
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Explore Collection</span>
          </motion.div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            Popular <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto">
            Discover AI transformation styles for every occasion
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {categories.slice(0, 8).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/categories/${category.id}`}>
                <div className="glass-card-hover h-full group cursor-pointer relative overflow-hidden rounded-xl">
                  {/* Category Image */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={category.subcategories[0]?.sampleImages[0]?.url}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <h3 className="font-display text-sm md:text-base font-semibold mb-0.5 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-xs line-clamp-1 mb-2">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-xs font-medium px-2 py-1 rounded-md bg-secondary/80 text-muted-foreground">
                        {category.subcategories.length} styles
                      </span>
                      <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-3 h-3 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8 md:mt-10"
        >
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-primary hover:border-primary/50 transition-all font-medium text-sm md:text-base group"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
