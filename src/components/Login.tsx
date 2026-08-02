import React, { useState } from 'react';
import { browserLocalPersistence, setPersistence, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebaseAuth';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLoginErrorMessage = (err: any) => {
    if (err?.code === 'auth/unauthorized-domain') {
      return 'This website domain is not authorized in Firebase yet. Add thetruelavender.com in Firebase Authentication > Settings > Authorized domains.';
    }

    return err?.message || 'Failed to login';
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email?.toLowerCase();
      const adminEmails = [
        'antoinettewilliams@thetruelavender.online',
        'antoinetteqwilliams@gmail.com',
        'thetruelavender@gmail.com',
      ];

      if (!email || !adminEmails.includes(email)) {
        await auth.signOut();
        setError('Unauthorized email address. Please use an approved admin email.');
        setLoading(false);
        return;
      }

      window.location.replace(`${window.location.origin}${window.location.pathname}#dashboard`);
    } catch (err: any) {
      setError(getLoginErrorMessage(err));
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div id="login" className="py-24 bg-white flex justify-center items-center">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">Admin Access</h2>
          <p className="text-gray-600 font-light">Login to schedule appointments and manage your client bookings.</p>
        </div>
        
        {error && (
           <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
             {error}
           </div>
        )}

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gray-900 text-white text-md font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <LogIn className="w-5 h-5" />
          {loading ? 'Opening Google...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}
