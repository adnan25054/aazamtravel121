import React, { useState, useMemo } from 'react';
import { 
  Plane, 
  Building2, 
  Home, 
  Umbrella, 
  Train, 
  Bus, 
  Car, 
  Compass, 
  FileText, 
  Coins, 
  ShieldCheck, 
  ArrowRightLeft, 
  ChevronDown, 
  Calendar as CalendarIcon, 
  Users, 
  Sparkles, 
  Check, 
  ExternalLink,
  MessageSquare,
  Phone,
  Search,
  CheckCircle2,
  X,
  CreditCard,
  Gift,
  HelpCircle
} from 'lucide-react';
import { StationAutocomplete } from './StationAutocomplete';
import { CurrencyConverterCard } from './CurrencyConverterCard';
import { Enquiry } from '../types';

export type MMTTab = 
  | 'flights' 
  | 'hotels' 
  | 'homestays' 
  | 'packages' 
  | 'trains' 
  | 'buses' 
  | 'cabs' 
  | 'tours' 
  | 'visa' 
  | 'forex' 
  | 'insurance';

interface MMTHeroSearchProps {
  agencyPhone: string;
  agencyWhatsApp: string;
  onSearchSubmit: (searchData: any) => void;
  onNavigateSection: (id: string) => void;
}

