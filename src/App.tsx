/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Suspense, lazy, useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';

const Services = lazy(() => import('./components/Services'));
const PixelVerse = lazy(() => import('./components/PixelVerse'));
const Approach = lazy(() => import('./components/Approach'));
const About = lazy(() => import('./components/About'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const FAQ = lazy(() => import('./components/FAQ'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Pricing = lazy(() => import('./components/Pricing'));
const CTA = lazy(() => import('./components/CTA'));
const Footer = lazy(() => import('./components/Footer'));
const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const BookingInvite = lazy(() => import('./components/BookingInvite'));
const ContractSign = lazy(() => import('./components/ContractSign'));
const AuthRoute = lazy(() => import('./components/AuthRoute'));

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-600"></div>
    </div>
  );
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [meetId, setMeetId] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  const [loadMarketingSections, setLoadMarketingSections] = useState(window.location.hash.length > 0);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
      setLoadMarketingSections(true);
    };
    window.addEventListener('hashchange', handleHashChange);
    
    // Check for meet param
    const params = new URLSearchParams(window.location.search);
    const m = params.get('meet');
    if (m) setMeetId(m);

    // Check for contract param
    const c = params.get('contract');
    if (c) setContractId(c);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (loadMarketingSections || meetId || contractId || hash === '#login' || hash === '#dashboard') {
      return;
    }

    const load = () => setLoadMarketingSections(true);
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(load, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(load, 500);
    return () => globalThis.clearTimeout(timeoutId);
  }, [contractId, hash, loadMarketingSections, meetId]);

  // If a meeting link is visited, show that instead of the site.
  if (meetId) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <BookingInvite meetingId={meetId} />
      </Suspense>
    );
  }

  // If a contract link is visited, show that instead of the site
  if (contractId) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <ContractSign contractId={contractId} />
      </Suspense>
    );
  }

  if (hash === '#login') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthRoute route="login" component={Login} />
      </Suspense>
    );
  }

  if (hash === '#dashboard') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthRoute route="dashboard" component={Dashboard} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-lavender-200 selection:text-lavender-900">
      <Navigation />
      
      <main>
        <Hero />
        {loadMarketingSections && (
          <Suspense fallback={null}>
            <Services />
            <PixelVerse />
            <Approach />
            <About />
            <Portfolio />
            <Testimonials />
            <Pricing />
            <FAQ />
            <CTA />
          </Suspense>
        )}
      </main>
      
      {loadMarketingSections && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}
