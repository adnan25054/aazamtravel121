import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Tag, Sparkles } from 'lucide-react';

interface OfferItem {
  id: string;
  category: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  linkText: string;
  actionUrl?: string;
  tag?: string;
}

const OFFERS_DATA: OfferItem[] = [
  {
    id: 'luxe-flight',
    category: 'Flights',
    badge: 'INTL FLIGHTS',
    title: 'Experience Indulgence with Up to 25% OFF*',
    description: 'on Business Class & Premium Economy Flights & Luxury Stays.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    linkText: 'EXPLORE NOW',
    tag: 'LUXE TRAVEL TUESDAYS',
  },
  {
    id: 'luxe-hotel',
    category: 'Hotels',
    badge: 'INTL HOTELS',
    title: 'Experience Indulgence with Up to 25% OFF*',
    description: 'on Luxury Hotels & Premium Villas worldwide.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    linkText: 'EXPLORE NOW',
    tag: 'LUXE RESORTS',
  },
  {
    id: 'bank-icici',
    category: 'Bank Offers',
    badge: 'DOM FLIGHTS',
    title: 'Grab Flat 15% OFF on Flights & Hotels*',
    description: 'with ICICI Bank, HDFC and major card partners.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    linkText: 'BOOK NOW',
    tag: 'ESCAPE LONG WEEKEND',
  },
  {
    id: 'train-irctc',
    category: 'Trains',
    badge: 'IRCTC DESK',
    title: 'Tatkal & Regular Train Tickets Delivered on WhatsApp',
    description: 'Pan-India 100% online booking across all 7,000+ railway stations.',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80',
    linkText: 'BOOK TRAIN',
    tag: 'CONFIRMED E-TICKET',
  },
  {
    id: 'forex-umrah',
    category: 'Forex',
    badge: 'TRAVEL FOREX',
    title: 'Zero Hidden Markup on Saudi Riyal & Dubai Dirhams',
    description: 'Best live currency conversion rates and Multi-Currency Forex cards.',
    image: 'https://images.unsplash.com/photo-1578895101407-28d1df034636?auto=format&fit=crop&w=600&q=80',
    linkText: 'CALCULATE RATES',
    tag: 'LIVE FOREX DESK',
  },
  {
    id: 'holiday-kashmir',
    category: 'Holidays',
    badge: 'HOLIDAYS',
    title: 'Up to 30% OFF on Kashmir, Kerala & Goa Tour Packages',
    description: 'Customized itineraries with flights, hotels, cabs, and sightseeing included.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    linkText: 'VIEW PACKAGES',
    tag: 'SEASON SPECIAL',
  },
];

const TABS = [
  'All Offers',
  'Bank Offers',
  'Flights',
  'Hotels',
  'Holidays',
  'Trains',
  'Cabs',
  'Bus',
  'Forex',
];

interface MMTOffersSectionProps {
  agencyWhatsApp: string;
  onNavigateSection: (id: string) => void;
}

export const MMTOffersSection: React.FC<MMTOffersSectionProps> = ({
  agencyWhatsApp,
  onNavigateSection,
}) => {
  const [activeTab, setActiveTab] = useState('All Offers');
  const [startIndex, setStartIndex] = useState(0);

  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const filteredOffers = activeTab === 'All Offers' 
    ? OFFERS_DATA 
    : OFFERS_DATA.filter(o => o.category.toLowerCase().includes(activeTab.toLowerCase()) || activeTab.toLowerCase().includes(o.category.toLowerCase()));

  const handleNext = () => {
    if (startIndex + 3 < filteredOffers.length) {
      setStartIndex(startIndex + 1);
    } else {
      setStartIndex(0);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleOfferClick = (offer: OfferItem) => {
    if (offer.category === 'Trains') {
      onNavigateSection('train-booking');
    } else if (offer.category === 'Flights') {
      onNavigateSection('flight-booking');
    } else if (offer.category === 'Forex') {
      onNavigateSection('currency');
    } else if (offer.category === 'Holidays') {
      onNavigateSection('packages');
    } else {
      const waText = encodeURIComponent(`Hello Aazam Travel Agency! I want to avail the special offer: ${offer.title}`);
      window.open(`https://wa.me/${cleanWhatsApp}?text=${waText}`, '_blank');
    }
  };

  return (
    <section className="py-12 bg-white border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        
        {/* Section Header: Title, Category Tabs & Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          {/* Left: Bold "Offers" heading + Horizontal tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight shrink-0">
              Offers
            </h2>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 sm:gap-2">
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setStartIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all relative ${
                      isActive
                        ? 'text-[#008cff] font-bold border-b-2 border-[#008cff]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: "VIEW ALL ➔" and Circular slider buttons */}
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            <button
              onClick={() => {
                const waText = encodeURIComponent('Hello Aazam Travel Agency, please share the latest discounts and promo offers on flights, trains, and hotels.');
                window.open(`https://wa.me/${cleanWhatsApp}?text=${waText}`, '_blank');
              }}
              className="text-xs font-extrabold text-[#008cff] hover:text-[#0073e6] flex items-center gap-1 group uppercase tracking-wider"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Offer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="Next Offer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Offers Cards Grid - MakeMyTrip Signature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOffers.slice(startIndex, startIndex + 3).map((offer) => (
            <div
              key={offer.id}
              onClick={() => handleOfferClick(offer)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer p-4 flex gap-4 group"
            >
              {/* Left Image Thumbnail */}
              <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-xl overflow-hidden shrink-0 relative bg-slate-100">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {offer.tag && (
                  <div className="absolute top-1.5 left-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded text-center uppercase tracking-wider">
                    {offer.tag}
                  </div>
                )}
              </div>

              {/* Right Content */}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-1">
                    <span className="text-slate-600 uppercase tracking-wider">{offer.badge}</span>
                    <span className="text-slate-400">T&C'S APPLY</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#008cff] transition-colors leading-snug line-clamp-2">
                    {offer.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-black text-[#008cff] group-hover:underline tracking-wide uppercase">
                    {offer.linkText}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#008cff] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
