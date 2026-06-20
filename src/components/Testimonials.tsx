import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "True Lavender completely transformed our digital presence. Antoinette's expertise in both SEO and AI workflow automation saved us dozens of hours a week.",
    name: "Sarah Jenkins",
    role: "Owner, Elevate Consulting",
    company: "Professional Services"
  },
  {
    quote: "The website redesign was flawless. We saw a 140% increase in local leads within the first three months of launching the new SEO-optimized site.",
    name: "Marcus Thorne",
    role: "Founder",
    company: "Thorne Architecture"
  },
  {
    quote: "Antoinette doesn't just build websites; she builds comprehensive growth engines. Her GEO strategy positioned us perfectly for the future of search.",
    name: "Elena Rostova",
    role: "Director of Marketing",
    company: "Nexus Tech Solutions"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-lavender-900 text-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-lavender-800/50 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-lavender-950/50 blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-sm font-medium text-lavender-300 tracking-wider uppercase mb-3">Client Success</h2>
          <h3 className="text-4xl md:text-5xl font-serif">What Our Partners Say</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-lavender-950/40 backdrop-blur-sm border border-lavender-800/50 p-8 rounded-3xl relative"
            >
              <Quote className="w-10 h-10 text-lavender-600/50 absolute top-6 right-6" />
              <p className="text-lavender-100 font-light leading-relaxed mb-8 relative z-10 text-lg">
                "{testimonial.quote}"
              </p>
              <div className="flex flex-col">
                <span className="font-medium text-white">{testimonial.name}</span>
                <span className="text-sm text-lavender-300 font-light">{testimonial.role}</span>
                <span className="text-xs text-lavender-400 mt-1 uppercase tracking-wider">{testimonial.company}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
