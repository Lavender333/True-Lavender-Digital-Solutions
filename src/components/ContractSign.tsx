import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseDb';
import { format } from 'date-fns';
import { FileSignature, Hexagon, CheckCircle2 } from 'lucide-react';

const appUrl = (import.meta.env.VITE_APP_URL || 'https://thetruelavender.com').replace(/\/$/, '');

export default function ContractSign({ contractId }: { contractId: string }) {
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [signature, setSignature] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    async function loadContract() {
      try {
        const docRef = doc(db, 'contracts', contractId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setContract({ id: snapshot.id, ...data });
          setClientName(data.clientName || '');
          setClientEmail(data.clientEmail || '');
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

  const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    const point = getCanvasPoint(event);
    const context = canvas.getContext('2d');
    if (!context) return;
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const drawSignature = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const point = getCanvasPoint(event);
    context.lineWidth = 3;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#111827';
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) setSignature(canvas.toDataURL('image/png'));
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
  };

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !signature) return;

    try {
      const docRef = doc(db, 'contracts', contractId);
      await updateDoc(docRef, {
        clientSignature: signature,
        clientSignerName: clientName.trim(),
        clientSignerEmail: clientEmail.trim(),
        clientSignedAt: Date.now(),
        clientIp: 'Client IP logged', // In a real environment, you'd capture IP from server or CF headers
      });

      // Trigger Email Notification (Requires Firebase 'Trigger Email' Extension)
      try {
        await addDoc(collection(db, 'mail'), {
          to: [clientEmail.trim(), 'antoinettewilliams@thetruelavender.online'],
          message: {
            subject: `Contract Executed: ${contract.serviceName} with True Lavender`,
            text: `Dear ${clientName.trim()},\n\nYour contract for ${contract.serviceName} has been successfully signed by both parties. You may view and print your finalized contract here: ${appUrl}/?contract=${contractId}\n\nThank you for choosing True Lavender Digital Services!`,
            html: `
              <p>Dear ${clientName.trim()},</p>
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
        clientSignerName: clientName.trim(),
        clientSignerEmail: clientEmail.trim(),
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
                     <p className="font-semibold text-gray-900">{contract.clientSignerName || contract.clientName}</p>
                     <p className="text-sm text-gray-600 mb-3">{contract.clientSignerEmail || contract.clientEmail}</p>
                     {contract.clientSignature?.startsWith('data:image/') ? (
                       <img src={contract.clientSignature} alt="Client signature" className="h-20 max-w-full object-contain object-left mb-2" />
                     ) : (
                       <div className="font-serif text-3xl text-gray-900 italic opacity-80 mb-2">{contract.clientSignature}</div>
                     )}
                     <p className="text-xs text-green-600 flex items-center gap-1">
                       <CheckCircle2 className="w-3 h-3" /> Signed on {format(new Date(contract.clientSignedAt), "MMM d, yyyy")}
                     </p>
                   </div>
                 ) : (
                   <form onSubmit={handleSign} className="pt-2 space-y-3">
                     <div>
                       <label htmlFor="client-name" className="block text-xs font-medium text-gray-700 mb-2">Full name</label>
                       <input
                         id="client-name"
                         type="text"
                         value={clientName}
                         onChange={e => setClientName(e.target.value)}
                         required
                         autoComplete="name"
                         placeholder="Full Name"
                         className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-lavender-500"
                       />
                     </div>
                     <div>
                       <label htmlFor="client-email" className="block text-xs font-medium text-gray-700 mb-2">Email address</label>
                       <input
                         id="client-email"
                         type="email"
                         value={clientEmail}
                         onChange={e => setClientEmail(e.target.value)}
                         required
                         autoComplete="email"
                         placeholder="you@example.com"
                         className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-lavender-500"
                       />
                     </div>
                     <div>
                       <div className="flex items-center justify-between mb-2">
                         <label className="block text-xs font-medium text-gray-700">Draw your signature below</label>
                         <button type="button" onClick={clearSignature} className="text-xs text-lavender-700 hover:text-lavender-900">Clear</button>
                       </div>
                       <canvas
                         ref={canvasRef}
                         width={600}
                         height={180}
                         onPointerDown={startDrawing}
                         onPointerMove={drawSignature}
                         onPointerUp={stopDrawing}
                         onPointerCancel={stopDrawing}
                         onPointerLeave={stopDrawing}
                         className="w-full h-32 rounded-lg border border-gray-300 bg-white touch-none cursor-crosshair"
                         aria-label="Signature drawing area"
                       />
                     </div>
                     <button 
                       type="submit" 
                       disabled={!clientName.trim() || !clientEmail.trim() || !signature}
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
