// client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Compass,
  Sparkles,
  Award,
  Store,
  ShieldCheck,
  User,
  LogOut,
  MapPin,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ userCity = 'New York, NY' }) {
  const { user, isAuthenticated, logout, demoLogin, isMerchant, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoSwitch = async (role) => {
    await demoLogin(role);
    setDemoDropdownOpen(false);
    if (role === 'merchant') navigate('/merchant/dashboard');
    else if (role === 'admin') navigate('/admin/audit-queue');
    else navigate('/explore');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 bg-[#0a0d12]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-gold-400 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0d131f] rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-brand-400" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Halal<span className="text-brand-400 font-extrabold">Veritas</span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-500/30">
                    AI 2.5
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wide block -mt-1">
                  Global Dining & Cert Directory
                </span>
              </div>
            </Link>

            {/* Live Location Context Bar */}
            <div className="hidden lg:flex items-center gap-1.5 ml-4 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              <span>{userCity}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse ml-1" />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/explore"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/explore')
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Map
            </Link>

            <Link
              to="/concierge"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/concierge')
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              AI Concierge
            </Link>

            <Link
              to="/certifiers"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/certifiers')
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              Certifiers
            </Link>

            {isMerchant && (
              <Link
                to="/merchant/dashboard"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/merchant/dashboard')
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Store className="w-4 h-4 text-emerald-400" />
                Merchant Portal
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/audit-queue"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/admin/audit-queue')
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Admin Audit
              </Link>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 border border-white/10 hover:border-brand-500/40 text-slate-300 hover:text-white transition-all"
              >
                <span className="text-brand-400">Demo Role:</span>
                <span className="capitalize font-semibold text-white">
                  {user ? user.role : 'Guest'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-white/10 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('diner')}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <span>Diner (Public User)</span>
                    <span className="text-[10px] text-brand-400 font-mono">Consumer</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('merchant')}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <span>Merchant (Venue Owner)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Upload OCR</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <span>Administrator</span>
                    <span className="text-[10px] text-amber-400 font-mono">Audit Queue</span>
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-brand-600/30 text-brand-300 flex items-center justify-center font-bold text-xs">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
                    {user.full_name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary px-4 py-1.5 text-xs rounded-lg font-semibold"
                >
                  Join Directory
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 rounded-lg hover:bg-slate-800"
          >
            <Compass className="w-4 h-4 text-brand-400" />
            Explore Map & Venues
          </Link>
          <Link
            to="/concierge"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 rounded-lg hover:bg-slate-800"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            AI Halal Concierge
          </Link>
          <Link
            to="/certifiers"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 rounded-lg hover:bg-slate-800"
          >
            <Award className="w-4 h-4 text-blue-400" />
            Certifying Authorities
          </Link>
          {isMerchant && (
            <Link
              to="/merchant/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 rounded-lg hover:bg-slate-800"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              Merchant Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin/audit-queue"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 rounded-lg hover:bg-slate-800"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Admin Audit Queue
            </Link>
          )}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Switch Persona:</span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => { handleDemoSwitch('diner'); setMobileMenuOpen(false); }}
                className="px-2 py-1.5 text-xs bg-slate-800 rounded text-slate-200 hover:bg-slate-700"
              >
                Diner
              </button>
              <button
                onClick={() => { handleDemoSwitch('merchant'); setMobileMenuOpen(false); }}
                className="px-2 py-1.5 text-xs bg-slate-800 rounded text-slate-200 hover:bg-slate-700"
              >
                Merchant
              </button>
              <button
                onClick={() => { handleDemoSwitch('admin'); setMobileMenuOpen(false); }}
                className="px-2 py-1.5 text-xs bg-slate-800 rounded text-slate-200 hover:bg-slate-700"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
