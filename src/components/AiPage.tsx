import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Image as ImageIcon, 
  Search, 
  Sliders, 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  Check, 
  Copy, 
  RefreshCw, 
  Trash2, 
  Bot, 
  User, 
  Compass, 
  Train, 
  Camera, 
  ExternalLink,
  Info,
  ShieldCheck,
  Upload,
  X,
  FileText
} from 'lucide-react';
import { AiChatMessage, ReasoningEffort } from '../types';
import { sendAiChat } from '../api';

interface AiPageProps {
  agencyPhone: string;
  agencyWhatsApp: string;
  onNavigateHome: () => void;
  onBookTrainClick?: () => void;
}

const SAMPLE_IMAGE_URL = 'https://file.aiquickdraw.com/custom-page/akr/section-images/1759055072437dqlsclj2.png';

const PRESET_IMAGES = [
  {
    name: 'Sample Boardwalk Meadow',
    url: SAMPLE_IMAGE_URL,
    description: 'Scenic wooden boardwalk stretching through lush green grass',
  },
  {
    name: 'Makkah Haram Sharif',
    url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    description: 'Umrah pilgrimage holy destination',
  },
  {
    name: 'Dal Lake Houseboat, Kashmir',
    url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    description: 'Kashmir Valley tranquil water retreat',
  },
  {
    name: 'Mumbai Marine Drive',
    url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    description: 'Gateway of India & Mumbai coastal city',
  },
];

const PROMPT_SUGGESTIONS = [
  {
    title: 'Analyze Travel Photo',
    icon: Camera,
    prompt: 'What is in this image? Explain the landmark or scenery and suggest travel tips for visiting this place.',
    autoLoadImage: true,
  },
  {
    title: 'IRCTC Tatkal Booking Strategy',
    icon: Train,
    prompt: 'What are the official Indian Railways Tatkal booking timings (AC & Non-AC), master passenger list tips, and best practices to secure confirmed tickets?',
    autoLoadImage: false,
  },
  {
    title: '15-Day Umrah Pilgrimage Plan',
    icon: Compass,
    prompt: 'Create a comprehensive 15-day spiritual itinerary for Umrah visiting Makkah and Madinah, including essential Ziyarat sites and special tips for traveling with senior citizens.',
    autoLoadImage: false,
  },
  {
    title: 'Kashmir 5-Day Family Itinerary',
    icon: Compass,
    prompt: 'Design a relaxed 5-day family tour package itinerary covering Srinagar Dal Lake, Gulmarg gondola, and Pahalgam Betaab Valley with approximate expenses.',
    autoLoadImage: false,
  },
  {
    title: 'Domestic Flight Baggage Rules',
    icon: FileText,
    prompt: 'What are the current cabin baggage and check-in baggage weight allowances on IndiGo, Air India, and Akasa Air domestic flights in India?',
    autoLoadImage: false,
  },
];

