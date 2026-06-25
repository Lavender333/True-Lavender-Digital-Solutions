import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock3, Sparkles, Wand2 } from 'lucide-react';

const highlights = [
  {
    icon: Sparkles,
    title: 'Custom App Worlds',
    description: 'Branded mini apps, portals, and interactive experiences shaped around your business goals.',
  },
  {
    icon: Wand2,
    title: 'Design + Automation',
    description: 'Pixel-polished screens connected to booking, payments, forms, content, and follow-up flows.',
  },
  {
    icon: Clock3,
    title: 'More Included Time',
    description: 'LavenderCare Plus now includes 3 hours of monthly content, design, or app update time.',
  },
];

export default function PixelVerse() {
  return (
    <section id="pixelverse" className="py-24 bg-gray-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium text-lavender-300 tracking-wider uppercase mb-3">
              PixelVerse
            </p>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-6">
              A brighter way to launch your next app experience.
            </h2>
            <p className="text-lg text-gray-300 font-light leading-relaxed mb-8 max-w-2xl">
              PixelVerse brings together custom app screens, automation, and brand storytelling so your clients can book, buy, learn, or connect in one polished digital space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="#contact"
                className="px-8 py-4 rounded-full bg-lavender-500 text-white font-medium hover:bg-lavender-400 transition-colors flex items-center justify-center gap-2 group"
              >
                Create My PixelVerse
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#pricing"
                className="px-8 py-4 rounded-full bg-white/10 border border-white/15 text-white font-medium hover:bg-white/15 transition-all flex items-center justify-center"
              >
                View App Care Time
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="border border-white/10 bg-white/[0.04] p-5 rounded-2xl">
                    <Icon className="w-5 h-5 text-lavender-300 mb-4" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-300 font-light leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 translate-x-6 translate-y-6 bg-lavender-500/20 rounded-2xl" />
            <img
              src="/true-lavender-social-card.png"
              alt="True Lavender Digital Solutions brand artwork"
              className="relative w-full rounded-2xl border border-white/10 shadow-2xl shadow-lavender-950/40 object-cover"
              loading="lazy"
              decoding="async"
              width="1200"
              height="630"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
