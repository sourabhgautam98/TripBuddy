'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, Menu, X, ArrowRight, Bookmark } from 'lucide-react';
import { api } from '@/lib/api';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState<number | null>(null);

  // Close mobile menu whenever navigation occurs & fetch saved trips count
  useEffect(() => {
    setMobileMenuOpen(false);
    api.listTrips()
      .then((trips) => setSavedCount(trips.length))
      .catch(() => setSavedCount(null));
  }, [pathname]);

  const links = [
    { href: '/', label: 'Explore', icon: Compass },
    { href: '/plan', label: 'Plan Trip', icon: Sparkles },
    { href: '/trips', label: 'Saved Trips', icon: Bookmark, badge: savedCount },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        {/* Logo (Left) */}
        <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] overflow-hidden flex items-center justify-center p-1">
              <img
                src="/logo.svg"
                alt="TripBuddy Logo"
                className="w-full h-full object-contain group-hover:rotate-6 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
              TripBuddy
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm">
              AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links: Dead-Center */}
        <nav className="hidden md:flex items-center space-x-2 md:absolute md:left-1/2 md:-translate-x-1/2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                {typeof link.badge === 'number' && link.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button (Right) */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-slate-900/90 text-slate-300 hover:text-cyan-400 border border-slate-800 focus:outline-none focus:border-cyan-500/50 transition-all active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-5 shadow-2xl animate-fade-in">
          <div className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800/90 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white bg-slate-900/50 border border-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{link.label}</span>
                    {typeof link.badge === 'number' && link.badge > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              );
            })}

            {/* Quick Action in Mobile Menu */}
            <div className="pt-2">
              <Link
                href="/plan"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-98 transition-all"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Build New AI Itinerary</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
