// client/src/components/MerchantCertificateUploader.jsx
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  UploadCloud,
  FileCheck2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import api from '../services/api.js';

export default function MerchantCertificateUploader({ venueId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progressPhase, setProgressPhase] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setError('File exceeds 10MB maximum size limit.');
        return;
      }
      setFile(selected);
      setError('');
      if (selected.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selected));
      } else {
        setPreviewUrl('');
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setError('File exceeds 10MB limit.');
        return;
      }
      setFile(selected);
      setError('');
      if (selected.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selected));
      } else {
        setPreviewUrl('');
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !venueId) {
      setError('Please select a certificate document first.');
      return;
    }

    setUploading(true);
    setError('');
    setResult(null);

    // Dynamic phase transitions simulation
    setProgressPhase('Uploading document to secure memory vault...');
    setProgressPercent(20);

    const timer1 = setTimeout(() => {
      setProgressPhase('Executing Google Gemini 2.5 Flash Multimodal Vision OCR...');
      setProgressPercent(45);
    }, 600);

    const timer2 = setTimeout(() => {
      setProgressPhase('Verifying Certifier Authority seal & matching venue credentials...');
      setProgressPercent(75);
    }, 1400);

    const timer3 = setTimeout(() => {
      setProgressPhase('Evaluating authenticity confidence score & fraud detection flags...');
      setProgressPercent(90);
    }, 2000);

    try {
      const formData = new FormData();
      formData.append('venue_id', venueId);
      formData.append('certificate', file);

      const res = await api.certificates.upload(formData);

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      setProgressPercent(100);
      setProgressPhase('Verification analysis complete!');
      setResult(res);

      if (res.verification_status === 'AI_VERIFIED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      if (onUploadSuccess) {
        onUploadSuccess(res);
      }
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setError(err.message || 'Certificate verification failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <span>AI Halal Certificate Optical Verification</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Upload your official Halal Accreditation Certificate (PDF or Image). Gemini 2.5 Flash Vision will scan and verify authenticity within seconds.
          </p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-brand-950 text-brand-300 border border-brand-500/30 font-mono">
          Max 10MB (.pdf, .png, .jpg, .webp)
        </span>
      </div>

      {/* Drag & Drop Box */}
      {!result && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            file
              ? 'border-brand-500 bg-brand-950/20'
              : 'border-white/15 hover:border-brand-500/50 bg-slate-900/40 hover:bg-slate-900/60'
          }`}
        >
          {previewUrl ? (
            <div className="max-w-xs mx-auto mb-4">
              <img
                src={previewUrl}
                alt="Certificate Document Preview"
                className="rounded-lg max-h-48 mx-auto shadow-md border border-white/10"
              />
              <span className="text-xs text-slate-400 mt-2 block truncate">{file.name}</span>
            </div>
          ) : file ? (
            <div className="mb-4">
              <FileText className="w-12 h-12 text-brand-400 mx-auto mb-2" />
              <span className="text-sm font-semibold text-white block">{file.name}</span>
              <span className="text-xs text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for AI Scan
              </span>
            </div>
          ) : (
            <div>
              <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white mb-1">
                Drag and drop your official certificate here, or{' '}
                <label className="text-brand-400 hover:text-brand-300 underline cursor-pointer">
                  browse files
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-xs text-slate-500">
                Supported formats: PDF scans, PNG, JPG, WEBP.
              </p>
            </div>
          )}

          {file && !uploading && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <label className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors">
                Change File
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleUpload}
                className="btn-primary px-6 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Run Gemini Vision Verification</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Uploading & Analysis Progress Bar */}
      {uploading && (
        <div className="glass-panel p-5 rounded-2xl border border-brand-500/30 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-brand-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
              <span>{progressPhase}</span>
            </span>
            <span className="font-mono font-bold text-white">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-600 via-brand-400 to-gold-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Verification Result Card */}
      {result && (
        <div className="glass-panel p-6 rounded-2xl border border-brand-500/40 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                result.verification_status === 'AI_VERIFIED'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {result.verification_status === 'AI_VERIFIED' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Clock className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  Verification Status:{' '}
                  <span className={result.verification_status === 'AI_VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}>
                    {result.verification_status}
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  Confidence Score:{' '}
                  <strong className="text-white">{result.ai_analysis?.confidence_score}%</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setFile(null); }}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              Upload Another
            </button>
          </div>

          {/* Extracted Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Certifying Body</span>
              <span className="font-semibold text-white mt-0.5 block truncate">
                {result.ai_analysis?.certifying_body_name || 'N/A'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Serial / ID</span>
              <span className="font-mono font-semibold text-gold-300 mt-0.5 block truncate">
                {result.ai_analysis?.certificate_id || 'N/A'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Valid Until</span>
              <span className="font-semibold text-emerald-400 mt-0.5 block">
                {result.ai_analysis?.expiration_date || 'N/A'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300 italic">
            "{result.ai_analysis?.summary_explanation}"
          </div>
        </div>
      )}
    </div>
  );
}
