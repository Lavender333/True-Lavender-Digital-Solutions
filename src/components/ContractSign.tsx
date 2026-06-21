import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format } from 'date-fns';
import { FileSignature, Hexagon, CheckCircle2 } from 'lucide-react';

const appUrl = (import.meta.env.VITE_APP_URL || 'https://thetruelavender.com').replace(/\/$/, '');

export default function ContractSign({ contractId }: { contractId: string }) {
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [signature, setSignature] = useState('');

  useEffect(() => {
    async function loadContract() {
      try {
        const docRef = doc(db, 'contracts', contractId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setContract({ id: snapshot.id, ...data });
          if (data.clientSignature) {
            setSuccess(true);
          }
        } else {
          setError('Contract not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load contract. Check your connection or the URL.');
      } finally {
        setLoading(false);
      }
    }
    loadContract();
  }, [contractId]);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature.trim()) return;

    try {
      const docRef = doc(db, 'contracts', contractId);
      await updateDoc(docRef, {
        clientSignature: signature,
        clientSignedAt: Date.now(),
        clientIp: 'Client IP logged', // In a real environment, you'd capture IP from server or CF headers
      });

      // Trigger Email Notification (Requires Firebase 'Trigger Email' Extension)
      try {
        await addDoc(collection(db, 'mail'), {
          to: [contract.clientEmail, 'antoinettewilliams@thetruelavender.online'],
          message: {
            subject: `Contract Executed: ${contract.serviceName} with True Lavender`,
            text: `Dear ${contract.clientName},\n\nYour contract for ${contract.serviceName} has been successfully signed by both parties. You may view and print your finalized contract here: ${appUrl}/?contract=${contractId}\n\nThank you for choosing True Lavender Digital Services!`,
            html: `
              <p>Dear ${contract.clientName},</p>
              <p>Your contract for <strong>${contract.serviceName}</strong> has been successfully signed by both parties.</p>
              <p>You may view and print your finalized contract here: <a href="${appUrl}/?contract=${contractId}">View Contract</a></p>
              <p>Thank you for choosing True Lavender Digital Services!</p>
            `
          }
        });
      } catch (err) {
        console.error("Mail trigger error (extension may not be configured):", err);
        // We don't block the UI success state if email fails
      }

      setSuccess(true);
      setContract({
        ...contract,
        clientSignature: signature,
        clientSignedAt: Date.now()
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign contract.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileSignature className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 flex items-start justify-center px-6">
      <div className="max-w-3xl w-full">
        <div className="mb-10 text-center">
          <Hexagon className="w-12 h-12 text-lavender-600 mx-auto mb-4" />
          <h2 className="text-3xl font-serif text-gray-900 mb-2">Service Agreement</h2>
          <p className="text-gray-600 font-light">True Lavender • Digital Solutions</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contract Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div>
                <p className="text-gray-500 mb-1">Provider</p>
                <p className="font-semibold text-gray-900">True Lavender / Antoinette Williams</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Client</p>
                <p className="font-semibold text-gray-900">{contract.clientName}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Service</p>
                <p className="font-semibold text-gray-900">{contract.serviceName}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Amount</p>
                <p className="font-semibold text-gray-900">{contract.amount}</p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h3>
            <div className="text-gray-700 bg-white p-6 border border-gray-200 rounded-xl max-h-96 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed">
              {contract.terms}
            </div>
          </div>

          <div className="mb-10">
             <h3 className="text-xl font-bold text-gray-900 mb-4">Signatures</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 relative overflow-hidden">
                 <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-4">Provider Signature</p>
                 <div className="font-serif text-3xl text-gray-900 italic opacity-80 mb-2">
                   {contract.adminSignature}
                 </div>
                 <p className="text-xs text-lavender-600">
                   Signed on {format(new Date(contract.adminSignedAt), "MMM d, yyyy")}
                 </p>
               </div>

               <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 relative">
                 <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-4">Client Signature</p>
                 
                 {success ? (
                   <div className="pt-2">
                     <div className="font-serif text-3xl text-gray-900 italic opacity-80 mb-2">
                       {contract.clientSignature}
                     </div>
                     <p className="text-xs text-green-600 flex items-center gap-1">
                       <CheckCircle2 className="w-3 h-3" /> Signed on {format(new Date(contract.clientSignedAt), "MMM d, yyyy")}
                     </p>
                   </div>
                 ) : (
                   <form onSubmit={handleSign} className="pt-2">
                     <label className="block text-xs font-medium text-gray-700 mb-2">Type your full name to sign</label>
                     <input 
                       type="text" 
                       value={signature} 
                       onChange={e => setSignature(e.target.value)} 
                       required
                       placeholder="Full Name"
                       className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-lavender-500 mb-3"
                     />
                     <button 
                       type="submit" 
                       disabled={!signature.trim()}
                       className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                     >
                       Sign Agreement
                     </button>
                   </form>
                 )}
               </div>
             </div>
          </div>

          {success && (
            <div className="bg-lavender-50 text-lavender-900 p-6 rounded-xl border border-lavender-100 text-center">
              <CheckCircle2 className="w-8 h-8 text-lavender-600 mx-auto mb-2" />
              <h4 className="font-bold text-lg mb-1">Contract Executed</h4>
              <p className="text-sm opacity-80">This agreement is now fully signed. You may print this page for your records.</p>
              <button onClick={() => window.print()} className="mt-4 px-4 py-2 bg-white text-lavender-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors border border-lavender-200">
                Print Contract
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
