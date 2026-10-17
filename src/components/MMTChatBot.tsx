import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Train, Plane, Phone } from 'lucide-react';

interface MMTChatBotProps {
  agencyWhatsApp: string;
  agencyPhone: string;
}

export const MMTChatBot: React.FC<MMTChatBotProps> = ({
  agencyWhatsApp,
  agencyPhone,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const handleSend = (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    const message = `Hello Aazam Travel Agency! I have a travel query: "${q.trim()}". Please assist me.`;
    window.open(`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating "Ask me anything" Pill Button matching screenshot */}
      {!isOpen && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white shadow-2xl border border-slate-200/90 text-slate-800 hover:shadow-blue-500/20 hover:border-blue-400 transition-all hover:scale-105 active:scale-95 group"
          >
            <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#008cff]">
              Ask me anything
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:rotate-12 transition-transform">
              <Bot className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      )}

      {/* Chat Popover */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#008cff] to-[#0073e6] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight">Aazam Travel Assistant</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-blue-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online · Instant WhatsApp Help</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="p-4 space-y-3 text-xs">
            <p className="text-slate-600 text-xs">
              Hi! How can our travel booking team assist you today?
            </p>

            <div className="space-y-1.5">
              {[
                'Book Tatkal train ticket confirmation',
                'Check flight fare from Delhi to Bengaluru',
                'Foreign currency exchange / Forex card rates',
                'Umrah pilgrimage flight & hotel package',
              ].map((sugg) => (
                <button
                  key={sugg}
                  onClick={() => handleSend(sugg)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-[#008cff] border border-slate-200 text-slate-700 text-[11px] font-medium transition-colors flex items-center justify-between group"
                >
                  <span>{sugg}</span>
                  <span className="text-[#008cff] opacity-0 group-hover:opacity-100 font-bold">➔</span>
                </button>
              ))}
            </div>

            {/* Input field */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#008cff]"
              />
              <button
                onClick={() => handleSend()}
                className="p-2 rounded-xl bg-[#008cff] hover:bg-[#0073e6] text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
