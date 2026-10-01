import React, { useState } from 'react';
import { 
  Monitor, 
  Armchair, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2, 
  Zap, 
  Info,
  Calendar,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FloorPlanMap({ desks = [], onBook, onEdit }) {
  const { isAdmin } = useAuth();
  const [hoveredDesk, setHoveredDesk] = useState(null);
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('All');

  // Group desks by zone
  const zones = ['Quiet Zone', 'Executive Suite', 'Collaborative Hub', 'Studio'];

  const getDesksByZone = (zoneName) => {
    return desks.filter((d) => d.zone === zoneName);
  };

  const filteredDesks = selectedZoneFilter === 'All' 
    ? desks 
    : desks.filter(d => d.zone === selectedZoneFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/40',
          badgeBg: 'bg-emerald-500',
          text: 'text-emerald-700',
          darkText: 'text-emerald-400',
          pulse: 'bg-emerald-500'
        };
      case 'maintenance':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/40',
          badgeBg: 'bg-amber-500',
          text: 'text-amber-700',
          darkText: 'text-amber-400',
          pulse: 'bg-amber-500'
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          border: 'border-gray-400/30',
          badgeBg: 'bg-gray-400',
          text: 'text-gray-600',
          darkText: 'text-gray-400',
          pulse: 'bg-gray-400'
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#CDD4B1] p-6 sm:p-8 shadow-organic-md space-y-6 relative overflow-hidden animate-fade-in">
      
      {/* Decorative Background Map Grid Accent */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2A3026 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Map Header & Legend */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#CDD4B1]/60 relative z-10">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FEECD0] text-[#DCA278] text-[10px] font-bold uppercase tracking-widest border border-[#DCA278]/30 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Floor Plan Layout</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#2A3026]">
            Architectural Workspace Map
          </h3>
          <p className="text-xs text-[#62685B] mt-0.5">
            Hover over workstations to inspect amenities. Click any active desk to initiate instant booking.
          </p>
        </div>

        {/* Legend Pills & Zone Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-4 bg-[#FFF9E2] px-4 py-2 rounded-2xl border border-[#CDD4B1] text-xs font-semibold">
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[#2A3026]">Available</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-[#2A3026]">Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Architectural Zone Floor Plan Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {zones.map((zoneName) => {
          const zoneDesks = getDesksByZone(zoneName);
          if (zoneDesks.length === 0) return null;

          return (
            <div 
              key={zoneName}
              className="bg-[#FFF9E2]/60 rounded-2xl border border-[#CDD4B1] p-5 space-y-4 relative transition-all duration-300 hover:border-[#DCA278]"
            >
              {/* Zone Label & Accent Line */}
              <div className="flex items-center justify-between pb-3 border-b border-[#CDD4B1]/50">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-md bg-[#DCA278]" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#2A3026]">
                    {zoneName}
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-[#62685B] bg-white px-2.5 py-1 rounded-full border border-[#CDD4B1]">
                  {zoneDesks.length} Desk Pod(s)
                </span>
              </div>

              {/* Desk Station Pods Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {zoneDesks.map((desk) => {
                  const colors = getStatusColor(desk.status);
                  const isAvailable = desk.status === 'available';

                  return (
                    <div
                      key={desk._id}
                      onMouseEnter={() => setHoveredDesk(desk)}
                      onMouseLeave={() => setHoveredDesk(null)}
                      onClick={() => {
                        if (isAdmin && onEdit) {
                          onEdit(desk);
                        } else if (isAvailable && onBook) {
                          onBook(desk);
                        }
                      }}
                      className={`group relative p-3.5 rounded-xl border ${colors.border} ${colors.bg} cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-organic-md flex flex-col justify-between min-h-[90px]`}
                    >
                      {/* Top Pod Details */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2A3026] group-hover:text-[#DCA278] transition-colors">
                          {desk.deskNumber}
                        </span>

                        <span className="relative flex h-2.5 w-2.5">
                          {isAvailable && (
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.pulse} opacity-75`} />
                          )}
                          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors.badgeBg}`} />
                        </span>
                      </div>

                      {/* Desk Visual Icon Schematic */}
                      <div className="my-2 flex items-center justify-center space-x-1 py-1 px-2 rounded-lg bg-white/70 border border-[#CDD4B1]/40">
                        <Monitor className="w-3.5 h-3.5 text-[#62685B] group-hover:text-[#DCA278] transition-colors" />
                        <span className="text-[10px] font-mono font-bold text-[#2A3026]">
                          {desk.capacity || 1}P
                        </span>
                      </div>

                      {/* Bottom Status Text */}
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-[#62685B]">
                        <span>{desk.status}</span>
                        <span className="text-[#DCA278] group-hover:underline">
                          {isAdmin ? 'Edit' : isAvailable ? 'Book' : 'Locked'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover Information Tooltip Banner */}
      {hoveredDesk ? (
        <div className="bg-[#2A3026] text-white p-4 rounded-2xl border border-[#CDD4B1]/30 shadow-organic-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-scale-in relative z-20">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-[#DCA278] text-white font-bold text-sm">
              {hoveredDesk.deskNumber}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#EBECCC] uppercase tracking-wider">
                  {hoveredDesk.zone}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/15 text-white font-bold uppercase">
                  {hoveredDesk.status}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Amenities: {hoveredDesk.equipment?.join(' • ') || 'Standard Ergonomic Desk'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isAdmin && onEdit) {
                onEdit(hoveredDesk);
              } else if (hoveredDesk.status === 'available' && onBook) {
                onBook(hoveredDesk);
              }
            }}
            disabled={!isAdmin && hoveredDesk.status !== 'available'}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              isAdmin || hoveredDesk.status === 'available'
                ? 'bg-[#DCA278] hover:bg-[#C88D63] text-white shadow-organic-sm'
                : 'bg-white/20 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAdmin ? 'Edit Desk Properties' : hoveredDesk.status === 'available' ? 'Reserve Desk' : 'Unavailable'}
          </button>
        </div>
      ) : (
        <div className="text-center py-2 text-xs font-medium text-[#62685B] flex items-center justify-center space-x-2">
          <Info className="w-4 h-4 text-[#DCA278]" />
          <span>Hover over any desk workstation on the floor plan above to inspect equipment details.</span>
        </div>
      )}

    </div>
  );
}