const COMMON_AIRPORTS = [
  { city: 'Delhi', code: 'DEL', name: 'Delhi Airport India', fullName: 'Indira Gandhi International Airport' },
  { city: 'Bengaluru', code: 'BLR', name: 'Bengaluru International Airport', fullName: 'Kempegowda International Airport' },
  { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl', fullName: 'Mumbai Chhatrapati Shivaji Airport' },
  { city: 'Nagpur', code: 'NAG', name: 'Dr. Babasaheb Ambedkar Intl', fullName: 'Nagpur International Airport' },
  { city: 'Pune', code: 'PNQ', name: 'Pune Airport', fullName: 'Pune Lohegaon Airport' },
  { city: 'Hyderabad', code: 'HYD', name: 'Rajiv Gandhi International', fullName: 'Hyderabad Airport' },
  { city: 'Goa', code: 'GOI', name: 'Dabolim / Mopa Airport', fullName: 'Goa International Airport' },
  { city: 'Dubai', code: 'DXB', name: 'Dubai International Airport', fullName: 'Dubai Intl UAE' },
  { city: 'Jeddah', code: 'JED', name: 'King Abdulaziz Intl (Umrah)', fullName: 'Jeddah Saudi Arabia' },
  { city: 'Kolkata', code: 'CCU', name: 'Netaji Subhash Chandra Bose', fullName: 'Kolkata Airport' },
  { city: 'Chennai', code: 'MAA', name: 'Chennai International Airport', fullName: 'Chennai Airport' },
];

const SPECIAL_FARES = [
  { id: 'regular', label: 'Regular', desc: 'Regular fares' },
  { id: 'student', label: 'Student', desc: 'Extra discounts/baggage' },
  { id: 'armed', label: 'Armed Forces', desc: 'Up to ₹ 600 off' },
  { id: 'gst', label: 'Have a GST number?', desc: 'Lower cancellation charges', badge: 'new' },
  { id: 'senior', label: 'Senior Citizen', desc: 'Up to ₹ 600 off' },
  { id: 'doctor', label: 'Doctor and Nurses', desc: 'Up to ₹ 600 off' },
];

export const MMTHeroSearch: React.FC<MMTHeroSearchProps> = ({
  agencyPhone,
  agencyWhatsApp,
  onSearchSubmit,
  onNavigateSection,
}) => {
  // Active top tab
  const [activeTab, setActiveTab] = useState<MMTTab>('flights');

  // Flight states
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>('oneway');
  const [flightFrom, setFlightFrom] = useState(COMMON_AIRPORTS[0]);
  const [flightTo, setFlightTo] = useState(COMMON_AIRPORTS[1]);
  const [departureDate, setDepartureDate] = useState('2026-10-14');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState('Economy/Premium Economy');
  const [specialFare, setSpecialFare] = useState('regular');
  const [priceDropProtection, setPriceDropProtection] = useState(false);

  // Train states
  const [trainOrigin, setTrainOrigin] = useState('New Delhi (NDLS)');
  const [trainDestination, setTrainDestination] = useState('Mumbai CSMT (CSMT)');
  const [trainClass, setTrainClass] = useState('All Classes');
  const [trainQuota, setTrainQuota] = useState('General Quota (GN)');

  // Hotel states
  const [hotelCity, setHotelCity] = useState('Goa, India');
  const [hotelCheckIn, setHotelCheckIn] = useState('2026-10-14');
  const [hotelCheckOut, setHotelCheckOut] = useState('2026-10-16');
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelGuests, setHotelGuests] = useState(2);

  // Bus states
  const [busFrom, setBusFrom] = useState('Mumbai');
  const [busTo, setBusTo] = useState('Pune');
  const [busType, setBusType] = useState('AC Sleeper (2+1)');

  // Dropdown open states
  const [openFromPicker, setOpenFromPicker] = useState(false);
  const [openToPicker, setOpenToPicker] = useState(false);
  const [openTravellersPicker, setOpenTravellersPicker] = useState(false);

  // Search results modal state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');

  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  // Formatted date string for display (MakeMyTrip style: "14 Oct'26", "Wednesday")
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return { dayNum: 'Tap', monthYear: 'to add date', dayName: 'Bigger discounts' };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { dayNum: '14', monthYear: "Oct'26", dayName: 'Wednesday' };
    
    const dayNum = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const yearShort = String(d.getFullYear()).slice(-2);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[d.getDay()];

    return {
      dayNum: String(dayNum),
      monthYear: `${month}'${yearShort}`,
      dayName: dayName,
    };
  };

  const depFormatted = formatDateDisplay(departureDate);
  const retFormatted = formatDateDisplay(returnDate);

  // Swap From and To
  const handleSwapAirports = () => {
    const temp = flightFrom;
    setFlightFrom(flightTo);
    setFlightTo(temp);
  };

  const handleSwapStations = () => {
    const temp = trainOrigin;
    setTrainOrigin(trainDestination);
    setTrainDestination(temp);
  };

  // Main search action
  const handleMainSearch = () => {
    setSearchModalOpen(true);
  };

  // Final WhatsApp confirmation
  const handleConfirmSearchBooking = (e: React.FormEvent) => {
    e.preventDefault();
    let serviceTitle = 'Flight Booking';
    let detailsText = '';

    if (activeTab === 'flights') {
      serviceTitle = 'Flight Booking';
      detailsText = 
        `✈️ *Trip:* ${tripType === 'roundtrip' ? 'Round Trip' : 'One Way'}\n` +
        `🛫 *From:* ${flightFrom.city} (${flightFrom.code})\n` +
        `🛬 *To:* ${flightTo.city} (${flightTo.code})\n` +
        `📅 *Departure:* ${departureDate}\n` +
        (returnDate ? `📅 *Return:* ${returnDate}\n` : '') +
        `👥 *Travellers:* ${adults} Adults${children ? `, ${children} Children` : ''}\n` +
        `💺 *Class:* ${cabinClass}\n` +
        `🏷️ *Fare:* ${SPECIAL_FARES.find(f => f.id === specialFare)?.label || 'Regular'}\n` +
        (priceDropProtection ? `🛡️ *Price Drop Protection:* Requested\n` : '');
    } else if (activeTab === 'trains') {
      serviceTitle = 'IRCTC Train Booking';
      detailsText = 
        `🚆 *Service:* Indian Railways Train Ticket\n` +
        `🚉 *Boarding:* ${trainOrigin}\n` +
        `🏁 *Destination:* ${trainDestination}\n` +
        `📅 *Travel Date:* ${departureDate}\n` +
        `💺 *Class:* ${trainClass}\n` +
        `🎫 *Quota:* ${trainQuota}\n` +
        `👥 *Passengers:* ${adults} Person(s)\n`;
    } else if (activeTab === 'hotels') {
      serviceTitle = 'Hotel Reservation';
      detailsText = 
        `🏨 *Destination/Hotel:* ${hotelCity}\n` +
        `📅 *Check-in:* ${hotelCheckIn}\n` +
        `📅 *Check-out:* ${hotelCheckOut}\n` +
        `🚪 *Rooms:* ${hotelRooms} Room(s)\n` +
        `👥 *Guests:* ${hotelGuests} Guests\n`;
    } else if (activeTab === 'buses') {
      serviceTitle = 'Bus Ticket Booking';
      detailsText = 
        `🚌 *Route:* ${busFrom} ➔ ${busTo}\n` +
        `📅 *Travel Date:* ${departureDate}\n` +
        `💺 *Bus Type:* ${busType}\n` +
        `👥 *Passengers:* ${adults} Person(s)\n`;
    } else {
      serviceTitle = `${activeTab.toUpperCase()} Travel Request`;
      detailsText = `Service: ${activeTab} assistance with Aazam Travel Agency desk.\n`;
    }

    const message = 
      `*AAZAM TRAVEL AGENCY · ${serviceTitle.toUpperCase()}*\n\n` +
      `Hello, I would like to book tickets through Aazam Travel Agency.\n\n` +
      `👤 *Passenger Name:* ${passengerName || 'Traveller'}\n` +
      `📞 *Phone Number:* ${passengerPhone || agencyPhone}\n\n` +
      detailsText +
      `\nPlease check live availability and share booking details with me on WhatsApp!`;

    const waUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    setSearchModalOpen(false);

    if (onSearchSubmit) {
      onSearchSubmit({
        service: activeTab,
        passengerName,
        passengerPhone,
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-cover bg-center select-none" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=85')`,
    }}>
      {/* Dark gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#061426]/75 via-[#061426]/60 to-[#061426]/85" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-3 sm:px-6 pt-7 sm:pt-10 pb-16">
        
        {/* =========================================================================
            1. TOP CATEGORY TABS BAR (MakeMyTrip 11 Iconic Nav Categories)
           ========================================================================= */}
        <div className="w-full bg-white rounded-t-2xl shadow-xl border-b border-slate-100 px-2 sm:px-6 py-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[780px] sm:min-w-0 sm:justify-around">
            
            {/* 1. Flights */}
            <button
              onClick={() => setActiveTab('flights')}
              className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-3 text-center transition-all relative group ${
                activeTab === 'flights' ? 'text-[#008cff]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plane className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${activeTab === 'flights' ? 'text-[#008cff]' : 'text-slate-500'}`} />
              <span className={`text-[11px] sm:text-xs font-semibold ${activeTab === 'flights' ? 'font-bold' : ''}`}>Flights</span>
              {activeTab === 'flights' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#008cff] rounded-full" />
              )}
            </button>

            {/* 2. Hotels */}
            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-3 text-center transition-all relative group ${
                activeTab === 'hotels' ? 'text-[#008cff]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${activeTab === 'hotels' ? 'text-[#008cff]' : 'text-slate-500'}`} />
              <span className={`text-[11px] sm:text-xs font-semibold ${activeTab === 'hotels' ? 'font-bold' : ''}`}>Hotels</span>
              {activeTab === 'hotels' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#008cff] rounded-full" />
              )}
            </button>

            {/* 3. Homestays & Villas */}
            <button
              onClick={() => setActiveTab('homestays')}
              className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-3 text-center transition-all relative group ${
                activeTab === 'homestays' ? 'text-[#008cff]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${activeTab === 'homestays' ? 'text-[#008cff]' : 'text-slate-500'}`} />
              <span className={`text-[11px] sm:text-xs font-semibold ${activeTab === 'homestays' ? 'font-bold' : ''}`}>Homestays & Villas</span>
              {activeTab === 'homestays' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#008cff] rounded-full" />
              )}
            </button>

            {/* 4. Holiday Packages */}
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-3 text-center transition-all relative group ${
                activeTab === 'packages' ? 'text-[#008cff]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Umbrella className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${activeTab === 'packages' ? 'text-[#008cff]' : 'text-slate-500'}`} />
              <span className={`text-[11px] sm:text-xs font-semibold ${activeTab === 'packages' ? 'font-bold' : ''}`}>Holiday Packages</span>
              {activeTab === 'packages' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#008cff] rounded-full" />
              )}
            </button>

            {/* 5. Trains (IRCTC Pan-India) */}
            <button
              onClick={() => setActiveTab('trains')}
              className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-3 text-center transition-all relative group ${
                activeTab === 'trains' ? 'text-[#008cff]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Train className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${activeTab === 'trains' ? 'text-[#008cff]' : 'text-slate-500'}`} />
              <span className={`text-[11px] sm:text-xs font-semibold ${activeTab === 'trains' ? 'font-bold' : ''}`}>Trains</span>
              {activeTab === 'trains' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#008cff] rounded-full" />
              )}
            </button>

            {/* 6. Buses */}
            <button
              onClick={() => setActiveTab('buses')}
              className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-3 text-center transition-all relative group ${
                activeTab === 'buses' ? 'text-[#008cff]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bus className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${activeTab === 'buses' ? 'text-[#008cff]' : 'text-slate-500'}`} />
              <span className={`text-[11px] sm:text-xs font-semibold ${activeTab === 'buses' ? 'font-bold' : ''}`}>Buses</span>
              {activeTab === 'buses' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#008cff] rounded-full" />
              )}
            </button>

            {/* 7. Cabs */}
            <button
              onClick={() => setActiveTab('cabs')}
              className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-3 text-center transition-all relative group ${
                activeTab === 'cabs' ? 'text-[#008cff]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${activeTab === 'cabs' ? 'text-[#008cff]' : 'text-slate-500'}`} />
              <span className={`text-[11px] sm:text-xs font-semibold ${activeTab === 'cabs' ? 'font-bold' : ''}`}>Cabs</span>
              {activeTab === 'cabs' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#008cff] rounded-full" />
              )}
            </button>

            {/* 8. Tours & Attractions */}
            <button
              onClick={() => setActiveTab('tours')}
              className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-3 text-center transition-all relative group ${
                activeTab === 'tours' ? 'text-[#008cff]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${activeTab === 'tours' ? 'text-[#008cff]' : 'text-slate-500'}`} />
              <span className={`text-[11px] sm:text-xs font-semibold ${activeTab === 'tours' ? 'font-bold' : ''}`}>Tours & Attractions</span>
              {activeTab === 'tours' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#008cff] rounded-full" />
              )}
            </button>

            {/* 9. Visa */}
            <button
              onClick={() => setActiveTab('visa')}
              className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-3 text-center transition-all relative group ${
                activeTab === 'visa' ? 'text-[#008cff]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${activeTab === 'visa' ? 'text-[#008cff]' : 'text-slate-500'}`} />
              <span className={`text-[11px] sm:text-xs font-semibold ${activeTab === 'visa' ? 'font-bold' : ''}`}>Visa</span>
              {activeTab === 'visa' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#008cff] rounded-full" />
              )}
            </button>

            {/* 10. Forex Card & Currency */}
            <button
              onClick={() => setActiveTab('forex')}
              className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-3 text-center transition-all relative group ${
                activeTab === 'forex' ? 'text-[#008cff]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coins className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${activeTab === 'forex' ? 'text-[#008cff]' : 'text-slate-500'}`} />
              <span className={`text-[11px] sm:text-xs font-semibold ${activeTab === 'forex' ? 'font-bold' : ''}`}>Forex Card & Currency</span>
              {activeTab === 'forex' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#008cff] rounded-full" />
              )}
            </button>

            {/* 11. Travel Insurance */}
            <button
              onClick={() => setActiveTab('insurance')}
              className={`flex flex-col items-center justify-center py-2 px-2.5 sm:px-3 text-center transition-all relative group ${
                activeTab === 'insurance' ? 'text-[#008cff]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${activeTab === 'insurance' ? 'text-[#008cff]' : 'text-slate-500'}`} />
              <span className={`text-[11px] sm:text-xs font-semibold ${activeTab === 'insurance' ? 'font-bold' : ''}`}>Travel Insurance</span>
              {activeTab === 'insurance' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#008cff] rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. MAIN BOOKING CARD CONTAINER (MakeMyTrip White Elevated Card)
           ========================================================================= */}
        <div className="relative bg-white rounded-b-2xl shadow-2xl p-4 sm:p-6 pb-12 transition-all">
          
          {/* Trip Type Radio Buttons & Secondary Top Badges (Flights / General) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 text-xs font-medium text-slate-700">
            
            {/* Trip Type Radio options */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  checked={tripType === 'oneway'}
                  onChange={() => setTripType('oneway')}
                  className="w-4 h-4 text-[#008cff] focus:ring-[#008cff]"
                />
                <span className={tripType === 'oneway' ? 'font-bold text-slate-900' : ''}>One Way</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  checked={tripType === 'roundtrip'}
                  onChange={() => setTripType('roundtrip')}
                  className="w-4 h-4 text-[#008cff] focus:ring-[#008cff]"
                />
                <span className={tripType === 'roundtrip' ? 'font-bold text-slate-900' : ''}>Round Trip</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  checked={tripType === 'multicity'}
                  onChange={() => setTripType('multicity')}
                  className="w-4 h-4 text-[#008cff] focus:ring-[#008cff]"
                />
                <span className={tripType === 'multicity' ? 'font-bold text-slate-900' : ''}>Multi City</span>
              </label>
            </div>

            {/* Right Tagline & Connection Badge */}
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500 hidden lg:inline">
                {activeTab === 'flights' ? 'Book International and Domestic Flights' : 'Pan-India 100% Online Verified Bookings'}
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                <span className="px-1 py-0.2 bg-emerald-600 text-white rounded text-[9px] uppercase font-bold">NEW</span>
                <span>Flight + Cab connection : Reach anywhere in India</span>
                <span className="text-emerald-600 font-bold">ⓘ</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              3. THE SIGNATURE 5-SEGMENTED SEARCH ROW (MakeMyTrip Grid Layout)
             ========================================================================= */}
          {activeTab === 'flights' && (
            <div className="relative grid grid-cols-1 md:grid-cols-12 rounded-xl border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white shadow-xs">
              
              {/* BOX 1: FROM */}
              <div 
                onClick={() => setOpenFromPicker(!openFromPicker)}
                className="md:col-span-3 p-3.5 sm:p-4 hover:bg-blue-50/40 cursor-pointer transition-colors relative"
              >
                <span className="block text-xs text-slate-500 font-medium mb-1">From</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {flightFrom.city}
                </div>
                <div className="text-xs text-slate-500 truncate mt-1">
                  {flightFrom.code}, {flightFrom.name}
                </div>

                {/* From Airport Picker Popover */}
                {openFromPicker && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fade-in"
                  >
                    <div className="text-xs font-bold text-slate-600 mb-2 px-1">Select Departure City / Airport</div>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {COMMON_AIRPORTS.map((air) => (
                        <button
                          key={air.code}
                          type="button"
                          onClick={() => {
                            setFlightFrom(air);
                            setOpenFromPicker(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl flex items-center justify-between text-xs hover:bg-blue-50 transition-colors ${
                            flightFrom.code === air.code ? 'bg-blue-50/80 font-bold text-blue-600' : 'text-slate-800'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-sm block">{air.city}</span>
                            <span className="text-[11px] text-slate-500">{air.name}</span>
                          </div>
                          <span className="text-xs font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{air.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* FLOATING SWAP BUTTON BETWEEN FROM & TO */}
              <button
                type="button"
                onClick={handleSwapAirports}
                className="absolute left-1/2 md:left-[24.5%] top-[10%] md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-[#008cff] hover:scale-110 active:rotate-180 transition-all hover:bg-blue-50"
                title="Swap origin and destination"
                aria-label="Swap origin and destination"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>

              {/* BOX 2: TO */}
              <div 
                onClick={() => setOpenToPicker(!openToPicker)}
                className="md:col-span-3 p-3.5 sm:p-4 hover:bg-blue-50/40 cursor-pointer transition-colors relative"
              >
                <span className="block text-xs text-slate-500 font-medium mb-1">To</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {flightTo.city}
                </div>
                <div className="text-xs text-slate-500 truncate mt-1">
                  {flightTo.code}, {flightTo.name}
                </div>

                {/* To Airport Picker Popover */}
                {openToPicker && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fade-in"
                  >
                    <div className="text-xs font-bold text-slate-600 mb-2 px-1">Select Destination City / Airport</div>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {COMMON_AIRPORTS.map((air) => (
                        <button
                          key={air.code}
                          type="button"
                          onClick={() => {
                            setFlightTo(air);
                            setOpenToPicker(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl flex items-center justify-between text-xs hover:bg-blue-50 transition-colors ${
                            flightTo.code === air.code ? 'bg-blue-50/80 font-bold text-blue-600' : 'text-slate-800'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-sm block">{air.city}</span>
                            <span className="text-[11px] text-slate-500">{air.name}</span>
                          </div>
                          <span className="text-xs font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{air.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* BOX 3: DEPARTURE */}
              <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-blue-50/40 transition-colors relative">
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-1">
                  <span>Departure</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#008cff]" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
                    {depFormatted.dayNum}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-800 leading-none">
                    {depFormatted.monthYear}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {depFormatted.dayName}
                </div>
                {/* Hidden input to pick date */}
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>

              {/* BOX 4: RETURN */}
              <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-blue-50/40 transition-colors relative">
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-1">
                  <span>Return</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#008cff]" />
                </div>
                {returnDate ? (
                  <>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
                        {retFormatted.dayNum}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-800 leading-none">
                        {retFormatted.monthYear}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {retFormatted.dayName}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Tap to add a return date for bigger discounts
                  </div>
                )}
                {/* Hidden input to pick return date */}
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => {
                    setReturnDate(e.target.value);
                    if (tripType === 'oneway') setTripType('roundtrip');
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>

              {/* BOX 5: TRAVELLERS & CABIN CLASS */}
              <div 
                onClick={() => setOpenTravellersPicker(!openTravellersPicker)}
                className="md:col-span-2 p-3.5 sm:p-4 hover:bg-blue-50/40 cursor-pointer transition-colors relative"
              >
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-1">
                  <span>Travellers & Class</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#008cff]" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
                  {adults + children + infants} <span className="text-sm font-bold text-slate-700">Adult</span>
                </div>
                <div className="text-xs text-slate-500 truncate mt-1">
                  {cabinClass}
                </div>

                {/* Travellers Popover */}
                {openTravellersPicker && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fade-in text-xs space-y-3"
                  >
                    <div className="font-bold text-slate-800 text-sm">Select Travellers & Cabin Class</div>
                    
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">Adults (12+ yrs)</div>
                        <div className="text-[11px] text-slate-400">on the day of travel</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-7 h-7 rounded-lg border border-slate-300 font-bold"
                        >-</button>
                        <span className="w-6 text-center font-bold text-sm">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(adults + 1)}
                          className="w-7 h-7 rounded-lg border border-slate-300 font-bold"
                        >+</button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">Children (2-12 yrs)</div>
                        <div className="text-[11px] text-slate-400">with seat</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-7 h-7 rounded-lg border border-slate-300 font-bold"
                        >-</button>
                        <span className="w-6 text-center font-bold text-sm">{children}</span>
                        <button
                          type="button"
                          onClick={() => setChildren(children + 1)}
                          className="w-7 h-7 rounded-lg border border-slate-300 font-bold"
                        >+</button>
                      </div>
                    </div>

                    {/* Class Selector */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="font-bold text-slate-700 mb-1.5">Choose Cabin Class</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['Economy/Premium Economy', 'Premium Economy', 'Business', 'First Class'].map((cls) => (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => setCabinClass(cls)}
                            className={`p-2 rounded-xl text-left border text-[11px] transition-colors ${
                              cabinClass === cls ? 'border-[#008cff] bg-blue-50 text-[#008cff] font-bold' : 'border-slate-200 text-slate-700'
                            }`}
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenTravellersPicker(false)}
                      className="w-full py-2 bg-[#008cff] text-white font-bold rounded-xl text-center"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              IF TAB === TRAINS (IRCTC Indian Railways 5-Segmented View)
             ========================================================================= */}
          {activeTab === 'trains' && (
            <div className="relative grid grid-cols-1 md:grid-cols-12 rounded-xl border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white shadow-xs">
              {/* TRAIN ORIGIN */}
              <div className="md:col-span-3 p-3.5 sm:p-4 hover:bg-orange-50/40 transition-colors">
                <span className="block text-xs text-slate-500 font-medium mb-1">From Station</span>
                <StationAutocomplete
                  value={trainOrigin}
                  onChange={(val) => setTrainOrigin(val)}
                  placeholder="Boarding station name or code"
                />
              </div>

              {/* SWAP BUTTON */}
              <button
                type="button"
                onClick={handleSwapStations}
                className="absolute left-1/2 md:left-[24.5%] top-[10%] md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-orange-500 hover:scale-110 active:rotate-180 transition-all hover:bg-orange-50"
                title="Swap stations"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>

              {/* TRAIN DESTINATION */}
              <div className="md:col-span-3 p-3.5 sm:p-4 hover:bg-orange-50/40 transition-colors">
                <span className="block text-xs text-slate-500 font-medium mb-1">To Station</span>
                <StationAutocomplete
                  value={trainDestination}
                  onChange={(val) => setTrainDestination(val)}
                  placeholder="Destination station name or code"
                />
              </div>

              {/* TRAVEL DATE */}
              <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-orange-50/40 transition-colors relative">
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-1">
                  <span>Travel Date</span>
                  <ChevronDown className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
                    {depFormatted.dayNum}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-800 leading-none">
                    {depFormatted.monthYear}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{depFormatted.dayName}</div>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>

              {/* CLASS */}
              <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-orange-50/40 transition-colors">
                <label className="block text-xs text-slate-500 font-medium mb-1">Class</label>
                <select
                  value={trainClass}
                  onChange={(e) => setTrainClass(e.target.value)}
                  className="w-full font-bold text-sm text-slate-900 bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="All Classes">All Classes</option>
                  <option value="3A - AC 3 Tier">3A - AC 3 Tier</option>
                  <option value="2A - AC 2 Tier">2A - AC 2 Tier</option>
                  <option value="1A - AC First Class">1A - AC First Class</option>
                  <option value="SL - Sleeper Class">SL - Sleeper Class</option>
                  <option value="CC - AC Chair Car">CC - AC Chair Car</option>
                </select>
                <div className="text-xs text-slate-400 mt-1">Confirmed E-Ticket Desk</div>
              </div>

              {/* QUOTA */}
              <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-orange-50/40 transition-colors">
                <label className="block text-xs text-slate-500 font-medium mb-1">Quota</label>
                <select
                  value={trainQuota}
                  onChange={(e) => setTrainQuota(e.target.value)}
                  className="w-full font-bold text-sm text-slate-900 bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="General Quota (GN)">General Quota (GN)</option>
                  <option value="Tatkal Quota (CK)">Tatkal Quota (CK)</option>
                  <option value="Premium Tatkal (PT)">Premium Tatkal (PT)</option>
                  <option value="Ladies Quota (LD)">Ladies Quota (LD)</option>
                  <option value="Senior Citizen (SS)">Senior Citizen (SS)</option>
                </select>
                <div className="text-xs text-slate-400 mt-1">Tatkal & Urgent Assistance</div>
              </div>
            </div>
          )}

          {/* =========================================================================
              IF TAB === HOTELS (Hotels 5-Segmented View)
             ========================================================================= */}
          {activeTab === 'hotels' && (
            <div className="relative grid grid-cols-1 md:grid-cols-12 rounded-xl border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white shadow-xs">
              <div className="md:col-span-4 p-3.5 sm:p-4 hover:bg-emerald-50/40 transition-colors">
                <span className="block text-xs text-slate-500 font-medium mb-1">City, Location or Property</span>
                <input
                  type="text"
                  value={hotelCity}
                  onChange={(e) => setHotelCity(e.target.value)}
                  placeholder="e.g. Goa, Mumbai, Dubai, Jaipur"
                  className="w-full text-xl sm:text-2xl font-bold text-slate-900 bg-transparent border-none outline-none"
                />
                <div className="text-xs text-slate-500 mt-1">India or Worldwide Stays</div>
              </div>

              <div className="md:col-span-3 p-3.5 sm:p-4 hover:bg-emerald-50/40 transition-colors relative">
                <span className="block text-xs text-slate-500 font-medium mb-1">Check-in</span>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{hotelCheckIn}</div>
                <input
                  type="date"
                  value={hotelCheckIn}
                  onChange={(e) => setHotelCheckIn(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>

              <div className="md:col-span-3 p-3.5 sm:p-4 hover:bg-emerald-50/40 transition-colors relative">
                <span className="block text-xs text-slate-500 font-medium mb-1">Check-out</span>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{hotelCheckOut}</div>
                <input
                  type="date"
                  value={hotelCheckOut}
                  onChange={(e) => setHotelCheckOut(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>

              <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-emerald-50/40 transition-colors">
                <span className="block text-xs text-slate-500 font-medium mb-1">Rooms & Guests</span>
                <div className="text-base sm:text-lg font-bold text-slate-900">
                  {hotelRooms} Room, {hotelGuests} Guests
                </div>
                <div className="text-xs text-slate-400 mt-1">Verified Hotels & Resorts</div>
              </div>
            </div>
          )}

          {/* =========================================================================
              IF TAB === BUSES
             ========================================================================= */}
          {activeTab === 'buses' && (
            <div className="relative grid grid-cols-1 md:grid-cols-12 rounded-xl border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white shadow-xs">
              <div className="md:col-span-4 p-3.5 sm:p-4 hover:bg-blue-50/40 transition-colors">
                <span className="block text-xs text-slate-500 font-medium mb-1">From City</span>
                <input
                  type="text"
                  value={busFrom}
                  onChange={(e) => setBusFrom(e.target.value)}
                  className="w-full text-xl sm:text-2xl font-bold text-slate-900 bg-transparent border-none outline-none"
                />
              </div>
              <div className="md:col-span-4 p-3.5 sm:p-4 hover:bg-blue-50/40 transition-colors">
                <span className="block text-xs text-slate-500 font-medium mb-1">To City</span>
                <input
                  type="text"
                  value={busTo}
                  onChange={(e) => setBusTo(e.target.value)}
                  className="w-full text-xl sm:text-2xl font-bold text-slate-900 bg-transparent border-none outline-none"
                />
              </div>
              <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-blue-50/40 transition-colors relative">
                <span className="block text-xs text-slate-500 font-medium mb-1">Travel Date</span>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{depFormatted.dayNum} {depFormatted.monthYear}</div>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
              <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-blue-50/40 transition-colors">
                <span className="block text-xs text-slate-500 font-medium mb-1">Bus Type</span>
                <div className="text-sm font-bold text-slate-900">{busType}</div>
              </div>
            </div>
          )}

          {/* =========================================================================
              IF TAB === FOREX CARD & CURRENCY
             ========================================================================= */}
          {activeTab === 'forex' && (
            <div className="p-2 sm:p-4">
              <CurrencyConverterCard
                agencyPhone={agencyPhone}
                agencyWhatsApp={agencyWhatsApp}
                onNavigateForexContact={() => onNavigateSection('currency')}
              />
            </div>
          )}

          {/* =========================================================================
              IF TAB === PACKAGES, HOMESTAYS, CABS, TOURS, VISA, INSURANCE
             ========================================================================= */}
          {['homestays', 'packages', 'cabs', 'tours', 'visa', 'insurance'].includes(activeTab) && (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="max-w-xl mx-auto space-y-3">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {activeTab.toUpperCase()} · Instant WhatsApp Travel Desk
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Customized {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Booking Service
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tell our dedicated travel consultants your destination and requirements. We offer 100% online booking assistance with instant vouchers and zero hassle.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={handleMainSearch}
                    className="px-6 py-2.5 bg-[#008cff] text-white font-bold rounded-xl text-xs hover:bg-[#0073e6]"
                  >
                    Inquire on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              4. SPECIAL FARE SELECTOR ROW (MakeMyTrip Signature Pills)
             ========================================================================= */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
            <span className="font-bold text-slate-800 shrink-0">Select a special fare:</span>
            
            {SPECIAL_FARES.map((fare) => {
              const isSelected = specialFare === fare.id;
              return (
                <button
                  key={fare.id}
                  type="button"
                  onClick={() => setSpecialFare(fare.id)}
                  className={`px-3 py-1.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-[#008cff] bg-blue-50/70 text-[#008cff] shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1 font-bold text-[11px] leading-tight">
                    <span>{fare.label}</span>
                    {fare.badge && (
                      <span className="px-1 py-0.2 bg-purple-600 text-white rounded text-[8px] uppercase font-black">
                        {fare.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-none">
                    {fare.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* =========================================================================
              5. PRICE DROP PROTECTION & FLIGHT STATUS ROW
             ========================================================================= */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={priceDropProtection}
                onChange={(e) => setPriceDropProtection(e.target.checked)}
                className="w-4 h-4 rounded text-[#008cff] focus:ring-[#008cff] border-slate-300"
              />
              <span className="font-bold text-slate-800">Add Price Drop Protection</span>
              <span className="text-slate-500">Price drops, we'll refund the difference.</span>
              <span className="text-[#008cff] font-semibold underline text-[11px]">View Details</span>
              <span className="w-4 h-4 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-[10px]">
                ₹
              </span>
            </label>

            <button
              type="button"
              onClick={() => onNavigateSection('flight-booking')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors self-start sm:self-auto"
            >
              <span>📰</span>
              <span>Flight Status</span>
            </button>
          </div>

          {/* =========================================================================
              6. OVERLAPPING BLUE "SEARCH" BUTTON (Center Bottom Overlap)
             ========================================================================= */}
          <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 z-30">
            <button
              type="button"
              onClick={handleMainSearch}
              className="px-14 sm:px-20 py-3.5 rounded-full bg-gradient-to-r from-[#008cff] via-[#007ee6] to-[#0073e6] hover:from-[#007fe6] hover:to-[#0066cc] text-white font-extrabold text-lg sm:text-xl tracking-wider shadow-xl shadow-blue-500/35 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase flex items-center gap-2 border-2 border-white/50"
            >
              <span>SEARCH</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            7. EXPLORE MORE & BOTTOM FLOATING PILL BAR (MakeMyTrip Shortcuts)
           ========================================================================= */}
        <div className="mt-12 text-center space-y-4">
          
          {/* Explore More link */}
          <div className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-sky-300 cursor-pointer drop-shadow-md">
            <span>Explore More</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>

          {/* Bottom Floating Pill Bar matching screenshot */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-2 sm:p-2.5 flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-xs text-slate-700 font-semibold">
            
            {/* 1. Where2Go */}
            <button 
              onClick={() => onNavigateSection('packages')}
              className="flex items-center gap-2 hover:text-[#008cff] transition-colors px-2 py-1"
            >
              <Compass className="w-4 h-4 text-[#008cff]" />
              <span>Where2Go</span>
            </button>

            {/* 2. How2Go (new) */}
            <button 
              onClick={() => onNavigateSection('train-booking')}
              className="flex items-center gap-2 hover:text-[#008cff] transition-colors px-2 py-1"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🗺️</span>
                <span>How2Go</span>
                <span className="px-1 py-0.2 rounded bg-purple-600 text-white text-[9px] uppercase font-bold">new</span>
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:inline">Find routes to anywhere</span>
            </button>

            {/* 3. Aazam Travel ICICI Credit Card */}
            <div className="flex items-center gap-2 px-2 py-1 border-x border-slate-200">
              <CreditCard className="w-4 h-4 text-orange-500" />
              <div className="text-left leading-tight">
                <span className="block font-bold text-[11px] text-slate-800">Aazam ICICI Travel Card</span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">Never-expiring rewards & big benefits</span>
              </div>
            </div>

            {/* 4. MICE */}
            <button 
              onClick={() => onNavigateSection('contact')}
              className="flex items-center gap-2 hover:text-[#008cff] transition-colors px-2 py-1"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <div className="text-left leading-tight">
                <span className="block font-bold text-[11px]">MICE</span>
                <span className="text-[9px] text-slate-400 hidden md:inline">Offsites, Events & Meetings</span>
              </div>
            </button>

            {/* 5. Gift Cards */}
            <button 
              onClick={() => onNavigateSection('contact')}
              className="flex items-center gap-2 hover:text-[#008cff] transition-colors px-2 py-1"
            >
              <Gift className="w-4 h-4 text-pink-500" />
              <span>Gift Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          8. INSTANT BOOKING MODAL (TRIGGERED ON CLICKING "SEARCH")
         ========================================================================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#008cff] to-[#0073e6] p-5 text-white flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  Instant WhatsApp Booking Desk
                </span>
                <h3 className="text-xl font-black mt-1">
                  Ready to Book: {activeTab === 'flights' ? `${flightFrom.city} ➔ ${flightTo.city}` : activeTab === 'trains' ? `${trainOrigin} ➔ ${trainDestination}` : activeTab.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleConfirmSearchBooking} className="p-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Your Search Details Are Pre-Filled</span>
                </div>
                <div className="text-slate-600">
                  {activeTab === 'flights' && (
                    <span>Flight: {flightFrom.city} to {flightTo.city} · Date: {departureDate} · Travellers: {adults} Adult · {cabinClass}</span>
                  )}
                  {activeTab === 'trains' && (
                    <span>Train: {trainOrigin} to {trainDestination} · Date: {departureDate} · Class: {trainClass} · Quota: {trainQuota}</span>
                  )}
                  {activeTab === 'hotels' && (
                    <span>Hotel: {hotelCity} · Check-in: {hotelCheckIn} · {hotelRooms} Room</span>
                  )}
                  {activeTab === 'buses' && (
                    <span>Bus: {busFrom} to {busTo} · Date: {departureDate}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lead Passenger Name *
                </label>
                <input
                  type="text"
                  required
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="e.g. Mohd Aazam"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#008cff] focus:ring-2 focus:ring-blue-100 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Contact Mobile *
                </label>
                <input
                  type="tel"
                  required
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  placeholder="e.g. 9421556220"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#008cff] focus:ring-2 focus:ring-blue-100 text-sm outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Your official confirmed ticket & confirmation will be sent on this number.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Request & Finalize on WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Pan-India Online Desk · Instant IRCTC & Airline E-Tickets</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
