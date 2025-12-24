import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30"
    >
      <div className="container-custom flex items-center justify-between h-16 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl gradient-text">
            AI ImageGen
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/categories"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Categories
          </Link>
          <Link
            to="/history"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            History
          </Link>
          <Link to="/generate">
            <Button className="btn-primary">Generate Image</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-card border-t border-border/30"
        >
          <div className="flex flex-col p-4 gap-4">
            <Link
              to="/"
              className="text-foreground py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/categories"
              className="text-foreground py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/history"
              className="text-foreground py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              History
            </Link>
            <Link to="/generate" onClick={() => setIsMenuOpen(false)}>
              <Button className="btn-primary w-full">Generate Image</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
