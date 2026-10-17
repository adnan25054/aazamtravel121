import React, { useState } from 'react';
import { TourPackage } from '../types';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Check, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  X,
  Info,
  Calendar,
  Users
} from 'lucide-react';

interface PackagesPageProps {
  packages: TourPackage[];
  agencyPhone: string;
  agencyWhatsApp: string;
  onNavigateHome: () => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({
  packages,
  agencyPhone,
  agencyWhatsApp,
  onNavigateHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalPackage, setActiveModalPackage] = useState<TourPackage | null>(null);

  const cleanPhone = agencyPhone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const categories = ['All', 'Domestic', 'Holiday', 'Family', 'Religious'];

  const filteredPackages = packages.filter((pkg) => {
    if (selectedCategory === 'All') return true;
    return pkg.category === selectedCategory;
  });

  const getWhatsAppPackageUrl = (pkg: TourPackage) => {
    const text = encodeURIComponent(
      `Hello Aazam Travel Agency! I want information and quotation for the *${pkg.title}* (${pkg.destination}) - Duration: ${pkg.duration}. Please share detailed itinerary, inclusions and availability.`
    );
    return `https://wa.me/${cleanWhatsApp}?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#0B2545] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-400 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Aazam Travel Agency · Curated Holidays</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Domestic & Customized Holiday Tour Packages
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            Handcrafted holiday itineraries covering Kashmir, Kerala, Goa, Rajasthan, and Himachal with verified hotels, private sightseeing transfers, and dedicated trip coordination.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Customized Itineraries for Families & Couples
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Private Dedicated Chauffeur & Cab
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Direct Quotation on WhatsApp
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        
        {/* Category Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat === 'All' ? '🌟 All Packages' : cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Showing {filteredPackages.length} Curated Tours
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => {
            const waUrl = getWhatsAppPackageUrl(pkg);

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Image & Header */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#0B2545] text-xs font-black shadow-xs">
                      {pkg.category}
                    </span>
                    {pkg.featured && (
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wide shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Featured Tour
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-black tracking-tight leading-snug drop-shadow-xs">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-200 mt-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      <span>{pkg.duration}</span>
                      <span>·</span>
                      <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      <span className="truncate">{pkg.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {pkg.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1.5 mb-4 pt-3 border-t border-slate-100 text-xs">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Package Highlights:
                      </div>
                      {pkg.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Starting Price & Actions */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[11px] text-slate-600 uppercase font-bold block">Starting Estimate</span>
                        <span className="text-base font-black text-orange-600">{pkg.startingPrice}</span>
                      </div>
                      <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                        Includes Stay & Cab
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModalPackage(pkg)}
                        className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-xs font-bold text-[#0B2545] bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Itinerary</span>
                      </button>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Quote</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Package Details Modal */}
      {activeModalPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            <div className="relative h-60 w-full bg-slate-900 shrink-0">
              <img
                src={activeModalPackage.image}
                alt={activeModalPackage.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <button
                type="button"
                onClick={() => setActiveModalPackage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wide mb-2 inline-block">
                  {activeModalPackage.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">{activeModalPackage.title}</h3>
                <p className="text-sm text-slate-300 flex items-center gap-2 mt-0.5">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>{activeModalPackage.duration}</span>
                  <span>·</span>
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>{activeModalPackage.destination}</span>
                </p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Tour Overview
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeModalPackage.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Tour Highlights & Sightseeing
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeModalPackage.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium text-slate-800">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {activeModalPackage.inclusions && activeModalPackage.inclusions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Inclusions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeModalPackage.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-900">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-orange-800 font-bold block">Estimated Package Price:</span>
                  <span className="text-xl font-black text-orange-600">{activeModalPackage.startingPrice}</span>
                </div>
                <span className="text-xs text-slate-500 max-w-xs text-right">
                  Customizable based on group size, hotel tier & travel dates.
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-500">
                Personalized customization available on WhatsApp
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveModalPackage(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
                >
                  Close
                </button>
                <a
                  href={getWhatsAppPackageUrl(activeModalPackage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Request Custom Quote</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
