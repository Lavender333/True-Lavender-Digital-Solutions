import React from 'react';
import { motion } from 'motion/react';
import { Laptop, Cpu, BookOpen, Target } from 'lucide-react';

const services = [
  {
    icon: Laptop,
    title: 'Website Design',
    description: 'Custom business websites and redesigns optimized for speed, accessibility, and modern aesthetics. Built to convert traffic into clients.',
  },
  {
    icon: Target,
    title: 'SEO Optimization',
    description: 'Technical SEO, Local SEO, and Generative Engine Optimization (GEO) strategies to improve ranking on Google Maps, Bing, and AI Search.',
  },
  {
    icon: Cpu,
    title: 'AI Workflow Solutions',
    description: 'Implement modern AI automation tools into your business. Streamline your operations with intelligent, automated systems.',
  },
  {
    icon: BookOpen,
    title: 'Digital Consulting',
    description: 'Ongoing technical support, analytics reporting, and strategic roadmaps to position your small business for sustainable growth.',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-sm font-medium text-lavender-600 tracking-wider uppercase mb-3">Our Core Services</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">
              Comprehensive web and AI solutions for small businesses.
            </h3>
          </div>
          <p className="text-gray-600 max-w-sm">
            We provide an end-to-end approach, blending creative web design with sophisticated AI business automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 rounded-3xl bg-lavender-50 hover:bg-lavender-600 transition-colors duration-300 flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm group-hover:bg-lavender-500/20 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6 text-lavender-600 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-white transition-colors">
                  {service.title}
                </h4>
                <p className="text-gray-600 leading-relaxed font-light group-hover:text-lavender-100 transition-colors flex-grow">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
