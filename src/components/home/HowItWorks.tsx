import { motion } from "framer-motion";
import { FolderOpen, Upload, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: FolderOpen,
    title: "Choose Category",
    description: "Select from our curated categories like Festivals, Portraits, and more",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Upload,
    title: "Upload Your Image",
    description: "Upload your photo in PNG, JPG, or JPEG format",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: Sparkles,
    title: "AI Generates Instantly",
    description: "Our Gemini AI transforms your image in seconds",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Download,
    title: "Download & Share",
    description: "Download your creation in high quality PNG, JPG, or JPEG",
    color: "from-pink-500 to-red-500",
  },
];

export const HowItWorks = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Generate stunning AI images in just four simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="glass-card-hover p-6 h-full">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector Line */}
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
