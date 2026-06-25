import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Rocket, Laptop, Paintbrush, ArrowRight } from 'lucide-react';

const websitePackages = [
  {
    title: 'Launch + Automate',
    hook: 'Full build plus systems that run themselves.',
    description: 'Everything in Starter plus automation for booking, contracts, and payments, social media kit, and LavenderCare Plus.',
    priceTotal: '$4,750',
    priceMonthly: '$950/mo (x5)',
    linkBook: 'https://buy.stripe.com/4gM4gB9418ET8Ra6Q27kc03',
    linkPlan: 'https://buy.stripe.com/7sY9AVcgd08n9Ve6Q27kc07',
    popular: true,
  },
  {
    title: 'Commerce',
    hook: 'Sell smarter with a polished online store.',
    description: 'Up to 17 products uploaded, payment, tax & shipping setup, branded order emails, QA, and recorded handoff.',
    priceTotal: '$2,500',
    priceMonthly: '$625/mo (x4)',
    linkBook: 'https://buy.stripe.com/00w28t1BzcV95EY4HU7kc08',
    linkPlan: 'https://buy.stripe.com/5kQeVf0xvg7l6J2cam7kc06',
    popular: false,
  },
  {
    title: 'Starter',
    hook: 'Five-page design with built-in growth tools.',
    description: 'Five-page site with CMS tutorial, two reusable post templates, accessibility & SEO essentials, and analytics goals.',
    priceTotal: '$2,300',
    priceMonthly: '$575/mo (x4)',
    linkBook: 'https://buy.stripe.com/cNibJ3fspg7l8Ra4HU7kc02',
    linkPlan: 'https://buy.stripe.com/00w9AVeol8ET8RagqC7kc05',
    popular: false,
  },
  {
    title: 'Essential',
    hook: 'Elegant one-page site, fast and flawless.',
    description: 'Elegant single-page site with up to six sections, contact form, SEO setup, and fast, polished delivery.',
    priceTotal: '$975',
    priceMonthly: '$325/mo (x3)',
    linkBook: 'https://buy.stripe.com/00w6oJ7ZXf3h1oI1vI7kc01',
    linkPlan: 'https://buy.stripe.com/7sY3cxcgd9IXgjC5LY7kc04',
    popular: false,
  },
];

const presentationPackages = [
  {
    title: 'Clarity Deck',
    hook: 'Perfect for simple one-topic talks and internal updates.',
    description: 'Up to 10 custom slides in a single, cohesive brand look, with 1 round of refinements and a 5 business-day turnaround.',
    priceMain: '$197 flat',
    priceSub: 'Book today: $97 (0% interest, remaining $100 due at delivery)',
    linkBook: 'mailto:hello@thetruelavender.com?subject=Clarity%20Deck%20Booking',
    linkQuestion: 'mailto:hello@thetruelavender.com?subject=Clarity%20Deck%20Question',
  },
  {
    title: 'Signature Story Deck',
    hook: 'For workshops, sales calls, and story-driven presentations.',
    description: 'Up to 20 custom slides with your storyline and slide flow mapped for you, branded icons and simple diagrams, and 2 rounds of refinements.',
    priceMain: '$347 flat',
    priceSub: 'Book today: $147 (0% interest, remaining $200 due at delivery)',
    linkBook: 'mailto:hello@thetruelavender.com?subject=Signature%20Story%20Deck%20Booking',
    linkQuestion: 'mailto:hello@thetruelavender.com?subject=Signature%20Story%20Deck%20Question',
  },
  {
    title: 'Investor & Executive Pitch Deck',
    hook: 'For high-stakes pitches, boards, and decision-makers.',
    description: 'Up to 30 custom slides, narrative arc and positioning support, data and metrics slides styled and simplified, plus 2–3 rounds of refinements.',
    priceMain: '$750 flat',
    priceSub: 'Book today: $250 (0% interest, remaining $500 due at delivery)',
    linkBook: 'mailto:hello@thetruelavender.com?subject=Investor%20Pitch%20Deck%20Booking',
    linkQuestion: 'mailto:hello@thetruelavender.com?subject=Investor%20Pitch%20Deck%20Question',
  },
];

