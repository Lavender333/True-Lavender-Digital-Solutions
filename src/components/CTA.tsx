import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function CTA() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [{ collection, addDoc }, { db }] = await Promise.all([
        import('firebase/firestore'),
        import('../lib/firebaseDb')
      ]);

      await addDoc(collection(db, 'messages'), {
        name,
        email,
        message,
        createdAt: Date.now(),
        read: false
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setError('An error occurred while sending your message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-lavender-900 -z-20" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent -z-10" />
      
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
          Ready to elevate your digital presence?
        </h2>
        <p className="text-xl text-lavender-200 font-light mb-10 max-w-2xl mx-auto">
          Let's discuss how True Lavender can help you achieve your business goals through considered design and strategic execution.
        </p>
        
        {success ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-serif text-gray-900 mb-2">Message Sent!</h3>
            <p className="text-gray-600">Thank you for reaching out. We will get back to you shortly.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-6 text-lavender-600 font-medium hover:text-lavender-700"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl text-left">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all"
                placeholder="Your name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all"
                placeholder="hello@example.com"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                id="message" 
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about your project..."
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-lavender-600 text-white font-medium hover:bg-lavender-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
