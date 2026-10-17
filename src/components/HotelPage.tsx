import React, { useState } from 'react';
import { submitEnquiry } from '../api';
import { Enquiry } from '../types';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  Phone, 
  BedDouble, 
  Sparkles, 
  Star, 
  Coffee, 
  Utensils, 
  Wifi, 
  Loader2, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface HotelPageProps {
  agencyPhone: string;
  agencyWhatsApp: string;
  onEnquirySuccess: (data: { enquiry: Enquiry; whatsappUrl: string }) => void;
  onNavigateHome: () => void;
}

const POPULAR_HOTEL_CITIES = [
  'Goa (Calangute / Baga / Panaji)',
  'Shirdi (Near Sai Baba Temple)',
  'Mumbai (Near Airport / Marine Drive)',
  'Kashmir (Srinagar Houseboat / Gulmarg)',
  'Makkah (Near Haram Sharif)',
  'Madinah (Near Prophet\'s Mosque)',
  'Jaipur (Heritage Havelis)',
  'Delhi (Connaught Place / Aerocity)',
  'Varanasi (Ghat View Hotels)',
  'Ajmer (Near Dargah Sharif)',
];

const HOTEL_CATEGORIES = [
  { id: '3-star', label: '3-Star Premium Hotel', desc: 'Comfortable AC rooms with Wi-Fi & breakfast' },
  { id: '4-star', label: '4-Star Deluxe Hotel', desc: 'Swimming pool, multi-cuisine dining, luxury' },
  { id: '5-star', label: '5-Star Luxury Resort', desc: 'World-class hospitality, spa, premier suites' },
  { id: 'budget', label: 'Verified Budget / Guest House', desc: 'Clean, safe, affordable family stays' },
  { id: 'religious', label: 'Pilgrimage Shrine Stay (Walkable to Temple/Dargah)', desc: 'Prime location near shrine entrance' },
];

const MEAL_PLANS = [
  { id: 'EP', label: 'Room Only (EP)', desc: 'Accommodation without meals' },
  { id: 'CP', label: 'Breakfast Included (CP)', desc: 'Complimentary daily morning buffet' },
  { id: 'MAP', label: 'Breakfast & Dinner (MAP)', desc: 'Two major meals included' },
  { id: 'AP', label: 'All Meals Included (AP)', desc: 'Breakfast, Lunch & Dinner included' },
];

