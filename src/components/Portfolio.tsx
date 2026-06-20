import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Layout } from 'lucide-react';

const examples = [
  {
    title: 'Sagi Solar Transportation',
    link: 'https://sagisolar.com/',
    displayLink: 'sagisolar.com',
    note: 'Custom website and business solution',
  },
  {
    title: 'Precision Research Co.',
    link: 'http://precisionresearch.co',
    displayLink: 'precisionresearch.co',
    note: 'Research-focused business website',
  },
  {
    title: 'Antoinette Williams',
    link: 'https://antoinettewillliams.com',
    displayLink: 'antoinettewillliams.com',
    note: 'Personal brand and portfolio site',
  },
  {
    title: 'Fawakyburst',
    link: null,
    displayLink: null,
    note: 'Website was already established. Assisted with updates.',
  }
];

export default function Portfolio() {
  return (
    <section id="work" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-medium text-lavender-600 tracking-wider uppercase mb-3">Portfolio</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-4">
            Recent Work & Collaborations
          </h3>
          <p className="text-gray-600 font-light text-lg">
            A showcase of recent customer sites and digital solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {examples.map((example, index) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-lavender-50 rounded-3xl p-8 hover:bg-lavender-100 transition-colors duration-300 border border-transparent hover:border-lavender-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all text-lavender-600">
                <Layout className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-serif text-gray-900 mb-2">
                {example.title}
              </h4>
              {example.link ? (
                <a
                  href={example.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-lavender-600 font-medium hover:text-lavender-800 transition-colors mb-4 group/link"
                >
                  {example.displayLink}
                  <ExternalLink className="w-4 h-4 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <div className="h-6 mb-4" />
              )}
              <p className="text-gray-600 font-light leading-relaxed">
                {example.note}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
