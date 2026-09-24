// client/src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import VenueDetail from './pages/VenueDetail.jsx';
import AIConciergePage from './pages/AIConciergePage.jsx';
import CertifiersPage from './pages/CertifiersPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MerchantDashboard from './pages/merchant/Dashboard.jsx';
import VenueEdit from './pages/merchant/VenueEdit.jsx';
import CertificateUploadPage from './pages/merchant/CertificateUploadPage.jsx';
import MenuManagement from './pages/merchant/MenuManagement.jsx';
import AuditQueuePage from './pages/admin/AuditQueuePage.jsx';
import { ShieldCheck, Heart, Sparkles, Globe, MapPin } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0d12] text-slate-100">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/venue/:id" element={<VenueDetail />} />
          <Route path="/concierge" element={<AIConciergePage />} />
          <Route path="/certifiers" element={<CertifiersPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
          <Route path="/merchant/venue/new" element={<VenueEdit />} />
          <Route path="/merchant/venue/edit" element={<VenueEdit />} />
          <Route path="/merchant/certificate/upload" element={<CertificateUploadPage />} />
          <Route path="/merchant/menu" element={<MenuManagement />} />
          <Route path="/admin/audit-queue" element={<AuditQueuePage />} />
        </Routes>
      </main>

      {/* Global Trust Footer */}
      <footer className="border-t border-white/10 bg-[#07090d] pt-12 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-gold-400 p-0.5">
                  <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-brand-400" />
                  </div>
                </div>
                <span className="font-extrabold text-white text-base">
                  Halal<span className="text-brand-400">Veritas</span> AI
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated optical verification and dietary trust engine for conscious Muslim diners worldwide. Powered by Google Gemini 2.5 Flash Vision.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider block mb-2">Explore Engine</span>
              <div><Link to="/explore" className="text-slate-400 hover:text-white transition-colors">Interactive Geospatial Map</Link></div>
              <div><Link to="/concierge" className="text-slate-400 hover:text-white transition-colors">AI Halal Concierge</Link></div>
              <div><Link to="/certifiers" className="text-slate-400 hover:text-white transition-colors">Recognized Certifiers Registry</Link></div>
              <div><Link to="/explore?is_alcohol_free=true" className="text-slate-400 hover:text-white transition-colors">Strictly Alcohol-Free Spots</Link></div>
            </div>

            {/* Establishment Owners */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider block mb-2">Merchant & Auditor</span>
              <div><Link to="/register" className="text-slate-400 hover:text-white transition-colors">Register Your Venue</Link></div>
              <div><Link to="/merchant/dashboard" className="text-slate-400 hover:text-white transition-colors">Merchant Portal</Link></div>
              <div><Link to="/merchant/certificate/upload" className="text-slate-400 hover:text-white transition-colors">Upload Halal Certificate</Link></div>
              <div><Link to="/admin/audit-queue" className="text-slate-400 hover:text-white transition-colors">Lead Auditor Queue</Link></div>
            </div>

            {/* Standards & Transparency */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider block mb-2">Zero-Trust Protocol</span>
              <p className="text-slate-400 leading-relaxed">
                All certificates undergo automated computer vision verification to cross-reference official seals, serial identifiers, and expiration dates.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-brand-500/30 text-[11px] text-brand-300 font-mono mt-1">
                <Sparkles className="w-3 h-3 text-gold-400" />
                <span>Google GenAI 2.5 Active</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 HalalVeritas AI Directory Engine. All global rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Zero-Hallucination Guardrails Active</span>
              <span>•</span>
              <span>PostgreSQL & PostGIS Spatial Core</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
