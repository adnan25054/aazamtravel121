import React, { useState } from 'react';
import { submitEnquiry } from '../api';
import { Enquiry } from '../types';
import { 
  Bus, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  Phone, 
  ArrowRightLeft, 
  Clock, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  Armchair,
  ArrowRight
} from 'lucide-react';

interface BusPageProps {
  agencyPhone: string;
  agencyWhatsApp: string;
  onEnquirySuccess: (data: { enquiry: Enquiry; whatsappUrl: string }) => void;
  onNavigateHome: () => void;
}

const POPULAR_BUS_ROUTES = [
  { from: 'Akola', to: 'Pune', time: 'Overnight (8-9 hrs)', type: 'AC Sleeper 2+1' },
  { from: 'Akola', to: 'Mumbai', time: 'Overnight (10-11 hrs)', type: 'Multi-Axle Volvo Sleeper' },
  { from: 'Akola', to: 'Nagpur', time: 'Day & Night (4-5 hrs)', type: 'AC Seater / Sleeper' },
  { from: 'Akola', to: 'Indore', time: 'Overnight (7-8 hrs)', type: 'AC Sleeper' },
  { from: 'Akola', to: 'Hyderabad', time: 'Overnight (9-10 hrs)', type: 'Multi-Axle AC Sleeper' },
  { from: 'Akola', to: 'Shirdi', time: 'Morning & Night (6-7 hrs)', type: 'AC Sleeper' },
  { from: 'Pune', to: 'Goa', time: 'Overnight (9-10 hrs)', type: 'Luxury Volvo Sleeper' },
  { from: 'Mumbai', to: 'Ahmedabad', time: 'Overnight (9-10 hrs)', type: 'AC Sleeper 2+1' },
];

const BUS_TYPES = [
  'AC Sleeper 2+1 (Most Popular)',
  'Multi-Axle Volvo AC Sleeper',
  'BharatBenz Luxury AC Sleeper',
  'Non-AC Sleeper',
  'AC Pushback Seater',
  'Intercity Express Seater',
];

export const BusPage: React.FC<BusPageProps> = ({
  agencyPhone,
  agencyWhatsApp,
  onEnquirySuccess,
  onNavigateHome,
}) => {
  const [origin, setOrigin] = useState('Akola');
  const [destination, setDestination] = useState('Pune');
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState('1');
  const [busType, setBusType] = useState('AC Sleeper 2+1 (Most Popular)');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanPhone = agencyPhone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const swapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!origin.trim()) {
      setError('Please enter your departure city / boarding point.');
      return;
    }
    if (!destination.trim()) {
      setError('Please enter your destination city.');
      return;
    }
    if (!travelDate) {
      setError('Please choose your journey date.');
      return;
    }
    if (!customerName.trim()) {
      setError('Please provide your full passenger name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 10) {
      setError('Please provide a valid 10-digit mobile number for WhatsApp booking assistance.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitEnquiry({
        serviceType: 'bus',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        origin: origin.trim(),
        destination: destination.trim(),
        travelDate,
        passengers: parseInt(passengers || '1', 10),
        preferredClass: busType,
        specialRequests: specialRequests ? `Bus Type: ${busType} | Notes: ${specialRequests}` : `Bus Type: ${busType}`,
      });

      onEnquirySuccess(res);
      window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      setError(err.message || 'Failed to submit bus enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#0B2545] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
            <Bus className="w-4 h-4" />
            <span>Aazam Travel Agency · Intercity Bus Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            AC Sleeper & Volvo Bus Ticket Booking
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            Convenient overnight bus tickets from Akola to Pune, Mumbai, Nagpur, Indore, Hyderabad, Shirdi, and top bus routes across Maharashtra and India.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Operators (VRL, Hans, Purple, Konduskar, Sharma)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Lower & Upper Berth Choices
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Immediate E-Ticket on WhatsApp
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200/90 overflow-hidden">
          
          <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-indigo-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B2545] flex items-center gap-2">
                <Bus className="w-6 h-6 text-indigo-600" />
                <span>Search Bus Routes & Seat Booking Assistance</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Submit your route and boarding preferences. Our booking team verifies live berth availability with authorized bus operators.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-800 bg-white px-3 py-1.5 rounded-full border border-indigo-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Instant Seat Confirmation</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Please check your entries:</span>
                  <span className="text-xs">{error}</span>
                </div>
              </div>
            )}

            {/* Popular Route Fast Selectors */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Popular Daily Routes (Click to fill route)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {POPULAR_BUS_ROUTES.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setOrigin(r.from);
                      setDestination(r.to);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      origin === r.from && destination === r.to
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{r.from} ➔ {r.to}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{r.type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Origin, Destination & Swap */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
              
              <div className="md:col-span-5 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Departure City / Boarding Point
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-indigo-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Akola, Pune, Mumbai, Nagpur"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-1 flex justify-center pt-5">
                <button
                  type="button"
                  onClick={swapCities}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 transition-colors"
                  title="Swap Origin and Destination"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="md:col-span-5 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Destination City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-indigo-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Pune, Mumbai, Indore, Hyderabad"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Date, Passengers, Bus Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Journey Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-indigo-600 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Number of Passengers
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-indigo-600 absolute left-3.5 top-3.5" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm font-semibold text-slate-800"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Coach / Sleeper Preference
                </label>
                <select
                  value={busType}
                  onChange={(e) => setBusType(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm font-semibold text-slate-800"
                >
                  {BUS_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Passenger Contact Info */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Primary Passenger Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sanjay Wankhede"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm text-slate-800 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">+91</span>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="98901 23456"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm text-slate-800 font-medium"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Bus boarding pass, seat number & live bus tracking link will be sent here
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. sanjay@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Seat Preference / Boarding Stop Notes
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Lower single sleeper berth preferred, boarding at Akola Railway Station / Nimwadi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant dispatch to WhatsApp. You will review and finalize with our booking team.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
                >
                  Back to Home
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking Bus Seats...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Submit Bus Enquiry to WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Informative Bus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
              <Armchair className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B2545]">Lower & Single Berth Guarantee</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Traveling alone or with elderly family? We prioritize comfortable single lower berths in modern multi-axle coaches.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B2545]">Convenient Boarding Points</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Pickups at major highway checkpoints and bus depots across Akola, Pune, Mumbai, and Nagpur.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B2545]">24/7 Journey Support</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Need driver contact or live bus tracking coordinates? Call our Akola travel desk directly at +91 94215 56220.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
