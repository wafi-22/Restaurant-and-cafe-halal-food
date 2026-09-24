// client/src/components/VerificationBadge.jsx
import React from 'react';
import { ShieldCheck, ShieldAlert, Clock, AlertTriangle, ShieldX } from 'lucide-react';

export default function VerificationBadge({ status, score, size = 'md' }) {
  const normalized = (status || 'UNVERIFIED').toUpperCase();

  const configs = {
    AI_VERIFIED: {
      label: 'AI Verified',
      bg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      dotColor: 'bg-emerald-400',
      description: 'Certificate OCR validated by Gemini 2.5 Flash Vision'
    },
    PENDING_HUMAN_REVIEW: {
      label: 'Pending Audit',
      bg: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
      icon: Clock,
      iconColor: 'text-amber-400',
      dotColor: 'bg-amber-400',
      description: 'Under review by platform certifying auditor'
    },
    PENDING_AI: {
      label: 'Scanning...',
      bg: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300',
      icon: Clock,
      iconColor: 'text-cyan-400',
      dotColor: 'bg-cyan-400',
      description: 'Document OCR processing in progress'
    },
    EXPIRED: {
      label: 'Expired Cert',
      bg: 'bg-red-950/70 border-red-500/40 text-red-300',
      icon: AlertTriangle,
      iconColor: 'text-red-400',
      dotColor: 'bg-red-500',
      description: 'Official certificate validity date has lapsed'
    },
    REJECTED: {
      label: 'Flagged / Rejected',
      bg: 'bg-rose-950/70 border-rose-500/40 text-rose-300',
      icon: ShieldX,
      iconColor: 'text-rose-400',
      dotColor: 'bg-rose-500',
      description: 'Document failed authenticity or name match checkpoints'
    },
    UNVERIFIED: {
      label: 'Self-Declared',
      bg: 'bg-slate-800/80 border-slate-600/40 text-slate-300',
      icon: ShieldAlert,
      iconColor: 'text-slate-400',
      dotColor: 'bg-slate-500',
      description: 'No third-party certificate uploaded yet'
    }
  };

  const config = configs[normalized] || configs.UNVERIFIED;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  return (
    <div
      title={config.description}
      className={`inline-flex items-center rounded-full border backdrop-blur-md shadow-sm transition-all ${config.bg} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
      <span>{config.label}</span>
      {score !== undefined && score !== null && (
        <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded bg-black/40 font-mono font-bold text-slate-200">
          {score}%
        </span>
      )}
    </div>
  );
}
