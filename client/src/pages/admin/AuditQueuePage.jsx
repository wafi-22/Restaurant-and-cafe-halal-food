// client/src/pages/admin/AuditQueuePage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import VerificationBadge from '../../components/VerificationBadge.jsx';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ExternalLink,
  Building,
  UserCheck
} from 'lucide-react';

export default function AuditQueuePage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  async function fetchQueue() {
    setLoading(true);
    try {
      const res = await api.certificates.getAuditQueue();
      if (res.audit_queue) setQueue(res.audit_queue);
    } catch (err) {
      console.error('Failed to load audit queue:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAuditDecision = async (certId, isApproved) => {
    setProcessing(true);
    try {
      await api.certificates.adminVerify(certId, {
        is_active: isApproved,
        rejection_reason: reviewNote || (isApproved ? 'Approved by Auditor' : 'Rejected after inspection')
      });
      alert(isApproved ? 'Certificate approved!' : 'Certificate marked as rejected.');
      setSelectedItem(null);
      setReviewNote('');
      fetchQueue();
    } catch (err) {
      alert(err.message || 'Audit action failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            Lead Compliance Auditor Portal
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">Certificate Audit & Verification Queue</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manual human review queue for certificates with confidence &lt; 80%, expired dates, or detected fraud flags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
            {queue.length} Pending Review
          </span>
        </div>
      </div>

      {/* Main Grid: Queue Table + Side-by-Side Review Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue Items */}
        <div className="lg:col-span-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Flagged & Pending Submissions
          </h2>

          {loading ? (
            <div className="glass-panel p-8 text-center text-xs text-slate-400">Loading queue...</div>
          ) : queue.length === 0 ? (
            <div className="glass-panel p-8 text-center text-xs text-emerald-400">
              ✓ All certificate audits are up to date! Zero pending reviews.
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`glass-panel p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedItem?.id === item.id
                      ? 'border-brand-500 bg-brand-950/20'
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{item.venue_name}</h4>
                      <span className="text-xs text-slate-400">{item.venue_city || 'New York'}</span>
                    </div>

                    <VerificationBadge
                      status={item.is_active ? 'AI_VERIFIED' : 'PENDING_HUMAN_REVIEW'}
                      score={item.ai_confidence_score}
                      size="sm"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Certifier: <strong className="text-white">{item.certifying_body_name || 'HFCAA'}</strong></span>
                    <span className="font-mono text-amber-300">Score: {item.ai_confidence_score}%</span>
                  </div>

                  {item.ai_raw_extraction?.detected_flags?.length > 0 && (
                    <div className="mt-2 text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded-lg border border-rose-500/20">
                      Flag: {item.ai_raw_extraction.detected_flags[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Inspection & Decision Console */}
        <div className="lg:col-span-6">
          {selectedItem ? (
            <div className="glass-panel-elevated p-6 rounded-2xl border border-white/15 space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-400" />
                  <span>Auditor Inspection Console</span>
                </h3>
                <span className="text-xs font-mono text-gold-400">ID: {selectedItem.id.slice(0, 8)}</span>
              </div>

              {/* Document Scanned Preview */}
              <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-950 max-h-60 flex items-center justify-center p-2">
                <img
                  src={selectedItem.document_url}
                  alt="Scanned Document"
                  className="max-h-56 object-contain rounded"
                />
              </div>

              {/* Extraction vs Ground Truth */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex justify-between">
                  <span className="text-slate-400">Registered Venue:</span>
                  <span className="text-white font-semibold">{selectedItem.venue_name}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex justify-between">
                  <span className="text-slate-400">OCR Extracted Name:</span>
                  <span className="text-gold-300 font-semibold">{selectedItem.ai_raw_extraction?.extracted_venue_name || 'N/A'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex justify-between">
                  <span className="text-slate-400">Certificate Expiration:</span>
                  <span className="text-white font-semibold">{selectedItem.expiration_date}</span>
                </div>
              </div>

              {/* Review Note */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 block">Auditor Verification Note</label>
                <textarea
                  rows="2"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Explain rationale for approval or rejection..."
                  className="w-full p-2.5 text-xs rounded-xl glass-input text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleAuditDecision(selectedItem.id, false)}
                  disabled={processing}
                  className="py-2.5 rounded-xl text-xs font-semibold bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Certificate</span>
                </button>

                <button
                  onClick={() => handleAuditDecision(selectedItem.id, true)}
                  disabled={processing}
                  className="btn-primary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Override & Approve</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center text-slate-400 text-xs">
              Select a submission from the queue to inspect optical extraction and execute an audit override.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
