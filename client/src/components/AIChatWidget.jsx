// client/src/components/AIChatWidget.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Bot,
  User,
  MapPin,
  Star,
  WineOff,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import api from '../services/api.js';

export default function AIChatWidget({ selectedVenueId = null, initialMessage = null, isFullScreen = false }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Salam & Welcome! I am your AI Halal Dining & Dietary Advisor, powered by Google Gemini 2.5 Flash. Ask me anything about certified dining spots, cross-contamination controls, alcohol-free kitchens, or specific certifiers like JAKIM, IFANCA, HMC, and MUIS.",
      recommendedVenues: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "Strictly alcohol-free Halal steakhouse with IFANCA certification",
    "Cozy Halal cafe with female prayer space and artisanal coffee",
    "Hand-slaughtered Texas BBQ brisket smokehouse",
    "Are there any 100% Halal bakeries with zero animal rennet?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.ai.chat({
        message: textToSend,
        selected_venue_id: selectedVenueId,
        chat_history: messages.map((m) => ({ role: m.role, content: m.content }))
      });

      if (res.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: res.reply,
            recommendedVenues: res.recommendedVenues || []
          }
        ]);
      } else {
        throw new Error(res.error || 'AI Advisor unavailable.');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Apologies, I encountered an issue querying the database: ${err.message}. Please try again shortly.`,
          recommendedVenues: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col ${isFullScreen ? 'h-full' : 'h-[600px] glass-panel-elevated rounded-2xl border border-white/10 overflow-hidden'}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-gold-400 p-0.5 shadow-md shadow-brand-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-gold-400" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>AI Halal Concierge</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-950 text-brand-300 border border-brand-500/30">
                Gemini 2.5 Flash
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Zero-hallucination real-time verified database context</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([{
            role: 'assistant',
            content: "Welcome! Ask me any dietary question or for specific Halal dining recommendations.",
            recommendedVenues: []
          }])}
          title="Reset Conversation"
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-800 text-gold-400 border border-white/10'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'glass-panel text-slate-200 border border-white/10 rounded-tl-none space-y-2'
              }`}>
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Embedded Recommended Venue Cards */}
                {msg.recommendedVenues && msg.recommendedVenues.length > 0 && (
                  <div className="pt-2 border-t border-white/10 mt-2 space-y-2">
                    <span className="text-[10px] font-bold text-brand-300 uppercase tracking-wider block">
                      Recommended Verified Establishments:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.recommendedVenues.map((v) => (
                        <Link
                          key={v.id}
                          to={`/venue/${v.id}`}
                          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-brand-500/20 hover:border-brand-500/50 transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-white text-xs group-hover:text-brand-300 transition-colors truncate">
                                {v.name}
                              </span>
                              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-brand-400" />
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{v.city} • {v.venue_type}</span>
                          </div>

                          <div className="mt-2 flex items-center justify-between text-[10px]">
                            <span className="text-emerald-400 font-medium">
                              {v.certifying_body || 'Verified Cert'}
                            </span>
                            {v.is_alcohol_free && (
                              <span className="text-rose-300 flex items-center gap-0.5">
                                <WineOff className="w-2.5 h-2.5" /> Alcohol-Free
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-800 text-gold-400 flex items-center justify-center flex-shrink-0 text-xs border border-white/10">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-none border border-white/10 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>Analyzing live Halal regulatory database with Gemini 2.5 Flash...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-white/5 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 transition-colors whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-white/10 bg-slate-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Halal status, prayer spaces, cross-contamination..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary p-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
