import React, { useState } from 'react';
import { DestinationItem } from '../types';
import { 
  MapPin, 
  Calendar, 
  Compass, 
  Sparkles, 
  MessageSquare, 
  ChevronRight, 
  Check, 
  X, 
  Info,
  ArrowRight
} from 'lucide-react';

interface PopularDestinationsSectionProps {
  destinations: DestinationItem[];
  agencyWhatsApp: string;
  onSelectDestinationForBooking?: (dest: DestinationItem) => void;
}

export const PopularDestinationsSection: React.FC<PopularDestinationsSectionProps> = ({
  destinations,
  agencyWhatsApp,
  onSelectDestinationForBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalDest, setActiveModalDest] = useState<DestinationItem | null>(null);

  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const categories = ['All', 'Spiritual', 'Beach', 'Hill Station', 'Metropolitan', 'Heritage'];

  const filteredDestinations = destinations.filter((d) => {
    if (selectedCategory === 'All') return true;
    return d.category === selectedCategory;
  });

  const getWhatsAppUrl = (dest: DestinationItem) => {
    const text = encodeURIComponent(
      `Hello Aazam Travel Agency! I want to plan a travel itinerary for *${dest.name}* (${dest.state}). Please share train/flight ticket booking assistance, hotel options, and package details.`
    );
    return `https://wa.me/${cleanWhatsApp}?text=${text}`;
  };

  return (
    <section id="popular-destinations" className="py-20 bg-slate-50/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Compass className="w-3.5 h-3.5 text-orange-600" />
            <span>Curated Travel Inspirations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Popular Destinations Across India
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From the bustling streets of Mumbai and Delhi to serene Kashmir valleys and holy pilgrimages in Shirdi, Ajmer, and Varanasi. We provide complete booking assistance for your journey.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0B2545] text-white shadow-md shadow-blue-900/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? '🌟 All Destinations' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid (3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => {
            const waUrl = getWhatsAppUrl(dest);

            return (
              <div
                key={dest.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                {/* Image & Badges */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dest.image}
                    alt={`${dest.name}, ${dest.state} - Aazam Travel Agency`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#0B2545] text-xs font-black shadow-xs">
                      {dest.category}
                    </span>
                    {dest.featured && (
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wide shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Top Pick
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-black tracking-tight leading-tight drop-shadow-xs">
                      {dest.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span>{dest.state}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-orange-300 truncate">{dest.tag}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {dest.description}
                    </p>

                    {/* Highlights bullets */}
                    <div className="space-y-1.5 mb-4 pt-3 border-t border-slate-100 text-xs text-slate-700">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Key Attractions:
                      </div>
                      {dest.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Best Time & Popular For */}
                    <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        <span><strong>Best Season:</strong> {dest.bestTimeToVisit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalDest(dest)}
                      className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-xs font-bold text-[#0B2545] bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Plan</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All & Custom Trip Note */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-base font-bold text-[#0B2545]">
              Looking for a custom destination or specific station?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Aazam Travel Agency books train tickets to all 7,000+ Indian Railway stations and flights to any domestic or international airport.
            </p>
          </div>
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
              'Hello Aazam Travel Agency! I need travel booking assistance for a custom destination. Please help with options.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 shrink-0"
          >
            <span>Ask Travel Desk on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Destination Modal Details */}
      {activeModalDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Image Header */}
            <div className="relative h-64 w-full bg-slate-900 shrink-0">
              <img
                src={activeModalDest.image}
                alt={activeModalDest.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <button
                type="button"
                onClick={() => setActiveModalDest(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wide mb-2 inline-block">
                  {activeModalDest.category}
                </span>
                <h3 className="text-3xl font-black">{activeModalDest.name}</h3>
                <p className="text-sm text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>{activeModalDest.state}</span> · <span>{activeModalDest.tag}</span>
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  About Destination
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeModalDest.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Top Attractions & Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeModalDest.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium text-slate-800">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-orange-50/60 p-4 rounded-2xl border border-orange-200/70">
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">Best Time to Visit:</span>
                  <span className="text-slate-600">{activeModalDest.bestTimeToVisit}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">Ideal For:</span>
                  <span className="text-slate-600">{activeModalDest.popularFor}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-500 text-center sm:text-left">
                Direct booking assistance & itinerary planning via WhatsApp
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveModalDest(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
                >
                  Close
                </button>
                <a
                  href={getWhatsAppUrl(activeModalDest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enquire for {activeModalDest.name}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
