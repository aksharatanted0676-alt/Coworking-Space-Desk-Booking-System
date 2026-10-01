import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function BookingModal({ desk, initialDate, initialStart, initialEnd, isOpen, onClose, onConfirm }) {
  if (!isOpen || !desk) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(initialDate || todayStr);
  const [startTime, setStartTime] = useState(initialStart || '09:00');
  const [endTime, setEndTime] = useState(initialEnd || '17:00');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (initialDate) setDate(initialDate);
    if (initialStart) setStartTime(initialStart);
    if (initialEnd) setEndTime(initialEnd);
    setErrorMsg(null);
  }, [desk, initialDate, initialStart, initialEnd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!date || !startTime || !endTime) {
      setErrorMsg('Please select a date, start time, and end time.');
      return;
    }

    const startISO = `${date}T${startTime}:00.000Z`;
    const endISO = `${date}T${endTime}:00.000Z`;

    if (new Date(startISO) >= new Date(endISO)) {
      setErrorMsg('Start time must be strictly earlier than end time.');
      return;
    }

    setLoading(true);
    try {
      await onConfirm({
        deskId: desk._id,
        startTime: startISO,
        endTime: endISO,
        notes
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A3026]/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#CDD4B1] max-w-lg w-full p-6 sm:p-8 shadow-organic-lg relative overflow-hidden animate-scale-in">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl border border-[#CDD4B1] text-[#62685B] hover:text-[#2A3026] hover:bg-[#FFF9E2] transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF9E2] border border-[#CDD4B1] flex items-center justify-center text-[#DCA278] shadow-organic-sm">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#62685B]">
              Confirm Reservation
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#2A3026]">
              Reserve Desk {desk.deskNumber}
            </h2>
          </div>
        </div>

        {/* Desk Summary Pill */}
        <div className="bg-[#FFF9E2] p-4 rounded-2xl border border-[#CDD4B1] mb-6 flex items-center justify-between text-xs shadow-organic-sm">
          <div>
            <span className="block font-semibold text-[#2A3026]">{desk.zone}</span>
            <span className="text-[#62685B]">{desk.equipment?.join(' • ') || 'Ergonomic Desk'}</span>
          </div>
          <span className="px-3 py-1 bg-[#CDD4B1]/40 text-[#2A3026] rounded-full font-bold uppercase tracking-wider text-[10px]">
            {desk.status}
          </span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFF5F5] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-start space-x-3 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Booking Conflict / Error</strong>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-[#2A3026] uppercase tracking-wider mb-1.5">
              Reservation Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-semibold focus:ring-2 focus:ring-[#DCA278] outline-none transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2A3026] uppercase tracking-wider mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-semibold focus:ring-2 focus:ring-[#DCA278] outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A3026] uppercase tracking-wider mb-1.5">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-semibold focus:ring-2 focus:ring-[#DCA278] outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A3026] uppercase tracking-wider mb-1.5">
              Reservation Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g., Quiet focus session, client call..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-medium focus:ring-2 focus:ring-[#DCA278] outline-none resize-none transition-all duration-200"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-[#CDD4B1] text-[#62685B] hover:text-[#2A3026] hover:bg-[#FFF9E2] text-xs font-bold uppercase tracking-wider transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#DCA278] hover:bg-[#C88D63] text-white text-xs font-bold uppercase tracking-wider shadow-organic-sm hover:shadow-organic-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Booking</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
