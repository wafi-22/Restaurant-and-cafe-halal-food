// client/src/pages/CertifiersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { Award, Globe, ExternalLink, ShieldCheck, CheckCircle2, Search, ArrowRight } from 'lucide-react';

export default function CertifiersPage() {
  const [certifiers, setCertifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadCertifiers() {
      try {
        const res = await api.certifiers.list();
        if (res.certifiers) setCertifiers(res.certifiers);
      } catch (err) {
        console.error('Failed to load certifiers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCertifiers();
  }, []);

  const filtered = certifiers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.short_code.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-500/30 text-xs text-brand-300">
          <Award className="w-3.5 h-3.5 text-gold-400" />
          <span>Global Halal Standards Master Registry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Recognized Halal Certifying Authorities
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Our verification system validates uploaded certificates directly against the regulatory protocols, holographic seals, and registration registries of these accredited international bodies.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by certifier name, code (JAKIM, IFANCA), or country..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input text-white placeholder-slate-400"
        />
      </div>

      {/* Grid of Certifiers */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-panel h-56 rounded-2xl animate-pulse bg-slate-800/40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cb) => (
            <div
              key={cb.id}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-brand-500/20 text-brand-400 flex items-center justify-center font-extrabold font-mono text-base group-hover:scale-105 transition-transform">
                    {cb.short_code}
                  </div>
                  {cb.is_globally_recognized && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Global Accord</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-brand-300 transition-colors">
                    {cb.name}
                  </h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>Jurisdiction: {cb.country}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Official authority responsible for third-party facility audits, slaughterhouse inspections, and certificate issuance in {cb.country}.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                {cb.website_url ? (
                  <a
                    href={cb.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-500">Government Registry</span>
                )}

                <Link
                  to={`/explore?certifying_body_id=${cb.id}`}
                  className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                >
                  <span>View Certified Venues</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