const automationAddons = [
  { title: 'Booking → Contract → Payment', hook: 'Book, sign, and pay — on autopilot.', description: 'Calendly, custom intake, auto e-sign, Stripe/Square checkout or invoice, confirmations, analytics tracking.', price: '$850 (+ $150 per extra event)' },
  { title: 'Automation Starter', hook: 'Quick wins that run themselves.', description: 'Two flows, up to 5 steps each (Zapier/Make). Handoff doc + recording.', price: '$550' },
  { title: 'Automation Pro', hook: 'Complex logic — calm execution.', description: 'Multi-app logic (up to 12 steps), error handling, 30-day monitoring.', price: '$1,500' },
  { title: 'CRM Lite Setup', hook: 'Your pipeline, ready on day one.', description: 'HubSpot/Zoho/Mailchimp fields, pipeline/audience, form capture, 3-email welcome.', price: '$950' },
];

const carePlans = [
  { 
    title: 'LavenderCare Basic', 
    hook: 'Stay stable. Stay secure.', 
    description: 'Monitoring, backups, security, core updates.', 
    price: '$85 / mo',
    yearlyPrice: '$850 / year (save ~15%)' 
  },
  { 
    title: 'LavenderCare Plus', 
    hook: 'Maintenance with momentum.', 
    description: 'Everything in Basic + 3 hours of content, design, or app updates.', 
    price: '$175 / mo',
    yearlyPrice: '$1,750 / year (save ~15%)'
  },
  { 
    title: 'On-Call Support', 
    hook: 'Rapid help, whenever you need it.', 
    description: 'Out-of-scope tasks and fast iterations.', 
    price: '$125 / hour',
    yearlyPrice: ''
  },
];

type TabType = 'websites' | 'presentations' | 'addons';

