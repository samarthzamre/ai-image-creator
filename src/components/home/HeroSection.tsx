import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Wand2, Zap, Camera, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-16 pb-8 md:pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-radial from-primary/30 via-primary/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.15, 1, 1.15],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-1/4 right-1/4 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-gradient-radial from-accent/30 via-accent/5 to-transparent rounded-full blur-3xl"
        />
      </div>
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.015)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.015)_1px,transparent_1px)] bg-[size:60px_60px] md:bg-[size:80px_80px]" />

      <div className="container-custom px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 md:mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            </motion.div>
            <span className="text-xs md:text-sm font-medium text-muted-foreground">
              Powered by Advanced AI Technology
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 150 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 md:mb-6 leading-[1.1] tracking-tight px-2"
          >
            Create Stunning{" "}
            <span className="gradient-text relative">
              AI Images
            </span>{" "}
            in Seconds
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Transform your photos with professional AI editing. Perfect for festivals, 
            portraits, creative projects, and more.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 md:mb-16 px-4"
          >
            <Link to="/categories" className="w-full sm:w-auto">
              <Button className="btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto gap-2 md:gap-3 group w-full sm:w-auto">
                <Wand2 className="w-4 h-4 md:w-5 md:h-5" />
                Start Creating
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/categories" className="w-full sm:w-auto">
              <Button className="btn-secondary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto gap-2 w-full sm:w-auto">
                <Layers className="w-4 h-4 md:w-5 md:h-5" />
                Browse Styles
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="grid grid-cols-3 gap-3 md:gap-6 max-w-xl mx-auto px-2"
          >
            {[
              { value: "50+", label: "AI Styles", icon: Camera },
              { value: "Fast", label: "Processing", icon: Zap },
              { value: "Free", label: "To Start", icon: Sparkles },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="glass-card p-3 md:p-5 text-center group hover:border-primary/30 transition-colors"
                whileHover={{ y: -2 }}
              >
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-primary" />
                <div className="font-display text-lg sm:text-xl md:text-2xl font-bold gradient-text-static mb-0.5">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Elements - Hidden on mobile */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-8 lg:left-16 w-14 h-14 lg:w-16 lg:h-16 rounded-xl glass-card hidden md:flex items-center justify-center shadow-glow"
      >
        <Camera className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-8 lg:right-16 w-14 h-14 lg:w-16 lg:h-16 rounded-xl glass-card hidden md:flex items-center justify-center shadow-glow-accent"
      >
        <Wand2 className="w-6 h-6 lg:w-7 lg:h-7 text-accent" />
      </motion.div>
    </section>
  );
};
