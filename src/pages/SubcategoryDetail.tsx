import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Wand2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCategoryById, getSubcategoryById } from "@/lib/categories";
import { Button } from "@/components/ui/button";

const SubcategoryDetail = () => {
  const { categoryId, subcategoryId } = useParams<{
    categoryId: string;
    subcategoryId: string;
  }>();
  const navigate = useNavigate();

  const category = categoryId ? getCategoryById(categoryId) : undefined;
  const subcategory =
    category && subcategoryId
      ? getSubcategoryById(categoryId, subcategoryId)
      : undefined;

  if (!category || !subcategory) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Style not found</h1>
          <Link to="/categories">
            <Button className="btn-secondary">Back to Categories</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const handleImageClick = () => {
    navigate(`/generate/${categoryId}/${subcategoryId}`);
  };

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
              to={`/categories/${categoryId}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {category.name}
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-4xl`}
            >
              {category.icon}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{subcategory.name}</span> Styles
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              {subcategory.description}
            </p>
            <p className="text-primary text-sm">
              Click on any image below to transform your photo in this style
            </p>
          </motion.div>

          {/* Sample Images Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-semibold mb-6 text-center">
              Sample Transformations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategory.sampleImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={handleImageClick}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-primary flex items-center justify-center">
                            <Wand2 className="w-7 h-7 text-primary-foreground" />
                          </div>
                          <p className="font-semibold text-foreground">
                            Transform Your Photo
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Click to create this style
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground text-center">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Link to={`/generate/${categoryId}/${subcategoryId}`}>
              <Button className="btn-primary text-lg px-10 py-5 h-auto gap-2">
                <Wand2 className="w-5 h-5" />
                Start Creating {subcategory.name} Style
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default SubcategoryDetail;
