import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hexagon, X } from 'lucide-react';

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  return (
    <footer className="bg-gray-950 pt-20 pb-8 text-gray-300 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Hexagon className="w-8 h-8 text-lavender-500" />
              <div className="flex flex-col">
                <span className="font-serif text-2xl text-white font-semibold tracking-wide leading-none">
                  True Lavender
                </span>
                <span className="text-[10px] uppercase tracking-widest text-lavender-400 mt-1">
                  Digital Solutions
                </span>
              </div>
            </div>
            <p className="text-gray-400 font-light max-w-sm">
              True Lavender Digital Services, founded by Antoinette Williams in Ohio, delivers holistic strategies, custom websites, AI workflows, and SEO optimization for small businesses nationwide.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Services</h4>
            <ul className="space-y-4 font-light text-gray-400">
              <li><a href="#services" className="hover:text-lavender-400 transition-colors">Website Design</a></li>
              <li><a href="#services" className="hover:text-lavender-400 transition-colors">Local SEO & Technical SEO</a></li>
              <li><a href="#services" className="hover:text-lavender-400 transition-colors">AI Business Automation</a></li>
              <li><a href="#services" className="hover:text-lavender-400 transition-colors">Digital Strategy Consulting</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Connect</h4>
            <ul className="space-y-4 font-light text-gray-400">
              <li><a href="#contact" className="hover:text-lavender-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-light">
          <p>© {new Date().getFullYear()} True Lavender Digital Services. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <button onClick={() => setShowPrivacy(true)} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => setShowTerms(true)} className="hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => setShowAccessibility(true)} className="hover:text-white transition-colors">Accessibility Statement</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPrivacy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto text-gray-800 shadow-2xl relative"
            >
              <button onClick={() => setShowPrivacy(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900" aria-label="Close Privacy Policy">
                <X className="w-6 h-6" />
              </button>
              <h2 className="font-serif text-3xl mb-6">Privacy Policy</h2>
              <div className="space-y-4 font-light leading-relaxed">
                <p>Welcome to True Lavender's Privacy Policy. We respect your privacy and are committed to protecting your personal data.</p>
                <h3 className="font-medium text-lg mt-6 mb-2">Information We Collect</h3>
                <p>We may collect, use, store and transfer different kinds of personal data about you, including identity data, contact data, and technical data when you visit our website.</p>
                <h3 className="font-medium text-lg mt-6 mb-2">How We Use Your Data</h3>
                <p>We use your data to provide and improve our services, to communicate with you about web design, SEO, and AI consulting, and to comply with any legal obligations.</p>
                <h3 className="font-medium text-lg mt-6 mb-2">Data Security</h3>
                <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
                <p className="mt-8 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </motion.div>
          </div>
        )}

        {showTerms && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto text-gray-800 shadow-2xl relative"
            >
              <button onClick={() => setShowTerms(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900" aria-label="Close Terms of Service">
                <X className="w-6 h-6" />
              </button>
              <h2 className="font-serif text-3xl mb-6">Terms of Service</h2>
              <div className="space-y-4 font-light leading-relaxed">
                <p>These Terms of Service govern your use of our website and services operated by True Lavender Digital Services.</p>
                <h3 className="font-medium text-lg mt-6 mb-2">Acceptance of Terms</h3>
                <p>By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.</p>
                <h3 className="font-medium text-lg mt-6 mb-2">Use of Services</h3>
                <p>You agree to use our services only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</p>
                <h3 className="font-medium text-lg mt-6 mb-2">Intellectual Property</h3>
                <p>The content, layout, design, data, databases and graphics on this website are protected by United States and other international intellectual property laws and are owned by True Lavender Digital Services.</p>
                <h3 className="font-medium text-lg mt-6 mb-2">Limitation of Liability</h3>
                <p>True Lavender shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues.</p>
                <p className="mt-8 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </motion.div>
          </div>
        )}

        {showAccessibility && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto text-gray-800 shadow-2xl relative"
            >
              <button onClick={() => setShowAccessibility(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900" aria-label="Close Accessibility Statement">
                <X className="w-6 h-6" />
              </button>
              <h2 className="font-serif text-3xl mb-6">Accessibility Statement</h2>
              <div className="space-y-4 font-light leading-relaxed">
                <p>True Lavender Digital Services is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
                <h3 className="font-medium text-lg mt-6 mb-2">Conformance Status</h3>
                <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We strive to maintain compliance with WCAG 2.1 level AA.</p>
                <h3 className="font-medium text-lg mt-6 mb-2">Feedback</h3>
                <p>We welcome your feedback on the accessibility of True Lavender Digital Services. Please let us know if you encounter accessibility barriers by emailing us at antoinettewilliams@thetruelavender.online.</p>
                <p className="mt-8 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
