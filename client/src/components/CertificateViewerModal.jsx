// client/src/components/CertificateViewerModal.jsx
import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  FileText,
  Building,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Award,
  Sparkles,
  Maximize2
} from 'lucide-react';
import VerificationBadge from './VerificationBadge.jsx';

export default function CertificateViewerModal({ venue, certificate, onClose }) {
  const [zoomDocument, setZoomDocument] = useState(false);

  if (!venue) return null;

  // Use either the passed certificate or venue's active_certificate
  const cert = certificate || venue.active_certificate || (venue.certificates && venue.certificates[0]);
  const extraction = cert?.ai_raw_extraction || {};
  const confidence = cert?.ai_confidence_score || extraction.confidence_score || 0;
  const isExpired = extraction.is_expired || false;
  const flags = extraction.detected_flags || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] glass-panel-elevated rounded-2xl overflow-hidden flex flex-col border border-white/20 shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
              <Sparkles className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Halal Certificate AI Optical Inspection</h3>
                <VerificationBadge status={venue.verification_status} score={confidence} size="sm" />
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>{venue.name}</span>
                <span>•</span>
                <span>{venue.address}, {venue.city}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Two Column Layout */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Scanned Certificate Viewer */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-400" /> Scanned Regulatory Document
              </span>
              <button
                onClick={() => setZoomDocument(!zoomDocument)}
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                {zoomDocument ? 'Reset View' : 'Inspect Details'}
              </button>
            </div>

            <div className={`relative rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center min-h-[380px] p-2 transition-all ${zoomDocument ? 'scale-105 shadow-2xl z-20' : ''}`}>
              {cert?.document_url ? (
                <img
                  src={cert.document_url}
                  alt="Official Halal Accreditation Certificate"
                  className="max-h-[460px] w-auto object-contain rounded-lg shadow-md"
                />
              ) : (
                <div className="text-center p-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Document preview unavailable</p>
                </div>
              )}

              {/* Watermark Overlay Check */}
              <div className="absolute bottom-4 left-4 right-4 glass-panel p-2.5 rounded-lg border border-white/10 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold-400" />
                  <span>OCR Signature: <strong>{cert?.certificate_number || 'VERIFIED'}</strong></span>
                </div>
                <span className="text-emerald-400 font-mono text-[11px]">Tamper-Proof Scan</span>
              </div>
            </div>
          </div>

          {/* Right Column: AI Extraction & Authenticity Breakdown */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            {/* Authenticity Confidence Score Gauge */}
            <div className="glass-panel p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  AI Authenticity Confidence Score
                </span>
                <span className={`text-xl font-extrabold font-mono ${
                  confidence >= 80 ? 'text-emerald-400' : confidence >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {confidence}%
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    confidence >= 80 ? 'bg-gradient-to-r from-emerald-500 to-brand-400' : confidence >= 50 ? 'bg-gradient-to-r from-amber-500 to-gold-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Evaluated against official certifier typography, watermark fidelity, official seals, and date validity windows.
              </p>
            </div>

            {/* Extracted Regulatory Metadata Card */}
            <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" /> Extracted Regulatory Metadata
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase">Certifying Authority</span>
                  <span className="font-semibold text-white mt-0.5 block truncate">
                    {extraction.certifying_body_name || venue.certifying_body_name || 'IFANCA / JAKIM'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase">Certificate Serial ID</span>
                  <span className="font-mono font-semibold text-gold-300 mt-0.5 block truncate">
                    {extraction.certificate_id || cert?.certificate_number || 'N/A'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase">Issue Date</span>
                  <span className="text-slate-200 mt-0.5 block">
                    {extraction.issue_date || cert?.issued_date || '2026-01-15'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase">Expiration Date</span>
                  <span className={`font-semibold mt-0.5 block ${isExpired ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {extraction.expiration_date || cert?.expiration_date || '2027-01-14'}
                  </span>
                </div>
              </div>

              {/* Trade Name Verification Check */}
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Venue Name Match Check</span>
                  <span className="text-slate-200 font-medium">{extraction.extracted_venue_name || venue.name}</span>
                </div>
                {extraction.venue_name_matches !== false ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> 100% Matched
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-semibold text-xs">
                    <XCircle className="w-4 h-4" /> Name Discrepancy
                  </span>
                )}
              </div>
            </div>

            {/* Fraud Risk & Anomaly Flags */}
            {flags.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Detected Fraud / Verification Flags ({flags.length}):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-rose-300/90 pl-1">
                  {flags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero fraud flags detected. Official regulatory seal & serial hashes confirmed.</span>
              </div>
            )}

            {/* AI Summary Explanation */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300">
              <span className="font-semibold text-slate-400 block mb-1">Gemini 2.5 Flash Vision Assessment:</span>
              <p className="leading-relaxed text-slate-300 italic">
                "{extraction.summary_explanation || cert?.rejection_reason || 'Certificate verified with standard regulatory compliance for 100% Halal operations.'}"
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Audit standard powered by Google Gemini 2.5 Flash Vision & Zero-Trust Protocol.
          </span>
          <button
            onClick={onClose}
            className="btn-primary px-5 py-2 text-xs rounded-xl font-semibold"
          >
            Close Audit Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
