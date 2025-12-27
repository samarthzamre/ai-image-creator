import { motion } from "framer-motion";
import { Zap, Shield, Sparkles, Smartphone, Clock, Palette } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Advanced AI",
    description: "Cutting-edge AI models for stunning, realistic transformations",
  },
  {
    icon: Palette,
    title: "Pro Editing",
    description: "Full editing suite with filters, adjustments, and AI enhancements",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate beautiful images in just a few seconds",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your images are processed securely and never stored",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Full functionality on any device, anywhere you go",
  },
  {
    icon: Clock,
    title: "Local History",
    description: "Access your recent creations for up to 24 hours",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/3 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-primary/8 to-transparent blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 px-2">
            Why Choose <span className="gradient-text">Our Platform</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto px-4">
            Professional tools made simple for everyone
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="glass-card-hover p-4 md:p-5 group"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0 group-hover:from-primary/25 group-hover:to-accent/25 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-base md:text-lg font-semibold mb-1 md:mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
