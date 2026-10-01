import React from 'react';
import { Building2, Calendar, LayoutDashboard, LogOut, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenAuthModal }) {
  const { user, isAdmin, isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-warm-border/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveTab('explore')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-warm-dark text-white flex items-center justify-center font-serif text-xl font-bold shadow-warm-sm group-hover:bg-terracotta transition-colors duration-300">
              H
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-warm-dark block leading-none">
                HATCH & CO.
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-warm-muted block mt-1">
                Workspace Desk Booking
              </span>
            </div>
          </div>

          {/* Nav Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-warm-card/80 p-1.5 rounded-2xl border border-warm-border shadow-warm-sm">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                activeTab === 'explore'
                  ? 'bg-warm-dark text-white shadow-warm-sm'
                  : 'text-warm-muted hover:text-warm-dark hover:bg-warm-bg'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Explore Desks</span>
            </button>

            {isLoggedIn && (
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  activeTab === 'bookings'
                    ? 'bg-warm-dark text-white shadow-warm-sm'
                    : 'text-warm-muted hover:text-warm-dark hover:bg-warm-bg'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>My Reservations</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  activeTab === 'admin'
                    ? 'bg-terracotta text-white shadow-warm-sm'
                    : 'text-terracotta hover:bg-terracotta-light'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Occupancy</span>
              </button>
            )}
          </nav>

          {/* User / Auth Actions */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-warm-card border border-warm-border text-xs font-medium">
                  <div className="w-7 h-7 rounded-lg bg-warm-bg flex items-center justify-center text-warm-dark font-bold uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left pr-1">
                    <span className="block font-semibold text-warm-dark leading-tight">{user.name}</span>
                    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'text-terracotta' : 'text-sage'}`}>
                      {isAdmin && <ShieldCheck className="w-3 h-3 mr-0.5" />}
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2.5 rounded-xl border border-warm-border text-warm-muted hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-warm-dark hover:bg-terracotta text-white text-xs font-semibold tracking-wider uppercase transition-colors duration-300 shadow-warm-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
