// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ShieldCheck, Mail, Lock, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.user?.role === 'merchant') navigate('/merchant/dashboard');
      else if (res.user?.role === 'admin') navigate('/admin/audit-queue');
      else navigate('/explore');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    setSubmitting(true);
    try {
      const res = await demoLogin(role);
      if (role === 'merchant') navigate('/merchant/dashboard');
      else if (role === 'admin') navigate('/admin/audit-queue');
      else navigate('/explore');
    } catch (err) {
      setError(err.message || 'Failed demo login.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-panel-elevated p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-gold-400 p-0.5 shadow-xl shadow-brand-500/20 mx-auto">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-brand-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Sign In to Directory</h1>
          <p className="text-xs text-slate-400">Access verified venues, review audits, and merchant controls</p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-brand-500/20 space-y-2">
          <span className="text-[11px] font-bold text-brand-300 uppercase tracking-wider block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" /> One-Click Demo Personas:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('diner')}
              className="px-2 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
            >
              Diner
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('merchant')}
              className="px-2 py-2 rounded-xl text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 transition-colors"
            >
              Merchant
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2 py-2 rounded-xl text-xs font-semibold bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/30 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Standard Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input text-white placeholder-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input text-white placeholder-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 mt-2"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:underline font-semibold">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
