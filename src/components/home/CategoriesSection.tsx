import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { categories } from "@/lib/categories";

export const CategoriesSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      
      <div className="container-custom relative z-10">
        {/* Header */}
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card mb-4 md:mb-5"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Explore Collection</span>
          </motion.div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 px-2">
            Popular <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto px-4">
            Discover AI transformation styles for every occasion
          </p>
        </motion.div>

        {/* Categories Grid */}
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
                <div className="glass-card-hover p-4 md:p-5 h-full group cursor-pointer relative overflow-hidden">
                  {/* Gradient Accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent opacity-60" />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mb-3 md:mb-4 text-2xl md:text-3xl"
                  >
                    {category.icon}
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-display text-sm md:text-base font-semibold mb-1 md:mb-1.5 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 mb-3 md:mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] md:text-xs font-medium px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                      {category.subcategories.length} styles
                    </span>
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
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
