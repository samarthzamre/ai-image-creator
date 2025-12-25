import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Wand2, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-primary/40 via-primary/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-accent/40 via-accent/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-gradient-radial from-glow-blue/30 via-glow-blue/5 to-transparent rounded-full blur-3xl"
        />
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="container-custom px-4 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card mb-8 group cursor-pointer hover:border-primary/50 transition-colors"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Powered by Gemini 2.5 Flash AI
            </span>
            <Zap className="w-3 h-3 text-accent" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight"
          >
            Transform Photos Into{" "}
            <span className="gradient-text relative">
              AI Magic
              <motion.span
                className="absolute -right-8 -top-4 text-3xl"
                animate={{ rotate: [0, 15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Create stunning festival looks, professional portraits, and artistic transformations
            with our advanced <span className="text-foreground font-medium">AI Image Generator</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/categories">
              <Button className="btn-primary text-lg px-10 py-5 h-auto gap-3 group">
                <Wand2 className="w-5 h-5" />
                Start Creating
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/categories">
              <Button className="btn-secondary text-lg px-10 py-5 h-auto gap-2">
                <Star className="w-5 h-5" />
                Explore Styles
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: "10K+", label: "Images Created", icon: "🖼️" },
              { value: "50+", label: "Unique Styles", icon: "🎨" },
              { value: "99%", label: "Happy Users", icon: "⭐" },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="glass-card p-4 md:p-6 text-center group hover:border-primary/30 transition-colors cursor-default"
                whileHover={{ y: -4 }}
              >
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <div className="font-display text-2xl md:text-3xl font-bold gradient-text-static mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 left-8 md:left-16 w-16 md:w-20 h-16 md:h-20 rounded-2xl glass-card hidden lg:flex items-center justify-center shadow-glow"
      >
        <span className="text-3xl md:text-4xl">🎨</span>
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-8 md:right-16 w-16 md:w-20 h-16 md:h-20 rounded-2xl glass-card hidden lg:flex items-center justify-center shadow-glow-accent"
      >
        <span className="text-3xl md:text-4xl">✨</span>
      </motion.div>
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-48 right-24 w-14 h-14 rounded-xl glass-card hidden xl:flex items-center justify-center"
      >
        <span className="text-2xl">🪄</span>
      </motion.div>
    </section>
  );
};
