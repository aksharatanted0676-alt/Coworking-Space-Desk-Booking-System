import React from 'react';
import { Monitor, Cpu, Armchair, Edit, Trash2, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DeskCard({ desk, onBook, onEdit, onDelete }) {
  const { isAdmin } = useAuth();
  const isAvailable = desk.status === 'available';

  const getEquipmentIcon = (item) => {
    const lower = item.toLowerCase();
    if (lower.includes('monitor') || lower.includes('display')) return <Monitor className="w-3.5 h-3.5" />;
    if (lower.includes('chair')) return <Armchair className="w-3.5 h-3.5" />;
    return <Cpu className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#CDD4B1] p-6 shadow-organic-sm card-hover-lift flex flex-col justify-between group relative overflow-hidden">
      
      {/* Decorative top corner accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
        isAvailable ? 'bg-[#CDD4B1] group-hover:bg-[#DCA278]' : 'bg-[#DCA278]/40'
      }`} />

      <div>
        
        {/* Header: Desk Number & Status */}
        <div className="flex items-start justify-between pt-1">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#62685B] uppercase block">
              {desk.zone || 'General Zone'}
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#2A3026] mt-1 group-hover:text-[#DCA278] transition-colors duration-200">
              {desk.deskNumber}
            </h3>
          </div>

          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            isAvailable 
              ? 'bg-[#CDD4B1]/30 text-[#2A3026] border border-[#CDD4B1] shadow-sm' 
              : 'bg-[#FEECD0] text-[#DCA278] border border-[#DCA278]/30'
          }`}>
            {isAvailable ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2A3026] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2A3026]"></span>
              </span>
            ) : (
              <AlertTriangle className="w-3 h-3 text-[#DCA278]" />
            )}
            <span>{desk.status}</span>
          </span>
        </div>

        {/* Capacity & Details */}
        <div className="mt-4 pb-4 border-b border-[#CDD4B1]/50 flex items-center justify-between text-xs text-[#62685B]">
          <span>Capacity: <strong className="text-[#2A3026]">{desk.capacity || 1} Person</strong></span>
          {desk.equipment?.length > 0 && (
            <span>{desk.equipment.length} Amenities</span>
          )}
        </div>

        {/* Equipment Badges */}
        <div className="mt-4 space-y-2">
          <span className="text-[10px] font-bold text-[#62685B] uppercase tracking-wider block">
            Included Amenities:
          </span>
          <div className="flex flex-wrap gap-2">
            {desk.equipment && desk.equipment.length > 0 ? (
              desk.equipment.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#FFF9E2] border border-[#CDD4B1] text-xs font-medium text-[#2A3026] transition-transform duration-200 hover:scale-105"
                >
                  {getEquipmentIcon(item)}
                  <span>{item}</span>
                </span>
              ))
            ) : (
              <span className="text-xs italic text-[#62685B]">Standard ergonomic desk setup</span>
            )}
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-4 border-t border-[#CDD4B1]/50 flex items-center justify-between">
        
        {isAdmin ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(desk)}
              className="p-2 rounded-xl border border-[#CDD4B1] text-[#62685B] hover:text-[#2A3026] hover:bg-[#FFF9E2] transition-colors"
              title="Edit Desk"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(desk._id)}
              className="p-2 rounded-xl border border-[#CDD4B1] text-[#62685B] hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Desk"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-[11px] font-semibold text-[#62685B] uppercase tracking-wider">
            {isAvailable ? 'Instant Reservation' : 'Unavailable'}
          </div>
        )}

        {/* Book Button */}
        <button
          onClick={() => onBook(desk)}
          disabled={!isAvailable}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            isAvailable
              ? 'bg-[#DCA278] hover:bg-[#C88D63] text-white shadow-organic-sm hover:shadow-organic-md'
              : 'bg-[#CDD4B1]/50 text-[#62685B] cursor-not-allowed'
          }`}
        >
          <span>{isAvailable ? 'Reserve Desk' : 'Locked'}</span>
          {isAvailable && <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />}
        </button>

      </div>
    </div>
  );
}
