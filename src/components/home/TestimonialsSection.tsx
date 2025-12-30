import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Content Creator",
    text: "The AI transformations are incredible! My followers love the creative portraits I create.",
    rating: 5,
  },
  {
    name: "Raj P.",
    role: "Photographer",
    text: "Perfect for adding unique styles to my clients' photos. The festival themes are amazing!",
    rating: 5,
  },
  {
    name: "Emily K.",
    role: "Parent",
    text: "My kids love seeing themselves as superheroes and princesses. So much fun!",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Loved by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            See what our users are saying about their AI transformations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 text-sm">{testimonial.text}</p>
              <div>
                <p className="font-semibold text-sm">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
