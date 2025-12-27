import { motion } from "framer-motion";
import { FolderOpen, Upload, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: FolderOpen,
    title: "Pick a Style",
    description: "Browse our collection of 50+ AI transformation styles",
    step: "01",
  },
  {
    icon: Upload,
    title: "Upload Photo",
    description: "Add your image - supports PNG, JPG up to 10MB",
    step: "02",
  },
  {
    icon: Sparkles,
    title: "AI Magic",
    description: "Watch as AI transforms your photo in seconds",
    step: "03",
  },
  {
    icon: Download,
    title: "Download",
    description: "Save your creation in high quality format",
    step: "04",
  },
];

export const HowItWorks = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto px-4">
            Create amazing AI images in four simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="glass-card-hover p-4 md:p-6 h-full">
                {/* Step Number */}
                <div className="text-3xl md:text-4xl font-display font-bold text-primary/20 mb-3 md:mb-4">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3 md:mb-4">
                  <step.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-base md:text-lg font-semibold mb-1.5 md:mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{step.description}</p>
              </div>

              {/* Connector - Desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