export const HotelPage: React.FC<HotelPageProps> = ({
  agencyPhone,
  agencyWhatsApp,
  onEnquirySuccess,
  onNavigateHome,
}) => {
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [rooms, setRooms] = useState('1');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [hotelCategory, setHotelCategory] = useState('3-star');
  const [mealPlan, setMealPlan] = useState('CP');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanPhone = agencyPhone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const totalGuests = parseInt(adults || '1', 10) + parseInt(children || '0', 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!city.trim()) {
      setError('Please select or enter the hotel destination / city.');
      return;
    }
    if (!checkIn) {
      setError('Please select your check-in date.');
      return;
    }
    if (!checkOut) {
      setError('Please select your check-out date.');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out date must be after check-in date.');
      return;
    }
    if (!customerName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 10) {
      setError('Please provide a valid 10-digit mobile number for WhatsApp assistance.');
      return;
    }

    setLoading(true);
    try {
      const selectedCategoryObj = HOTEL_CATEGORIES.find((c) => c.id === hotelCategory);
      const selectedMealObj = MEAL_PLANS.find((m) => m.id === mealPlan);

      const notesArr = [
        `Rooms: ${rooms}`,
        `Guests: ${adults} Adults, ${children} Children`,
        `Category: ${selectedCategoryObj?.label || hotelCategory}`,
        `Meal Plan: ${selectedMealObj?.label || mealPlan}`,
        specialRequests ? `Special Notes: ${specialRequests}` : '',
      ].filter(Boolean);

      const res = await submitEnquiry({
        serviceType: 'hotel',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        origin: city.trim(),
        destination: city.trim(),
        travelDate: checkIn,
        returnDate: checkOut,
        passengers: totalGuests,
        rooms: parseInt(rooms, 10),
        hotelCategory: selectedCategoryObj?.label || hotelCategory,
        mealPlan: selectedMealObj?.label || mealPlan,
        specialRequests: notesArr.join(' | '),
      });

      onEnquirySuccess(res);
      window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      setError(err.message || 'Failed to submit hotel enquiry. Please try again.');
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
            <Building2 className="w-4 h-4" />
            <span>Aazam Travel Agency · Verified Hotel Stays</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Hotel Reservations Across India & Overseas
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            From budget family rooms and pilgrimage guesthouses in Shirdi or Makkah, to 5-star beachfront resorts in Goa and scenic houseboats in Kashmir.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Genuine Vouchers
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verified Cleanliness & Safe Locations
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Instant Assistance on WhatsApp
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200/90 overflow-hidden">
          
          <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-emerald-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B2545] flex items-center gap-2">
                <BedDouble className="w-6 h-6 text-emerald-600" />
                <span>Search Hotels & Request Room Quotation</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Tell us your destination, dates, and preferences. Our travel desk will check verified availability and share the best rate on WhatsApp.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white px-3 py-1.5 rounded-full border border-emerald-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Convenience Fees</span>
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

            {/* Quick Destination Pickers */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Popular Hotel Locations (Click to fill)
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_HOTEL_CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      city === c
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {c.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid 1: Destination & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Destination / City / Property
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Goa, Shirdi, Kashmir, Mumbai, Makkah"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Check-in Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Check-out Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Grid 2: Rooms & Guests */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Number of Rooms
                </label>
                <select
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500"
                >
                  <option value="1">1 Room</option>
                  <option value="2">2 Rooms</option>
                  <option value="3">3 Rooms</option>
                  <option value="4">4 Rooms</option>
                  <option value="5">5+ Rooms (Group)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Adults (12+ Years)
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500"
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                  <option value="6">6 Adults</option>
                  <option value="8">8+ Adults</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Children (0-11 Years)
                </label>
                <select
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500"
                >
                  <option value="0">0 Children</option>
                  <option value="1">1 Child</option>
                  <option value="2">2 Children</option>
                  <option value="3">3 Children</option>
                  <option value="4">4+ Children</option>
                </select>
              </div>
            </div>

            {/* Grid 3: Hotel Category & Meal Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Hotel Category / Standard
                </label>
                <select
                  value={hotelCategory}
                  onChange={(e) => setHotelCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500"
                >
                  {HOTEL_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Preferred Meal Plan
                </label>
                <select
                  value={mealPlan}
                  onChange={(e) => setMealPlan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500"
                >
                  {MEAL_PLANS.map((mp) => (
                    <option key={mp.id} value={mp.id}>
                      {mp.label} - {mp.desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Guest Contact Details */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Primary Guest Contact Details</span>
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
                    placeholder="e.g. Rajesh Kumar Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm text-slate-800 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    WhatsApp / Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">+91</span>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="98223 45678"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm text-slate-800 font-medium"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Room quotation & confirmation voucher will be sent here
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
                    placeholder="e.g. rajesh@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm text-slate-800 font-medium"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    For official hotel reservation invoice
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Special Requests / Preferences
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Near beach, high floor, early check-in at 10 AM, extra mattress, vegetarian meals"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Enquiry will register in our system and open WhatsApp for instant booking coordination.</span>
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
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking Availability...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Submit Hotel Enquiry to WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Informational Hotel Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-[#0B2545] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B2545]">Verified Properties Only</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                We partner with checked hotels and resorts that maintain high hygiene, clean bedding, and safe environments for families.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B2545]">Shrine & Temple Proximity</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Specialized in walking-distance stays near sacred shrines in Shirdi, Ajmer, Varanasi, and Holy Harams in Makkah & Madinah.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B2545]">On-Trip Assistance</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Check-in issue? Need late checkout? Our travel desk at +91 94215 56220 coordinates directly with hotel managers for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
