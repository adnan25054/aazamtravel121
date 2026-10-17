import React, { useState } from 'react';
import { submitEnquiry } from '../api';
import { Enquiry } from '../types';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  Phone, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';

interface ReligiousToursPageProps {
  agencyPhone: string;
  agencyWhatsApp: string;
  onEnquirySuccess: (data: { enquiry: Enquiry; whatsappUrl: string }) => void;
  onNavigateHome: () => void;
}

const RELIGIOUS_CIRCUITS = [
  {
    id: 'umrah',
    title: 'Sacred Umrah & Madinah Pilgrimage',
    destination: 'Makkah & Madinah (Saudi Arabia)',
    duration: '14 Nights / 15 Days',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    description: 'Complete spiritual guidance, direct flight connections, star hotels near Haram Sharif, roundtrip transfers, and experienced Ziyarat guides.',
    features: ['Hotels within 400m of Haram', 'Visa assistance & insurance', 'Daily buffet meals', 'Private AC coach transfers'],
    badge: 'International Pilgrimage',
  },
  {
    id: 'shirdi',
    title: 'Shirdi Sai Baba & Maharashtra Shrines',
    destination: 'Shirdi, Trimbakeshwar, Shani Shingnapur',
    duration: '3 Nights / 4 Days',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    description: 'Special VIP Darshan assistance, senior citizen care, temple-adjacent accommodations, and comfortable sedan/Innova transfers from Akola, Pune, or Mumbai.',
    features: ['Samadhi Mandir VIP pass guidance', 'Shani Shingnapur day excursion', 'Trimbakeshwar Jyotirlinga visit', 'Comfortable AC stay & cab'],
    badge: 'Maharashtra Pilgrimage',
  },
  {
    id: 'ajmer',
    title: 'Ajmer Sharif & Pushkar Sacred Yatra',
    destination: 'Ajmer Dargah Sharif & Pushkar Holy Lake',
    duration: '3 Nights / 4 Days',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
    description: 'Revered Ziyarat of Khwaja Moinuddin Chishti Dargah, Ana Sagar Lake, and Pushkar Brahma Temple with peaceful accommodations and guided visit.',
    features: ['Dargah Sharif Ziyarat coordination', 'Pushkar Holy Sarovar & Ghats', 'Train/Flight ticket assistance', 'Deluxe hotel near Dargah'],
    badge: 'Sufi Heritage',
  },
  {
    id: 'varanasi',
    title: 'Kashi Vishwanath & Holy Ganga Circuit',
    destination: 'Varanasi, Prayagraj & Ayodhya',
    duration: '4 Nights / 5 Days',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    description: 'Darshan of Kashi Vishwanath Jyotirlinga, morning sunrise boat ride on holy river Ganga, evening Dashashwamedh Ghat Aarti, and Triveni Sangam in Prayagraj.',
    features: ['Kashi Vishwanath Corridor Darshan', 'Ganga Aarti boat seat booking', 'Prayagraj Sangam Holy Snan transfer', 'Experienced local coordination'],
    badge: 'Sacred Jyotirlinga',
  },
  {
    id: 'vaishnodevi',
    title: 'Mata Vaishno Devi Yatra',
    destination: 'Katra, Jammu & Kashmir',
    duration: '3 Nights / 4 Days',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    description: 'Sacred journey to the holy shrine of Mata Vaishno Devi in Trikuta Hills with train tickets to SVDK Katra, battery car/helicopter advice, and hotel stay.',
    features: ['Train booking to SVDK station', 'Yatra Parchi registration assistance', 'Katra hotel with hot water & meals', 'Shiv Khori excursion option'],
    badge: 'Himalayan Shrine',
  },
];

