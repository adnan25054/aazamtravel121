import React, { useState } from 'react';
import { WebsiteSettings } from '../types';
import { submitEnquiry } from '../api';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ContactPageProps {
  settings: WebsiteSettings;
  onNavigateHome: () => void;
  onEnquirySuccess?: (data: any) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  settings,
  onNavigateHome,
  onEnquirySuccess,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('train');
  const [message, setMessage] = useState('');
  // Spam protection math puzzle
  const [mathA] = useState(() => Math.floor(Math.random() * 5) + 3);
  const [mathB] = useState(() => Math.floor(Math.random() * 4) + 2);
  const [mathAnswer, setMathAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (parseInt(mathAnswer, 10) !== mathA + mathB) {
      setError(`Spam protection: ${mathA} + ${mathB} equals ${mathA + mathB}. Please solve the simple calculation.`);
      return;
    }

    setLoading(true);
    try {
      const res = await submitEnquiry({
        serviceType: service as any,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        origin: 'Direct Contact Message',
        destination: 'Akola Travel Desk',
        travelDate: 'Contact Enquiry',
        passengers: 1,
        specialRequests: message.trim() || undefined,
      });

      setSuccess(true);
      if (onEnquirySuccess) onEnquirySuccess(res);
      window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try calling directly or WhatsApp us.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#0B2545] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
            <MapPin className="w-4 h-4" />
            <span>Akola, Maharashtra, India · Travel Operations Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Contact Aazam Travel Agency
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            Need prompt railway ticket booking, flight assistance, bus seats, hotel rooms, or holiday tour planning? Our travel desk is right here to assist you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Agency Identity Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-1">
                  Official Travel Agency Office
                </span>
                <h2 className="text-2xl font-black text-[#0B2545]">
                  {settings.businessName}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Travel Agent in Akola, Maharashtra (Serving Pan-India Travelers)
                </p>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Office Address</span>
                    <span className="font-semibold text-slate-900 leading-relaxed block mt-0.5">
                      {settings.address}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">{settings.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Direct Phone & WhatsApp</span>
                    <div className="flex items-center gap-3 mt-1">
                      <a 
                        href={`tel:${cleanPhone}`} 
                        className="font-bold text-base text-[#0B2545] hover:text-orange-600 transition-colors"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Email Correspondence</span>
                    <a 
                      href={`mailto:${settings.email}`} 
                      className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block mt-0.5"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Business Support Hours</span>
                    <span className="font-semibold text-slate-900 block mt-0.5">
                      {settings.officeHours}
                    </span>
                    <span className="text-[11px] text-slate-500 block">WhatsApp enquiries answered round-the-clock</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Tap to Call & WhatsApp Chat */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B2545] hover:bg-[#133E68] text-white font-bold text-xs transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Tap to Call</span>
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    'Hello Aazam Travel Agency! I want to enquire about travel booking assistance.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Google Maps / Location Embed Section */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/90 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Akola Location Map</span>
                </div>
                <span className="text-[11px] text-slate-500">Maharashtra 444001</span>
              </div>

              <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <iframe
                  title="Aazam Travel Agency Akola Location"
                  src="https://maps.google.com/maps?q=Station+Road,+Akola,+Maharashtra+444001&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-3 text-center">
                Centrally situated on Station Road, Akola. Inquiries and ticket bookings processed 100% online across India.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Enquiry Form with Anti-Spam protection */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
              
              <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50/70 via-slate-50 to-blue-50/70 border-b border-slate-200">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B2545] flex items-center gap-2">
                  <Send className="w-5 h-5 text-orange-600" />
                  <span>Send a Travel Enquiry</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Fill in your travel query below. Submitting will register your request and immediately open WhatsApp to finalize your quotation.
                </p>
              </div>

              {success ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0B2545]">Enquiry Received!</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Your enquiry has been submitted. Our Akola travel desk has received the notification and is ready on WhatsApp.
                  </p>
                  <div className="pt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSuccess(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Send Another Query
                    </button>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Open WhatsApp Desk</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                  
                  {error && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mohd Aazam Shaikh"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-medium"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">+91</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="94215 56220"
                          className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-medium"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. client@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Primary Travel Service Interested In
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 outline-none focus:border-orange-500"
                      >
                        <option value="train">🚆 Train Ticket Booking (IRCTC / Tatkal)</option>
                        <option value="flight">✈️ Flight Ticket Booking (Domestic / Intl)</option>
                        <option value="bus">🚌 AC Sleeper Bus Booking</option>
                        <option value="hotel">🏨 Hotel Reservations</option>
                        <option value="tour">🌴 Holiday Tour Package</option>
                        <option value="religious">🕌 Religious Tour & Pilgrimage (Umrah / Shirdi / Ajmer)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Journey Details / Message / Question
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please share travel route, preferred dates, number of persons, or any specific requirements..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-medium resize-none"
                    />
                  </div>

                  {/* Spam Protection Math Verification */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-700">
                      <span className="font-bold block text-slate-800">Spam Protection Verification:</span>
                      <span>What is <strong>{mathA} + {mathB}</strong>?</span>
                    </div>

                    <input
                      type="number"
                      value={mathAnswer}
                      onChange={(e) => setMathAnswer(e.target.value)}
                      placeholder="Answer"
                      className="w-24 px-3 py-2 rounded-xl border border-slate-300 text-center font-bold text-sm outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Protected with anti-spam check. No unsolicited messages.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Enquiry & Open WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
