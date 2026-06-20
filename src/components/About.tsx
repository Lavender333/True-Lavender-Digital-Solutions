import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2"
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-lavender-50">
              <img 
                src="/profile-photo.png" 
                alt="Antoinette Williams - Founder of True Lavender Digital Services" 
                className="w-full h-full object-cover"
                loading="lazy"
                width="800"
                height="800"
              />
              <div className="absolute inset-0 bg-lavender-900/10 mix-blend-multiply" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-sm uppercase tracking-widest text-lavender-600 font-medium mb-4">
              About The Founder
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight">
              Antoinette Williams
            </h3>
            <p className="text-xl text-gray-500 font-light mb-8 leading-relaxed">
              For more than five years, Antoinette has served as an IT Systems Analyst within a Fortune 500 company, contributing to high-impact enterprise initiatives.
            </p>
            <div className="space-y-4 text-gray-600 leading-relaxed font-light mb-8">
              <p>
                Frequently joining projects midstream, she brings structure to complexity by designing and refining the systems necessary to move solutions from development to production. She translates business requirements into scalable technical frameworks and strengthens workflows to ensure successful delivery at scale.
              </p>
              <p>
                Today, as CEO and Founder of True Lavender Digital Services and Precision Research Co., she leads ventures centered on research, operational clarity, and strategic execution. Her work bridges enterprise systems and creative intelligence, aligning structure with human experience.
              </p>
            </div>
            
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/in/antoinetteqwilliams/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                LinkedIn Profile
              </a>
              <a 
                href="#contact" 
                className="px-6 py-3 rounded-full bg-lavender-600 text-white hover:bg-lavender-700 transition-colors font-medium text-sm"
              >
                Work With Me
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
