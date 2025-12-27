import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-card/20">
      <div className="container-custom py-10 md:py-14 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 md:mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg gradient-text">
                AI ImageGen
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-4 leading-relaxed">
              Transform your photos with professional AI technology. Create stunning images in seconds.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3 text-sm md:text-base">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/generate" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Generate
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  History
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3 text-sm md:text-base">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
              © {new Date().getFullYear()} AI ImageGen. All rights reserved.
            </p>
            <p className="text-muted-foreground text-xs text-center md:text-right">
              AI-generated content may vary. Use responsibly.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
