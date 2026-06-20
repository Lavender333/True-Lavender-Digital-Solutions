import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      if (email !== 'antoinettewilliams@thetruelavender.online' && email !== 'antoinetteqwilliams@gmail.com') {
        await auth.signOut();
        setError('Unauthorized email address. Please use the admin email.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      console.error(err);
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
          className="w-full py-4 rounded-xl bg-gray-900 text-white text-md font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
