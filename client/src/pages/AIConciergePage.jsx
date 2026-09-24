// client/src/pages/AIConciergePage.jsx
import React from 'react';
import AIChatWidget from '../components/AIChatWidget.jsx';
import { Sparkles, ShieldCheck, Database, Brain } from 'lucide-react';

export default function AIConciergePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)] flex flex-col space-y-4">
      {/* Header Info Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900/90 via-brand-950/20 to-slate-900/90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-gold-400 p-0.5 shadow-lg shadow-brand-500/20">
            <div className="w-full h-full bg-[#0a0d12] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <span>Google Gemini 2.5 Flash Halal Concierge</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-950 text-brand-300 border border-brand-500/30">
                Low-Temp Factual RAG
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive dietary advisor synthesizing live database context, certifier authorities, and prayer amenities.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-brand-400" />
            <span>Live DB Context</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>Zero Hallucination</span>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 glass-panel-elevated rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <AIChatWidget isFullScreen={true} />
      </div>
    </div>
  );
}
