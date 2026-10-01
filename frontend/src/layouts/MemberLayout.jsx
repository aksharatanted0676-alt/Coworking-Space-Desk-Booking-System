import React from 'react';
import { Building2, Calendar, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MemberLayout({ currentRoute, onNavigate, children, onOpenAuthModal }) {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FFF9E2] text-[#2A3026] font-sans">
      
      {/* Member Navbar */}
      <header className="sticky top-0 z-40 glass-nav border-b border-[#CDD4B1]/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Branding */}
            <div 
              onClick={() => onNavigate('/member/dashboard')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2A3026] text-white flex items-center justify-center font-serif text-xl font-bold shadow-organic-sm group-hover:bg-[#DCA278] transition-colors duration-300">
                H
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-[#2A3026] block leading-none">
                  HATCH & CO.
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#62685B] block mt-1">
                  Member Portal
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 bg-[#FEECD0]/80 p-1.5 rounded-2xl border border-[#CDD4B1] shadow-organic-sm">
              <button
                onClick={() => onNavigate('/member/dashboard')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  currentRoute === '/member/dashboard'
                    ? 'bg-[#2A3026] text-white shadow-organic-sm'
                    : 'text-[#62685B] hover:text-[#2A3026] hover:bg-[#FFF9E2]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('/member/desks')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  currentRoute === '/member/desks'
                    ? 'bg-[#2A3026] text-white shadow-organic-sm'
                    : 'text-[#62685B] hover:text-[#2A3026] hover:bg-[#FFF9E2]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Explore Desks</span>
              </button>

              <button
                onClick={() => onNavigate('/member/bookings')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                  currentRoute === '/member/bookings'
                    ? 'bg-[#2A3026] text-white shadow-organic-sm'
                    : 'text-[#62685B] hover:text-[#2A3026] hover:bg-[#FFF9E2]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>My Bookings</span>
              </button>
            </nav>

            {/* Profile / Logout */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#CDD4B1] text-xs font-medium">
                    <div className="w-7 h-7 rounded-lg bg-[#2A3026] text-white flex items-center justify-center font-bold uppercase">
                      {user?.name?.charAt(0) || 'M'}
                    </div>
                    <div className="text-left pr-1">
                      <span className="block font-semibold text-[#2A3026] leading-tight">{user?.name}</span>
                      <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-[#62685B]">
                        MEMBER ACCOUNT
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-2.5 rounded-xl border border-[#CDD4B1] text-[#62685B] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#DCA278] hover:bg-[#C88D63] text-white text-xs font-semibold tracking-wider uppercase transition-colors duration-300 shadow-organic-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#2A3026] text-white py-8 border-t border-[#CDD4B1]/20 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#DCA278] text-white font-serif font-bold flex items-center justify-center text-xs">
              H
            </div>
            <span className="font-serif text-sm font-bold">HATCH & CO. | Botanical Workspace</span>
          </div>
          <span className="text-[#EBECCC] text-[11px]">
            Eucalyptus • Pistachio • Peach • Ivory • Clay Palette
          </span>
        </div>
      </footer>

    </div>
  );
}
