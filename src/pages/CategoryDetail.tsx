import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Wand2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCategories } from "@/lib/useCategories";
import { Button } from "@/components/ui/button";

const CategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { getCategoryById } = useCategories();
  const category = categoryId ? getCategoryById(categoryId) : undefined;

  if (!category) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link to="/categories">
            <Button className="btn-secondary">Back to Categories</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16 px-4 md:px-8">
        <div className="container-custom">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6 mb-12"
          >
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-4xl`}
            >
              {category.icon}
            </div>
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                {category.name}
              </h1>
              <p className="text-muted-foreground text-lg">{category.description}</p>
            </div>
          </motion.div>

          {/* Subcategories with Images */}
          <div className="space-y-16">
            {category.subcategories.map((sub, subIndex) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: subIndex * 0.1 }}
              >
                {/* Subcategory Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold gradient-text">
                      {sub.name}
                    </h2>
                    <p className="text-muted-foreground">{sub.description}</p>
                  </div>
                  <Link to={`/categories/${categoryId}/${sub.id}`}>
                    <Button className="btn-secondary gap-2">
                      View All
                      <Wand2 className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Sample Images Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sub.sampleImages.slice(0, 4).map((image, imgIndex) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: subIndex * 0.1 + imgIndex * 0.05 }}
                      onClick={() => navigate(`/generate/${categoryId}/${sub.id}`)}
                      className="group cursor-pointer"
                    >
                      <div className="glass-card-hover overflow-hidden">
                        <div className="aspect-square relative overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <div className="text-center">
                              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-primary flex items-center justify-center">
                                <Wand2 className="w-5 h-5 text-primary-foreground" />
                              </div>
                              <p className="text-sm font-medium text-foreground">
                                Create This Style
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
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CategoryDetail;
