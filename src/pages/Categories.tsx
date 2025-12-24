import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Wand2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { categories } from "@/lib/categories";

const Categories = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16 px-4 md:px-8">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              All <span className="gradient-text">Categories</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse through our complete collection of AI image generation styles.
              Click on any sample image to transform your photo.
            </p>
          </motion.div>

          {/* Categories with Subcategories */}
          <div className="space-y-20">
            {categories.map((category, catIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl`}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold">{category.name}</h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <Link
                    to={`/categories/${category.id}`}
                    className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    View All Styles
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Subcategories */}
                <div className="space-y-12">
                  {category.subcategories.map((sub, subIndex) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIndex * 0.1 + subIndex * 0.05 }}
                    >
                      {/* Subcategory Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <Link
                            to={`/categories/${category.id}/${sub.id}`}
                            className="font-display text-lg font-semibold hover:text-primary transition-colors"
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
                            transition={{ delay: catIndex * 0.1 + subIndex * 0.05 + imgIndex * 0.03 }}
                            onClick={() => navigate(`/generate/${category.id}/${sub.id}`)}
                            className="group cursor-pointer"
                          >
                            <div className="glass-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                              <div className="aspect-square relative overflow-hidden">
                                <img
                                  src={image.url}
                                  alt={image.alt}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                                  <div className="text-center">
                                    <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-gradient-primary flex items-center justify-center">
                                      <Wand2 className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                    <p className="text-xs font-medium text-foreground">
                                      Transform
                                    </p>
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
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Categories;