export default function Pricing() {
  const [activeTab, setActiveTab] = useState<TabType>('websites');

  return (
    <section id="pricing" className="py-24 bg-lavender-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-medium text-lavender-600 tracking-wider uppercase mb-3">Investment</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6">
            Transparent Pricing & Packages
          </h3>
          <p className="text-lg text-gray-600 font-light mb-10">
            Select what you are looking to build today. We keep our offerings focused so you can easily find the perfect fit.
          </p>

          <div className="inline-flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveTab('websites')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'websites' ? 'bg-lavender-600 text-white shadow-md' : 'text-gray-600 hover:text-lavender-600 hover:bg-lavender-50'
              }`}
            >
              Websites & Stores
            </button>
            <button
              onClick={() => setActiveTab('presentations')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'presentations' ? 'bg-lavender-600 text-white shadow-md' : 'text-gray-600 hover:text-lavender-600 hover:bg-lavender-50'
              }`}
            >
              Presentations & Decks
            </button>
            <button
              onClick={() => setActiveTab('addons')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'addons' ? 'bg-lavender-600 text-white shadow-md' : 'text-gray-600 hover:text-lavender-600 hover:bg-lavender-50'
              }`}
            >
              Add-ons & Maintenance
            </button>
          </div>
        </div>

        <AnimatedTabContainer>
          {/* Website Packages */}
          {activeTab === 'websites' && (
            <motion.div
              key="websites"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-lavender-200 flex items-center justify-center text-lavender-700">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-2xl font-serif text-gray-900">Website Design & Build Packages</h4>
                  <p className="text-gray-500 text-sm">Choose this section if you need a new website or online store.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {websitePackages.map((pkg, idx) => (
                  <motion.div
                    key={pkg.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className={`relative bg-white rounded-3xl p-8 border hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${
                      pkg.popular ? 'border-lavender-500 shadow-xl shadow-lavender-900/5' : 'border-gray-100 shadow-sm hover:shadow-xl hover:shadow-lavender-900/5'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-lavender-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                        Most Comprehensive
                      </div>
                    )}
                    <h5 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h5>
                    <p className="text-sm text-lavender-600 italic mb-4 min-h-[40px]">{pkg.hook}</p>
                    <p className="text-sm text-gray-600 font-light mb-6 flex-grow">{pkg.description}</p>
                    <div className="mb-6 pt-6 border-t border-gray-50 flex flex-col gap-2">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">{pkg.priceTotal}</p>
                        <p className="text-xs text-lavender-600 font-medium tracking-wide mt-1">ONE-TIME FEE</p>
                        <p className="text-xs text-gray-500 mt-2">or {pkg.priceMonthly}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-auto">
                      <a
                        href={pkg.linkBook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center py-3 rounded-xl bg-lavender-600 text-white text-sm font-medium hover:bg-lavender-700 transition-colors"
                      >
                        Book Website Build
                      </a>
                      <a
                        href={pkg.linkPlan}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center py-3 rounded-xl bg-lavender-50 text-lavender-700 text-sm font-medium hover:bg-lavender-100 transition-colors"
                      >
                        Start Payment Plan
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-12 bg-lavender-50 border border-lavender-100 rounded-2xl p-6 text-center max-w-2xl mx-auto flex flex-col items-center">
                <span className="bg-lavender-200 text-lavender-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Required Ongoing</span>
                <p className="text-sm text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                  All websites require an ongoing Hosting & Maintenance plan to stay live and secure.{"\n"}
                  Plans start at <span className="font-bold text-lavender-700">$12.50/month</span> or <span className="font-bold text-lavender-700">$150/year</span>.
                </p>
              </div>
            </motion.div>
          )}

          {/* Presentation Packages */}
          {activeTab === 'presentations' && (
            <motion.div
              key="presentations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-lavender-200 flex items-center justify-center text-lavender-700">
                  <Paintbrush className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-2xl font-serif text-gray-900">Presentation & PowerPoint Packages</h4>
                  <p className="text-gray-500 text-sm">Perfect if you already have a website and need a presentation, workshop deck, or pitch.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {presentationPackages.map((pkg, idx) => (
                  <motion.div
                    key={pkg.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-lavender-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  >
                    <h5 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h5>
                    <p className="text-sm text-lavender-600 italic mb-4 min-h-[40px]">{pkg.hook}</p>
                    <p className="text-sm text-gray-600 font-light mb-6 flex-grow">{pkg.description}</p>
                    <div className="mb-6 pt-6 border-t border-gray-50">
                      <p className="text-xl font-bold text-gray-900">{pkg.priceMain}</p>
                      <p className="text-xs text-gray-500 mt-1">{pkg.priceSub}</p>
                    </div>
                    <div className="flex flex-col gap-3 mt-auto">
                      <a
                        href={pkg.linkBook}
                        className="w-full text-center py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        Book Deck
                      </a>
                      <a
                        href={pkg.linkQuestion}
                        className="w-full text-center py-3 rounded-xl bg-gray-50 text-gray-700 border border-gray-200 text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        Ask a Question
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Add-ons & Maintenance Grid */}
          {activeTab === 'addons' && (
            <motion.div
              key="addons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              {/* Automation Add-Ons */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-lavender-200 flex items-center justify-center text-lavender-700">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-serif text-gray-900">Automation Add-Ons</h4>
                    <p className="text-gray-500 text-sm">Not extras. Multipliers.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {automationAddons.map((addon, idx) => (
                    <motion.div 
                      key={addon.title} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                    >
                      <div>
                        <h5 className="font-bold text-gray-900 flex items-center gap-2">
                           {addon.title}
                        </h5>
                        <p className="text-sm text-lavender-600 italic mt-1">{addon.hook}</p>
                        <p className="text-sm text-gray-600 font-light mt-1">{addon.description}</p>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="font-bold text-gray-900">{addon.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* LavenderCare */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-lavender-200 flex items-center justify-center text-lavender-700">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-serif text-gray-900">LavenderCare Plans</h4>
                    <p className="text-gray-500 text-sm">Ongoing care for your website after launch.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {carePlans.map((plan, idx) => (
                    <motion.div 
                      key={plan.title} 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                    >
                      <div>
                        <h5 className="font-bold text-gray-900 flex items-center gap-2">
                          {plan.title}
                        </h5>
                        <p className="text-sm text-lavender-600 italic mt-1">{plan.hook}</p>
                        <p className="text-sm text-gray-600 font-light mt-1">{plan.description}</p>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="font-bold text-gray-900">{plan.price}</p>
                        {plan.yearlyPrice && <p className="text-xs text-lavender-600 font-medium mt-1">{plan.yearlyPrice}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatedTabContainer>

      </div>
    </section>
  );
}

// Helper to provide nice cross-fade between tabs without jumping layout wildly
function AnimatedTabContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </div>
  );
}
