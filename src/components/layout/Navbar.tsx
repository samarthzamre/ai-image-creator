import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/history", label: "History" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30 safe-top"
    >
      <div className="container-custom flex items-center justify-between h-14 md:h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 md:w-4.5 md:h-4.5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-base md:text-lg gradient-text">
            AI ImageGen
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="w-9 h-9">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/generate">
            <Button className="btn-primary text-sm px-5 py-2 h-auto">Generate</Button>
          </Link>
        </div>

        {/* Mobile Right Section */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 text-foreground rounded-lg hover:bg-secondary/50 transition-colors touch-manipulation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-card border-t border-border/30 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2 safe-bottom">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(link.to)
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:bg-secondary/50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                to="/admin" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg font-medium text-foreground hover:bg-secondary/50 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin Panel
              </Link>
              <Link to="/generate" onClick={() => setIsMenuOpen(false)} className="mt-2">
                <Button className="btn-primary w-full py-3 h-auto">Generate Image</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
