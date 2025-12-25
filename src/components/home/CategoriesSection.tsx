import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { categories } from "@/lib/categories";

const categoryGradients = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-violet-500",
  "from-orange-500 to-amber-500",
];

export const CategoriesSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Browse Collection</span>
          </motion.div>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-5">
            Explore <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Choose from our stunning collection of AI transformation styles
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/categories/${category.id}`}>
                <div className="glass-card-hover p-6 h-full group cursor-pointer relative overflow-hidden">
                  {/* Gradient Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryGradients[index % categoryGradients.length]}`} />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryGradients[index % categoryGradients.length]} flex items-center justify-center mb-5 text-3xl shadow-lg`}
                  >
                    {category.icon}
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5 line-clamp-2">{category.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-muted-foreground">
                      {category.subcategories.length} styles
                    </span>
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-primary hover:border-primary/50 transition-all font-medium group"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
