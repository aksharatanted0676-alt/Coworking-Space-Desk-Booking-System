import React from 'react';
import { ShieldCheck, LayoutDashboard, Layers, BarChart3, Users, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ currentRoute, onNavigate, children, onOpenAddDeskModal }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#2A3026] text-white font-sans">
      
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-[#1F241C]/95 backdrop-blur-md border-b border-[#CDD4B1]/20 shadow-organic-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Branding */}
            <div 
              onClick={() => onNavigate('/admin/dashboard')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#DCA278] text-white flex items-center justify-center font-serif text-xl font-bold shadow-organic-sm group-hover:bg-[#C88D63] transition-colors">
                H
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-white block leading-none">
                  HATCH & CO.
                </span>
                <span className="text-[10px] tracking-widest uppercase font-bold text-[#EBECCC] flex items-center space-x-1 mt-1">
                  <ShieldCheck className="w-3 h-3 mr-0.5 text-[#DCA278]" />
                  <span>Administrative Control Center</span>
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center space-x-1 bg-white/5 p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => onNavigate('/admin/dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  currentRoute === '/admin/dashboard'
                    ? 'bg-[#DCA278] text-white shadow-organic-sm'
                    : 'text-[#EBECCC] hover:text-white hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Control Center</span>
              </button>

              <button
                onClick={() => onNavigate('/admin/desks')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  currentRoute === '/admin/desks'
                    ? 'bg-[#DCA278] text-white shadow-organic-sm'
                    : 'text-[#EBECCC] hover:text-white hover:bg-white/10'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Desk Inventory</span>
              </button>

              <button
                onClick={() => onNavigate('/admin/occupancy')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  currentRoute === '/admin/occupancy'
                    ? 'bg-[#DCA278] text-white shadow-organic-sm'
                    : 'text-[#EBECCC] hover:text-white hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Occupancy Report</span>
              </button>

              <button
                onClick={() => onNavigate('/admin/bookings')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  currentRoute === '/admin/bookings'
                    ? 'bg-[#DCA278] text-white shadow-organic-sm'
                    : 'text-[#EBECCC] hover:text-white hover:bg-white/10'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Member Bookings</span>
              </button>
            </nav>

            {/* Profile & Add Desk Trigger */}
            <div className="flex items-center space-x-3">
              {onOpenAddDeskModal && (
                <button
                  onClick={onOpenAddDeskModal}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#DCA278] hover:bg-[#C88D63] text-white text-xs font-bold uppercase tracking-wider shadow-organic-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Desk</span>
                </button>
              )}

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs">
                <div className="w-7 h-7 rounded-lg bg-[#DCA278] text-white flex items-center justify-center font-bold uppercase">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block font-bold text-white leading-tight">{user?.name}</span>
                  <span className="text-[10px] text-[#EBECCC] font-bold tracking-wider uppercase">ADMINISTRATOR</span>
                </div>
              </div>

              <button
                onClick={logout}
                title="Logout"
                className="p-2.5 rounded-xl border border-white/15 text-gray-300 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-[#1F241C] text-gray-400 py-6 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#DCA278]" />
            <span className="font-semibold text-white">Hatch & Co. Administrative Control Center</span>
          </div>
          <span className="text-[11px] text-[#EBECCC]">
            Eucalyptus • Pistachio • Peach • Ivory • Clay Palette
          </span>
        </div>
      </footer>

    </div>
  );
}
