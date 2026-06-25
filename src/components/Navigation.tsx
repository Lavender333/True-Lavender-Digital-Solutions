import React, { useState, useEffect } from 'react';
import { Menu, X, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'PixelVerse', href: '#pixelverse' },
    { name: 'Approach', href: '#approach' },
    { name: 'Work', href: '#work' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 group">
          <Hexagon className="w-8 h-8 text-lavender-600 transition-transform group-hover:-rotate-12 duration-300" />
          <div className="flex flex-col">
            <span className="font-serif text-xl font-semibold tracking-wide text-gray-900 group-hover:text-lavender-600 transition-colors leading-none">
              True Lavender
            </span>
            <span className="text-[10px] uppercase tracking-widest text-lavender-500 font-medium mt-1">
              Digital Solutions
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-lavender-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#login"
            className="text-sm font-medium text-gray-600 hover:text-lavender-600 transition-colors mr-4"
          >
            Login
          </a>
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-full bg-lavender-600 text-white text-sm font-medium hover:bg-lavender-700 transition-colors shadow-sm hover:shadow-md"
          >
            Start a Project
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-800 hover:text-lavender-600"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-6 py-3 rounded-full bg-lavender-50 text-lavender-700 border border-lavender-100 text-center font-medium shadow-sm"
              >
                Login
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 px-6 py-3 rounded-full bg-lavender-600 text-white text-center font-medium shadow-sm"
              >
                Start a Project
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
