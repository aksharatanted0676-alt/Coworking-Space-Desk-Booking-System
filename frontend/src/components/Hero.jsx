import React from 'react';
import { Search, Sparkles, Compass, CheckCircle2, Leaf, Clock, ArrowRight, Zap, Coffee, Sun, Moon } from 'lucide-react';

export default function Hero({ 
  searchZone, 
  setSearchZone, 
  searchDate, 
  setSearchDate, 
  startTime, 
  setStartTime, 
  endTime, 
  setEndTime, 
  onSearch, 
  onReset 
}) {
  const applyPreset = (presetType) => {
    const today = new Date().toISOString().split('T')[0];
    setSearchDate(today);

    if (presetType === 'morning') {
      setStartTime('09:00');
      setEndTime('13:00');
    } else if (presetType === 'afternoon') {
      setStartTime('13:00');
      setEndTime('17:00');
    } else if (presetType === 'quick') {
      const now = new Date();
      const currentHour = now.getHours();
      const startH = String(currentHour).padStart(2, '0');
      const endH = String(Math.min(currentHour + 2, 23)).padStart(2, '0');
      setStartTime(`${startH}:00`);
      setEndTime(`${endH}:00`);
    } else if (presetType === 'fullday') {
      setStartTime('09:00');
      setEndTime('17:00');
    }
  };

  return (
    <section className="relative overflow-hidden pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#CDD4B1]/60 bg-gradient-to-b from-[#FFF9E2] via-[#FEECD0]/60 to-[#FFF9E2]">
      
      {/* Animated Floating Orbs & Leaves */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#CDD4B1]/35 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#DCA278]/25 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '3s' }} />
      <Leaf className="absolute top-10 left-12 w-8 h-8 text-[#CDD4B1]/40 animate-float pointer-events-none" style={{ animationDuration: '8s' }} />
      <Leaf className="absolute bottom-12 right-16 w-10 h-10 text-[#DCA278]/30 animate-float pointer-events-none" style={{ animationDuration: '10s', animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto relative z-10 animate-fade-in">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Animated Pulsing Tag Pill */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white border border-[#CDD4B1] shadow-organic-sm transition-all duration-300 hover:scale-105">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DCA278] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#DCA278]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#62685B]">
              Botanical Workspace & Desk Booking
            </span>
          </div>

          {/* Editorial Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2A3026] leading-tight tracking-tight">
            Natural Workspace Designed for <span className="italic font-normal text-[#DCA278] underline decoration-[#CDD4B1] decoration-wavy decoration-2 underline-offset-8">Focus</span> & Collaboration.
          </h1>

          <p className="text-[#62685B] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Reserve dedicated desks, quiet zones, and executive suites with real-time time-slot conflict prevention and instant confirmation.
          </p>

          {/* Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#62685B]">
            <div className="flex items-center space-x-2 bg-white/60 px-3.5 py-1.5 rounded-xl border border-[#CDD4B1]/50 shadow-organic-sm transition hover:bg-white">
              <CheckCircle2 className="w-4 h-4 text-[#DCA278]" />
              <span>Conflict-Free Time Slots</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 px-3.5 py-1.5 rounded-xl border border-[#CDD4B1]/50 shadow-organic-sm transition hover:bg-white">
              <CheckCircle2 className="w-4 h-4 text-[#DCA278]" />
              <span>Ergonomic Setup & Displays</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 px-3.5 py-1.5 rounded-xl border border-[#CDD4B1]/50 shadow-organic-sm transition hover:bg-white">
              <CheckCircle2 className="w-4 h-4 text-[#DCA278]" />
              <span>Instant Confirmation</span>
            </div>
          </div>
        </div>

        {/* Animated Quick Search Widget */}
        <div className="mt-12 max-w-4xl mx-auto bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#CDD4B1] shadow-organic-lg transition-all duration-300 hover:shadow-2xl">
          
          <div className="text-xs font-bold uppercase tracking-wider text-[#62685B] mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Compass className="w-4.5 h-4.5 text-[#DCA278] animate-spin" style={{ animationDuration: '20s' }} />
              <span>Check Real-Time Desk Availability</span>
            </div>
            
            <span className="text-[10px] text-[#DCA278] font-bold tracking-widest uppercase bg-[#FEECD0] px-2.5 py-1 rounded-full border border-[#DCA278]/20 self-start sm:self-auto">
              Live Search
            </span>
          </div>

          {/* Smart Preset Chips Row */}
          <div className="mb-6 p-3 rounded-2xl bg-[#FFF9E2] border border-[#CDD4B1] flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#62685B] uppercase tracking-wider mr-1 flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-[#DCA278]" />
              <span>Quick Presets:</span>
            </span>
            <button
              onClick={() => applyPreset('morning')}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-white border border-[#CDD4B1] text-xs font-semibold text-[#2A3026] hover:bg-[#DCA278] hover:text-white transition"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Morning Sprint (9-1)</span>
            </button>
            <button
              onClick={() => applyPreset('afternoon')}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-white border border-[#CDD4B1] text-xs font-semibold text-[#2A3026] hover:bg-[#DCA278] hover:text-white transition"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Afternoon Sprint (1-5)</span>
            </button>
            <button
              onClick={() => applyPreset('quick')}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-white border border-[#CDD4B1] text-xs font-semibold text-[#2A3026] hover:bg-[#DCA278] hover:text-white transition"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Next 2 Hours</span>
            </button>
            <button
              onClick={() => applyPreset('fullday')}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-white border border-[#CDD4B1] text-xs font-semibold text-[#2A3026] hover:bg-[#DCA278] hover:text-white transition"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Full Workday (9-5)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Zone */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#62685B] uppercase tracking-wider">
                Workspace Zone
              </label>
              <select
                value={searchZone}
                onChange={(e) => setSearchZone(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-semibold focus:ring-2 focus:ring-[#DCA278] focus:border-[#DCA278] outline-none transition-all duration-200"
              >
                <option value="">All Workspace Zones</option>
                <option value="Quiet Zone">Quiet Zone</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Collaborative Hub">Collaborative Hub</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#62685B] uppercase tracking-wider">
                Reservation Date
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-semibold focus:ring-2 focus:ring-[#DCA278] focus:border-[#DCA278] outline-none transition-all duration-200"
              />
            </div>

            {/* Start Time */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#62685B] uppercase tracking-wider">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-semibold focus:ring-2 focus:ring-[#DCA278] focus:border-[#DCA278] outline-none transition-all duration-200"
              />
            </div>

            {/* End Time */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#62685B] uppercase tracking-wider">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-semibold focus:ring-2 focus:ring-[#DCA278] focus:border-[#DCA278] outline-none transition-all duration-200"
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#CDD4B1]/60">
            <button
              onClick={onReset}
              className="text-xs font-bold text-[#62685B] hover:text-[#2A3026] uppercase tracking-wider transition hover:underline"
            >
              Clear Search Filters
            </button>

            <button
              onClick={onSearch}
              className="group flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#DCA278] hover:bg-[#C88D63] text-white text-xs font-bold uppercase tracking-wider shadow-organic-sm hover:shadow-organic-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Search Free Desks</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