export const AiPage: React.FC<AiPageProps> = ({
  agencyPhone,
  agencyWhatsApp,
  onNavigateHome,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I am your **Aazam Travel Agency AI Travel & Vision Consultant**, powered by **GPT-6 Astra**.\n\nYou can ask me anything about travel planning, train reservation rules, Tatkal strategies, Umrah itineraries, or upload a photo to identify scenic destinations and monuments!`,
      createdAt: new Date().toISOString(),
      reasoningEffort: 'medium',
      webSearchUsed: true,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [showImageInputModal, setShowImageInputModal] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'url' | 'presets'>('presets');
  const [tempUrlInput, setTempUrlInput] = useState('');
  
  const [reasoningEffort, setReasoningEffort] = useState<ReasoningEffort>('high');
  const [enableWebSearch, setEnableWebSearch] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanPhone = agencyPhone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string, imageToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    const image = imageToSend !== undefined ? imageToSend : selectedImageUrl;

    if (!text && !image) return;

    const userMessageId = `user-${Date.now()}`;
    const userMessage: AiChatMessage = {
      id: userMessageId,
      role: 'user',
      content: text || (image ? 'What is in this image?' : ''),
      imageUrl: image || undefined,
      createdAt: new Date().toISOString(),
      reasoningEffort: reasoningEffort,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setSelectedImageUrl('');
    setIsLoading(true);

    try {
      const response = await sendAiChat({
        message: text || 'Please analyze this image in detail.',
        imageUrl: image || undefined,
        reasoningEffort: reasoningEffort,
        enableWebSearch: enableWebSearch,
      });

      const assistantMessage: AiChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        createdAt: new Date().toISOString(),
        reasoningEffort: response.reasoningEffort,
        webSearchUsed: response.webSearchUsed,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('AI chat error:', err);
      const errorMessage: AiChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `**Notice:** I could not reach the AI service right now (${err.message || 'connection issue'}).\n\nFor instant travel quotations, live train availability, and ticket bookings, please reach our operations desk directly on WhatsApp at **+91 94215 56220**.`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Please upload an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImageUrl(reader.result);
        setShowImageInputModal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url: string) => {
    setSelectedImageUrl(url);
    setShowImageInputModal(false);
  };

  const handleUsePromptSuggestion = (item: typeof PROMPT_SUGGESTIONS[0]) => {
    if (item.autoLoadImage && !selectedImageUrl) {
      setSelectedImageUrl(SAMPLE_IMAGE_URL);
      handleSendMessage(item.prompt, SAMPLE_IMAGE_URL);
    } else {
      handleSendMessage(item.prompt);
    }
  };

  const formatWhatsAppBookingUrl = (content: string) => {
    const excerpt = content.slice(0, 500).replace(/[*#]/g, '');
    const text = `Hello Aazam Travel Agency! I generated this travel plan with your AI Assistant and would like to check booking availability & fares:\n\n${excerpt}...\n\nPlease assist me with tickets and quotations.`;
    return `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(text)}`;
  };

  // Helper to render basic markdown formatting
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-2.5 text-sm sm:text-base leading-relaxed text-slate-800">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }

          // Headers
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-base sm:text-lg font-bold text-[#0B2545] pt-2 pb-1 border-b border-slate-200">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-lg sm:text-xl font-black text-[#0B2545] pt-3 pb-1 border-b border-slate-300">
                {line.replace('## ', '')}
              </h3>
            );
          }
          if (line.startsWith('# ')) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-black text-[#0B2545] pt-4 pb-1">
                {line.replace('# ', '')}
              </h2>
            );
          }

          // Bullet points
          if (line.trim().startsWith('• ') || line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const rawText = line.trim().replace(/^[-*•]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: formatBoldSpans(rawText) }} />
              </div>
            );
          }

          // Numbered lists
          if (/^\d+\.\s/.test(line.trim())) {
            const match = line.trim().match(/^(\d+)\.\s+(.*)/);
            if (match) {
              return (
                <div key={idx} className="flex items-start gap-2 ml-1">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[#0B2545] font-bold text-xs shrink-0 mt-0.5">
                    {match[1]}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: formatBoldSpans(match[2]) }} />
                </div>
              );
            }
          }

          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatBoldSpans(line) }} />
          );
        })}
      </div>
    );
  };

  const formatBoldSpans = (text: string) => {
    // Replace **bold** with <strong>bold</strong>
    let res = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
    // Replace `code` with styled span
    res = res.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-pink-700 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
    return res;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#0B2545] text-white py-8 border-b border-blue-900/60 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={onNavigateHome}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-orange-400" />
                  <span>Kie AI • GPT-6 Astra Engine</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <span>Aazam AI Travel & Vision Studio</span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
                Smart multimodal itinerary planning, railway Tatkal strategies, Umrah guidance, and instant photo scene recognition backed by live web search.
              </p>
            </div>

            {/* Quick Contact CTAs */}
            <div className="flex items-center gap-2.5">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Aazam Travel Agency, I am using your AI Assistant and need live ticket booking help.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <Phone className="w-4 h-4 text-orange-300" />
                <span>{agencyPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Chat & Analysis Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar: Controls, Presets & Prompts */}
        <div className="lg:col-span-1 space-y-5">
          {/* Settings Box */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-[#0B2545]" />
              <h3 className="text-sm font-bold text-slate-900">AI Intelligence Settings</h3>
            </div>

            {/* Reasoning Effort */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reasoning Depth
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {(['low', 'medium', 'high'] as ReasoningEffort[]).map((effort) => (
                  <button
                    key={effort}
                    type="button"
                    onClick={() => setReasoningEffort(effort)}
                    className={`py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                      reasoningEffort === effort
                        ? 'bg-[#0B2545] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    {effort}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {reasoningEffort === 'high'
                  ? 'High effort: Deep multi-day planning and rigorous visual analysis.'
                  : reasoningEffort === 'medium'
                  ? 'Medium effort: Balanced depth and quick response.'
                  : 'Low effort: Fastest turnaround for quick answers.'}
              </p>
            </div>

            {/* Web Search Toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-blue-600" />
                  <span>Live Web Grounding</span>
                </span>
                <p className="text-[11px] text-slate-500">Search current railway & travel facts</p>
              </div>
              <button
                type="button"
                onClick={() => setEnableWebSearch(!enableWebSearch)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  enableWebSearch ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    enableWebSearch ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Image Vision Presets */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-orange-500" />
                <span>Multimodal Vision Test</span>
              </span>
              <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                GPT-6
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Test with the user's sample image or popular travel scenes:
            </p>

            <div className="space-y-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageUrl(preset.url);
                    handleSendMessage('What is in this image? Explain what is depicted and how a traveler could visit a similar destination.', preset.url);
                  }}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/50 transition-all flex items-center gap-3 group"
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{preset.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedImageUrl(SAMPLE_IMAGE_URL);
                  handleSendMessage('What is in this image?', SAMPLE_IMAGE_URL);
                }}
                className="w-full py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Exact User Image Test</span>
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Popular Travel Prompts
            </h3>
            <div className="space-y-2">
              {PROMPT_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUsePromptSuggestion(item)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition-colors text-xs text-slate-700 flex items-start gap-2.5"
                >
                  <item.icon className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Clear Chat */}
          <button
            onClick={() => {
              if (confirm('Clear chat history?')) {
                setMessages([
                  {
                    id: 'welcome-msg-reset',
                    role: 'assistant',
                    content: 'Chat history cleared. How can I assist you with your travels today?',
                    createdAt: new Date().toISOString(),
                  },
                ]);
              }
            }}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-500 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Conversation</span>
          </button>
        </div>

        {/* Right Main Column: Chat Area */}
        <div className="lg:col-span-3 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[640px]">
          
          {/* Chat Header Status */}
          <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#0B2545]">
                  AI Travel Consultant
                </span>
                <span className="text-[11px] text-slate-500 ml-2 hidden sm:inline">
                  (Model: <code className="text-pink-600 font-mono">gpt-6-astra</code> • Web Search: {enableWebSearch ? 'On' : 'Off'})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-blue-100 text-[#0B2545] font-bold px-2.5 py-1 rounded-full capitalize">
                Effort: {reasoningEffort}
              </span>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 max-h-[580px]">
            {messages.map((msg) => {
              const isAi = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 sm:gap-4 ${
                    isAi ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-xl bg-[#0B2545] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                      <Bot className="w-4 h-4 text-orange-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-xs ${
                      isAi
                        ? 'bg-slate-50 border border-slate-200/90 text-slate-900'
                        : 'bg-[#0B2545] text-white'
                    }`}
                  >
                    {/* Attached Image if any */}
                    {msg.imageUrl && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-slate-300/60 max-w-sm bg-black/10">
                        <img
                          src={msg.imageUrl}
                          alt="Analyzed travel visual"
                          className="w-full max-h-56 object-cover"
                        />
                      </div>
                    )}

                    {/* Text Body */}
                    {isAi ? (
                      renderFormattedContent(msg.content)
                    ) : (
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}

                    {/* Metadata & Actions for AI response */}
                    {isAi && (
                      <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          {msg.webSearchUsed && (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                              <Search className="w-3 h-3" />
                              <span>Web Grounded</span>
                            </span>
                          )}
                          <span>Aazam Travel AI</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                            title="Copy reply text"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-500" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {/* WhatsApp Booking CTA */}
                          <a
                            href={formatWhatsAppBookingUrl(msg.content)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                            title="Enquire about this plan on WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Book via WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0B2545] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-orange-400" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0B2545]">
                    <RefreshCw className="w-3.5 h-3.5 text-orange-500 animate-spin" />
                    <span>Thinking with GPT-6 Astra (effort: {reasoningEffort})...</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedImageUrl
                      ? 'Analyzing image pixels and compiling travel insights...'
                      : enableWebSearch
                      ? 'Consulting real-time travel and railway information...'
                      : 'Formulating detailed travel plan...'}
                  </p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Selected Image Chip in Composer */}
          {selectedImageUrl && (
            <div className="px-5 py-2.5 bg-orange-50/80 border-t border-orange-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedImageUrl}
                  alt="Selected thumbnail"
                  className="w-10 h-10 rounded-lg object-cover border border-orange-300"
                />
                <div>
                  <span className="text-xs font-bold text-orange-950 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-orange-600" />
                    <span>Image Attached for Vision Analysis</span>
                  </span>
                  <p className="text-[11px] text-orange-800 truncate max-w-xs sm:max-w-md">
                    {selectedImageUrl.startsWith('data:') ? 'Custom uploaded image' : selectedImageUrl}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImageUrl('')}
                className="p-1 rounded-full hover:bg-orange-200 text-orange-700"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Composer Input Area */}
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2.5"
            >
              {/* Attach Image Button */}
              <button
                type="button"
                onClick={() => setShowImageInputModal(true)}
                className={`p-3 rounded-2xl border transition-all shrink-0 ${
                  selectedImageUrl
                    ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
                title="Attach travel image or photo"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Text Input */}
              <div className="flex-1 relative">
                <textarea
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    selectedImageUrl
                      ? 'Ask questions about this image (e.g., "What is in this image?")...'
                      : 'Ask anything about train booking, Tatkal timings, Umrah packages, flight baggage...'
                  }
                  className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:border-transparent"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isLoading || (!inputText.trim() && !selectedImageUrl)}
                className={`p-3 rounded-2xl text-white font-bold transition-all shrink-0 shadow-md ${
                  isLoading || (!inputText.trim() && !selectedImageUrl)
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-[#F97316] hover:bg-orange-600 active:scale-95 shadow-orange-500/20'
                }`}
                title="Send query to AI"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>IRCTC train rules & quotations verified with Aazam Travel booking desk</span>
              </div>
              <div>
                <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for newline</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Agency Trust Banner at Bottom */}
      <section className="bg-slate-100 border-t border-slate-200/80 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                <Train className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-[#0B2545]">
                  Need Real Ticket Issuance & PNR Confirmation?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Aazam Travel Agency provides 100% online booking assistance for 7,000+ Indian Railway stations, Tatkal quotas, flights, and Umrah packages with instant WhatsApp confirmation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Aazam Travel Agency, I would like to book tickets.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={onNavigateHome}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
              >
                Explore Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Modal for Image Selection / Upload */}
      {showImageInputModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-500" />
                <h3 className="text-base font-bold text-[#0B2545]">Attach Image for AI Vision Analysis</h3>
              </div>
              <button
                onClick={() => setShowImageInputModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setImageInputMode('presets')}
                className={`py-2 rounded-lg transition-all ${
                  imageInputMode === 'presets'
                    ? 'bg-white text-[#0B2545] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sample Travel Images
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('url')}
                className={`py-2 rounded-lg transition-all ${
                  imageInputMode === 'url'
                    ? 'bg-white text-[#0B2545] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Custom URL / Upload
              </button>
            </div>

            {imageInputMode === 'presets' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Select a photo to test GPT-6 Astra visual scene and destination recognition:
                </p>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                  {PRESET_IMAGES.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectPreset(p.url)}
                      className="cursor-pointer border border-slate-200 rounded-xl overflow-hidden hover:border-orange-500 hover:shadow-md transition-all group"
                    >
                      <img
                        src={p.url}
                        alt={p.name}
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="p-2 bg-white">
                        <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Upload File */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Upload from Device
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-orange-50/30 transition-all text-slate-600"
                  >
                    <Upload className="w-6 h-6 text-orange-500" />
                    <span className="text-xs font-semibold">Click to select photo (JPG, PNG, WebP)</span>
                    <span className="text-[10px] text-slate-400">Up to 5MB</span>
                  </button>
                </div>

                {/* Paste URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Or Paste Public Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={tempUrlInput}
                      onChange={(e) => setTempUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tempUrlInput.trim()) {
                          setSelectedImageUrl(tempUrlInput.trim());
                          setShowImageInputModal(false);
                          setTempUrlInput('');
                        }
                      }}
                      className="px-4 py-2 bg-[#0B2545] text-white rounded-xl text-xs font-bold hover:bg-[#133E68]"
                    >
                      Use URL
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowImageInputModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
