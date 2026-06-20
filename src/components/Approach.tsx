import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  {
    title: 'Discovery & Strategy',
    description: 'We learn your business inside and out to define a roadmap that aligns with your goals.'
  },
  {
    title: 'Design & Build',
    description: 'Our team crafts the visual identity and engineers the platform using cutting-edge tools.'
  },
  {
    title: 'Launch & Optimize',
    description: 'We deploy your solution and provide ongoing insights to guarantee continued success.'
  }
];

export default function Approach() {
  return (
    <section id="approach" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-medium text-lavender-600 tracking-wider uppercase mb-3">Our Approach</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">
            How we bring your vision to life.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-24 right-24 h-px bg-lavender-200 z-0" />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center px-4"
            >
              <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-lavender-100 flex items-center justify-center mb-6 text-2xl font-serif text-lavender-600">
                0{index + 1}
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h4>
              <p className="text-gray-600 font-light leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
