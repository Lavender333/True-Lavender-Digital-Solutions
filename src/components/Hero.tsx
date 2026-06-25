import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-lavender-200/40 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-lavender-100/60 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="max-w-3xl">
          <div
            className="hero-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-100 text-lavender-800 text-xs font-medium uppercase tracking-wider mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-lavender-600" />
            Web Design & Business Automation
          </div>
          
          <h1
            className="hero-reveal hero-reveal-delay-1 text-5xl md:text-7xl font-serif text-gray-900 leading-[1.1] tracking-tight mb-6"
          >
            Elevating your <br/>
            <span className="text-lavender-600 italic leading-snug pr-2">business</span><br/>
            with precision.
          </h1>
          
          <p
            className="hero-reveal hero-reveal-delay-2 text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl"
          >
            True Lavender Digital Services, founded by Antoinette Williams, provides scalable website design, business automation, and strategic consulting for growing businesses in Ohio and nationwide.
          </p>
          
          <div
            className="hero-reveal hero-reveal-delay-3 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#pixelverse"
              className="px-8 py-4 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
            >
              Explore PixelVerse
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#pricing"
              className="px-8 py-4 rounded-full bg-white border border-gray-200 text-gray-900 font-medium hover:border-lavender-300 hover:bg-lavender-50 transition-all flex items-center justify-center"
            >
              View Service Plans
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
