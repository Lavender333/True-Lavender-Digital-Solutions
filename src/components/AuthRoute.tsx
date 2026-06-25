import React, { ComponentType, Suspense } from 'react';
import { AuthProvider, useAuth } from './AuthProvider';
import Navigation from './Navigation';
import Footer from './Footer';

type AuthRouteProps = {
  route: 'login' | 'dashboard';
  component: ComponentType;
};

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-600"></div>
    </div>
  );
}

function AuthRouteContent({ route, component: Component }: AuthRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (route === 'login' && user) {
    window.location.hash = '#dashboard';
    return null;
  }

  if (route === 'dashboard' && !user) {
    window.location.hash = '#login';
    return null;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Navigation />
      <main className={`flex-grow ${route === 'login' ? 'flex flex-col items-center justify-center pt-20' : 'pt-20'}`}>
        <Suspense fallback={<LoadingScreen />}>
          <Component />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function AuthRoute(props: AuthRouteProps) {
  return (
    <AuthProvider>
      <AuthRouteContent {...props} />
    </AuthProvider>
  );
}
