import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, XCircle, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

export default function MyBookingsPage({ setToast }) {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchMyBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingAPI.getBookings({
        status: filterStatus !== 'all' ? filterStatus : undefined
      });
      if (res && res.success) {
        setBookings(res.data || []);
      }
    } catch (err) {
      console.error('Fetch Bookings Error:', err);
      setError(err.message || 'Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [filterStatus]);

  const handleCancelBooking = async (bookingId, deskNum) => {
    if (window.confirm(`Are you sure you want to cancel your reservation for Desk ${deskNum}?`)) {
      try {
        await bookingAPI.cancelBooking(bookingId);
        setToast({ type: 'success', message: 'Reservation cancelled successfully.' });
        fetchMyBookings();
      } catch (err) {
        setToast({ type: 'error', message: err.message || 'Failed to cancel reservation.' });
      }
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-warm-border/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta block">
            Member Reservations
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-warm-dark mt-1">
            My Booked Desks ({bookings.length})
          </h1>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-warm-border shadow-warm-sm">
          {['all', 'confirmed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize tracking-wide transition ${
                filterStatus === status
                  ? 'bg-warm-dark text-white shadow-warm-sm'
                  : 'text-warm-muted hover:text-warm-dark hover:bg-warm-bg'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold uppercase tracking-wider text-warm-muted">
            Loading Reservations...
          </p>
        </div>
      ) : error ? (
        <div className="my-12 p-8 rounded-3xl bg-white border border-red-200 text-center max-w-md mx-auto shadow-warm-md">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h3 className="text-lg font-serif font-bold text-red-600 mb-2">Failed to Load Reservations</h3>
          <p className="text-xs text-warm-muted mb-4">{error}</p>
          <button
            onClick={fetchMyBookings}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-warm-dark text-white text-xs font-bold uppercase tracking-wider"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-white rounded-3xl border border-warm-border p-10 my-8 shadow-warm-sm">
          <div className="w-12 h-12 rounded-2xl bg-warm-bg border border-warm-border flex items-center justify-center text-warm-muted mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-warm-dark">No Reservations Found</h3>
          <p className="text-xs text-warm-muted">
            You haven't booked any desks yet. Browse available desks to reserve your workspace.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          {bookings.map((booking) => {
            const startObj = formatDateTime(booking.startTime);
            const endObj = formatDateTime(booking.endTime);
            const isCancelled = booking.status === 'cancelled';

            return (
              <div
                key={booking._id}
                className={`bg-white rounded-2xl border p-6 shadow-warm-sm flex flex-col justify-between transition-all ${
                  isCancelled ? 'border-warm-border opacity-70 bg-warm-bg/50' : 'border-warm-border hover:shadow-warm-md'
                }`}
              >
                <div>
                  
                  {/* Status & Desk Number */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold tracking-widest text-warm-muted uppercase block">
                        {booking.desk?.zone || 'Workspace Desk'}
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-warm-dark mt-1">
                        Desk {booking.desk?.deskNumber || 'N/A'}
                      </h3>
                    </div>

                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      isCancelled 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'bg-sage-light text-sage border border-sage/20'
                    }`}>
                      {isCancelled ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{booking.status}</span>
                    </span>
                  </div>

                  {/* Amenities */}
                  {booking.desk?.equipment?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {booking.desk.equipment.map((eq, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-warm-bg px-2.5 py-0.5 rounded-md border border-warm-border text-warm-muted">
                          {eq}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Reservation Time Slot */}
                  <div className="mt-6 pt-4 border-t border-warm-border/60 space-y-2 text-xs">
                    <div className="flex items-center text-warm-dark font-medium space-x-2">
                      <Calendar className="w-4 h-4 text-terracotta shrink-0" />
                      <span>Date: <strong>{startObj.date}</strong></span>
                    </div>

                    <div className="flex items-center text-warm-dark font-medium space-x-2">
                      <Clock className="w-4 h-4 text-terracotta shrink-0" />
                      <span>Time: <strong>{startObj.time} – {endObj.time}</strong></span>
                    </div>

                    {booking.notes && (
                      <div className="pt-2 text-[11px] text-warm-muted italic">
                        Notes: "{booking.notes}"
                      </div>
                    )}
                  </div>

                </div>

                {/* Footer Action */}
                {!isCancelled && (
                  <div className="mt-6 pt-4 border-t border-warm-border/60 flex justify-end">
                    <button
                      onClick={() => handleCancelBooking(booking._id, booking.desk?.deskNumber)}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel Reservation</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
