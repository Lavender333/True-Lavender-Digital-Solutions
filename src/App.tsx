/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Suspense, lazy, useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import PixelVerse from './components/PixelVerse';
import Approach from './components/Approach';
import About from './components/About';
import Portfolio from './components/Portfolio';
import FAQ from './components/FAQ';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import { useAuth } from './components/AuthProvider';

const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const BookingInvite = lazy(() => import('./components/BookingInvite'));
const ContractSign = lazy(() => import('./components/ContractSign'));

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-600"></div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  const [hash, setHash] = useState(window.location.hash);
  const [meetId, setMeetId] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
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
    if (loading) {
      return <LoadingScreen />;
    }

    if (user) {
      window.location.hash = '#dashboard';
      return null;
    }
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
        <Navigation />
        <main className="flex-grow flex flex-col items-center justify-center pt-20">
          <Suspense fallback={<LoadingScreen />}>
            <Login />
          </Suspense>
        </main>
        <Footer />
      </div>
    );
  }

  if (hash === '#dashboard') {
    if (loading) {
      return <LoadingScreen />;
    }

    if (!user) {
      window.location.hash = '#login';
      return null;
    }
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
        <Navigation />
        <main className="flex-grow pt-20">
          <Suspense fallback={<LoadingScreen />}>
            <Dashboard />
          </Suspense>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-lavender-200 selection:text-lavender-900">
      <Navigation />
      
      <main>
        <Hero />
        <Services />
        <PixelVerse />
        <Approach />
        <About />
        <Portfolio />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
}
