import React, { useEffect, useState } from 'react';
import { getRedirectResult, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
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

  useEffect(() => {
    async function checkRedirectResult() {
      try {
        const result = await getRedirectResult(auth);
        const email = result?.user.email;
        if (email && email !== 'antoinettewilliams@thetruelavender.online' && email !== 'antoinetteqwilliams@gmail.com') {
          await auth.signOut();
          setError('Unauthorized email address. Please use the admin email.');
        }
      } catch (err: any) {
        setError(getLoginErrorMessage(err));
        console.error(err);
      }
    }

    checkRedirectResult();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithRedirect(auth, provider);
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
