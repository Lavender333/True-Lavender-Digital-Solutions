import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How much does a website cost?",
    answer: "Website building costs vary by project scope, but our standard custom business websites start at a competitive rate. We also offer affordable monthly hosting and maintenance starting at $12.50/month."
  },
  {
    question: "Do you redesign websites?",
    answer: "Yes, we specialize in complete website redesigns, taking your existing site and transforming it to meet modern standards, enhance user experience, and improve conversion optimization."
  },
  {
    question: "Do you work remotely?",
    answer: "Absolutely. While we are based in Ohio, we serve clients nationally across the United States. All of our consulting, design, and automation services can be performed 100% remotely."
  },
  {
    question: "What industries do you serve?",
    answer: "We serve a diverse range of industries including professional services, e-commerce, local small businesses, agencies, and consultants seeking digital transformation and SEO growth."
  },
  {
    question: "Do you provide SEO?",
    answer: "Yes, we are experts in Local SEO, Technical SEO, and Generative Engine Optimization (GEO). We optimize everything from site architecture and schema markup to keyword clusters for high Google rankings."
  },
  {
    question: "Do you offer AI automation?",
    answer: "Yes, we build AI workflow solutions and provide business automation consulting to help small businesses leverage modern Generative AI technologies and optimize internal operations."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-sm font-medium text-lavender-600 tracking-wider uppercase mb-3">Questions & Answers</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-gray-900">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex justify-between items-center group focus:outline-none"
              >
                <span className="font-medium text-gray-900 group-hover:text-lavender-600 transition-colors">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-6 text-gray-600 font-light leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
