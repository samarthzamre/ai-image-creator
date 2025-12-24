import { motion } from "framer-motion";
import { Zap, Shield, Sparkles, Users, Clock, ImageIcon } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Gemini 2.5 Flash Powered",
    description: "Latest AI technology for stunning, high-quality image generation",
  },
  {
    icon: ImageIcon,
    title: "High-Quality Output",
    description: "Generate professional-grade images suitable for any purpose",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Get your AI-generated images in seconds, not minutes",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your images are processed securely and never stored permanently",
  },
  {
    icon: Users,
    title: "Beginner Friendly",
    description: "Simple interface designed for users of all skill levels",
  },
  {
    icon: Clock,
    title: "24-Hour History",
    description: "Access your generated images for up to 24 hours locally",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/10 to-transparent blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">AI ImageGen</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the next generation of AI-powered image transformation
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-hover p-6 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary/20 flex items-center justify-center shrink-0 group-hover:bg-gradient-primary/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
