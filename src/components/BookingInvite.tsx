import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format } from 'date-fns';
import { Calendar, Hexagon, Video } from 'lucide-react';

export default function BookingInvite({ meetingId }: { meetingId: string }) {
  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  useEffect(() => {
    // Check if time is pre-selected in URL
    const params = new URLSearchParams(window.location.search);
    const timeParam = params.get('time');
    if (timeParam) {
      setSelectedTime(decodeURIComponent(timeParam));
    }
  }, []);

  useEffect(() => {
    async function loadMeeting() {
      try {
        const docRef = doc(db, 'meetings', meetingId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.status === 'confirmed') {
            setError('This meeting time has already been confirmed.');
          } else {
            setMeeting({ id: snapshot.id, ...data });
            if (data.recipientEmail) {
              setGuestEmail(data.recipientEmail);
            }
            if (data.recipientFirstName) {
              setGuestName(`${data.recipientFirstName} ${data.recipientLastName || ''}`.trim());
            }
          }
        } else {
          setError('Meeting invite not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load meeting invite. Check your connection or the URL.');
      } finally {
        setLoading(false);
      }
    }
    loadMeeting();
  }, [meetingId]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime || !guestName || !guestEmail) return;

    try {
      const docRef = doc(db, 'meetings', meetingId);
      await updateDoc(docRef, {
        status: 'confirmed',
        selectedTime,
        guestName,
        guestEmail
      });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to confirm meeting.');
    }
  };

  const downloadICS = () => {
    if (!meeting || !selectedTime) return;
    const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const startDate = new Date(selectedTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); 
    
    const dtStart = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dtEnd = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//True Lavender//Meeting Planner//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${meeting.title}`,
      `DESCRIPTION:${meeting.description ? meeting.description.replace(/\n/g, '\\n') : ''}\\n\\nMeeting Link: ${meeting.meetUrl}`,
      `LOCATION:${meeting.meetUrl}`,
      `UID:${meeting.id}@thetruelavender.online`,
      `ORGANIZER;CN="True Lavender":mailto:antoinettewilliams@thetruelavender.online`,
      'END:VEVENT',
      'END:VCALENDAR'
    ];

    const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invite-${meeting.title.replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
     return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <Hexagon className="w-12 h-12 text-lavender-600 mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-gray-900 mb-2">Meeting Confirmed!</h2>
          <p className="text-gray-600 mb-6 font-light">Your appointment has been scheduled successfully.</p>
          <div className="bg-lavender-50 p-4 rounded-xl text-left border border-lavender-100 mb-6">
            <p className="text-sm font-bold text-gray-900 mb-1">{meeting.title}</p>
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-lavender-500" />
              {format(new Date(selectedTime), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a 
              href={meeting.meetUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white p-3 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Video className="w-4 h-4" /> Save Meeting Link
            </a>
            
            <button 
              onClick={downloadICS}
              className="w-full inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 p-3 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
              title="Add this confirmed meeting to your personal calendar"
            >
              <Calendar className="w-4 h-4" /> Add to Calendar (.ics)
            </button>
            <a 
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meeting?.title || 'Meeting')}&dates=${new Date(selectedTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}/${new Date(new Date(selectedTime).getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}&details=${encodeURIComponent((meeting?.description ? meeting.description + '\n\n' : '') + 'Meeting Link: ' + meeting?.meetUrl)}&location=${encodeURIComponent(meeting?.meetUrl || '')}`}
              target="_blank" 
              rel="noreferrer" 
              className="w-full inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 p-3 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
              title="Add this confirmed meeting to your Google Calendar"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.823 16.71c-1.394 1.39-3.218 2.15-5.187 2.15H11.5v-2.074h.11c1.47 0 2.846-.575 3.882-1.614 1.036-1.036 1.603-2.41 1.603-3.877 0-1.467-.567-2.844-1.603-3.878-1.036-1.037-2.413-1.613-3.882-1.613H11.5v-2.073h.105c1.97 0 3.817.756 5.215 2.15 1.397 1.395 2.164 3.243 2.164 5.212 0 1.972-.767 3.824-2.16 5.217zm-6.26-6.666v-2.075h2.074v2.075h-2.073zm0 3.324v-2.073h2.074v2.073h-2.073z" fill="currentColor" />
              </svg>
              Add to Google Calendar
            </a>
          </div>
        </div>
      </div>
     )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 flex items-start justify-center px-6">
      <div className="max-w-xl w-full">
        <div className="mb-10 text-center">
          <Hexagon className="w-12 h-12 text-lavender-600 mx-auto mb-4" />
          <h2 className="text-3xl font-serif text-gray-900 mb-2">{meeting.title}</h2>
          <p className="text-gray-600 font-light">True Lavender • Digital Solutions</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
           {meeting.description && (
             <p className="text-gray-600 mb-8 pb-8 border-b border-gray-100">{meeting.description}</p>
           )}

           <h3 className="text-lg font-bold text-gray-900 mb-6">Select a Time</h3>
           
           <form onSubmit={handleConfirm} className="space-y-6">
             <div className="space-y-3 mb-8">
               {meeting.proposedTimes.map((time: string, idx: number) => (
                 <label 
                   key={idx} 
                   className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${selectedTime === time ? 'border-lavender-500 bg-lavender-50 ring-1 ring-lavender-500' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                 >
                   <input 
                     type="radio" 
                     name="time"
                     value={time}
                     checked={selectedTime === time}
                     onChange={(e) => setSelectedTime(e.target.value)}
                     className="w-4 h-4 text-lavender-600 focus:ring-lavender-500 border-gray-300"
                   />
                   <span className="ml-3 font-medium text-gray-900">
                     {format(new Date(time), "EEEE, MMMM do, yyyy")}
                   </span>
                   <span className="ml-auto text-gray-500 text-sm">
                     {format(new Date(time), "h:mm a")}
                   </span>
                 </label>
               ))}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                 <input 
                   type="text" 
                   value={guestName} 
                   onChange={e => setGuestName(e.target.value)} 
                   required
                   className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                 <input 
                   type="email" 
                   value={guestEmail} 
                   onChange={e => setGuestEmail(e.target.value)} 
                   required
                   className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-lavender-500"
                 />
               </div>
             </div>

             <button 
               type="submit" 
               disabled={!selectedTime}
               className="w-full py-4 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
             >
               Confirm Appointment
             </button>
           </form>
        </div>
      </div>
    </div>
  );
}