export const ReligiousToursPage: React.FC<ReligiousToursPageProps> = ({
  agencyPhone,
  agencyWhatsApp,
  onEnquirySuccess,
  onNavigateHome,
}) => {
  const [selectedCircuit, setSelectedCircuit] = useState('umrah');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [travelMonth, setTravelMonth] = useState('Next Month');
  const [passengers, setPassengers] = useState('2');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanPhone = agencyPhone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 10) {
      setError('Please provide a valid 10-digit mobile number for WhatsApp assistance.');
      return;
    }

    const circuit = RELIGIOUS_CIRCUITS.find((c) => c.id === selectedCircuit) || RELIGIOUS_CIRCUITS[0];

    setLoading(true);
    try {
      const notes = [
        `Pilgrimage: ${circuit.title}`,
        `Destination: ${circuit.destination}`,
        `Travel Timing: ${travelMonth}`,
        specialRequests ? `Special Needs: ${specialRequests}` : '',
      ].filter(Boolean).join(' | ');

      const res = await submitEnquiry({
        serviceType: 'religious',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        origin: 'Pilgrimage Enquiry',
        destination: circuit.destination,
        travelDate: travelMonth,
        passengers: parseInt(passengers || '2', 10),
        preferredClass: circuit.title,
        specialRequests: notes,
      });

      onEnquirySuccess(res);
      window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#0B2545] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Aazam Travel Agency · Sacred Journeys</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Religious Tours & Sacred Pilgrimage Travel
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            Experience complete peace of mind on your spiritual journey. We arrange Umrah packages, Shirdi Sai Baba darshan, Ajmer Sharif Ziyarat, Kashi Vishwanath, and Mata Vaishno Devi tours with compassionate care for elders.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Hotels Walking Distance to Shrines
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Special Care for Senior Citizens & Families
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Direct WhatsApp Guidance
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-12">
        
        {/* Pilgrimage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RELIGIOUS_CIRCUITS.map((rc) => {
            const isSelected = selectedCircuit === rc.id;
            const waUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
              `Hello Aazam Travel Agency! I want details and quotation for *${rc.title}* (${rc.destination}). Please share available dates and packages.`
            )}`;

            return (
              <div
                key={rc.id}
                className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl ${
                  isSelected ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-slate-200/90'
                }`}
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={rc.image}
                    alt={rc.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/95 text-[#0B2545] text-xs font-black shadow-xs">
                      {rc.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-black drop-shadow-xs">{rc.title}</h3>
                    <p className="text-xs text-amber-300 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{rc.destination}</span>
                    </p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      {rc.description}
                    </p>

                    <div className="space-y-1.5 mb-4 pt-3 border-t border-slate-100 text-xs">
                      {rc.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCircuit(rc.id);
                        const formEl = document.getElementById('religious-enquiry-form');
                        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors text-center"
                    >
                      Fill Form
                    </button>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Desk</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dedicated Enquiry Form */}
        <div id="religious-enquiry-form" className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden scroll-mt-24">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border-b border-amber-200/70">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B2545] flex items-center gap-2">
              <Heart className="w-5 h-5 text-amber-600 fill-amber-500" />
              <span>Request Pilgrimage Guidance & Custom Itinerary</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select your sacred circuit and let us know your family size and preferred travel timing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Pilgrimage Circuit
                </label>
                <select
                  value={selectedCircuit}
                  onChange={(e) => setSelectedCircuit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 outline-none focus:border-amber-500"
                >
                  {RELIGIOUS_CIRCUITS.map((rc) => (
                    <option key={rc.id} value={rc.id}>
                      {rc.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Preferred Travel Month / Dates
                </label>
                <select
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 outline-none focus:border-amber-500"
                >
                  <option value="This Month">This Month (Urgent)</option>
                  <option value="Next Month">Next Month</option>
                  <option value="In 2-3 Months">In 2-3 Months</option>
                  <option value="Ramadan / Shawwal">Ramadan / Shawwal (Umrah Special)</option>
                  <option value="Winter Season (Nov - Feb)">Winter Season (Nov - Feb)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Total Pilgrims / Travelers
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 outline-none focus:border-amber-500"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Person' : 'Persons (Family/Group)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Mohd Farooq / Rajesh Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium"
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
                    placeholder="94056 12890"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. farooq@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Elderly Care / Wheelchair or Specific Requests
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Traveling with senior parents (age 68 & 72), need ground floor room, wheelchair assistance at airport/station"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Aazam Travel Agency · Direct coordination on WhatsApp (+91 94215 56220)
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
                >
                  Home
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-all shadow-md shadow-amber-600/20 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Submit Pilgrimage Request to WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
