import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import DeskCard from '../components/DeskCard';
import FloorPlanMap from '../components/FloorPlanMap';
import BookingModal from '../components/BookingModal';
import { deskAPI, bookingAPI } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Calendar, Sparkles, LayoutGrid, RefreshCw, XCircle, Map, List, Clock, Zap } from 'lucide-react';

export default function MemberDashboardPage({ setToast, onNavigate }) {
  const { user } = useAuth();

  const [desks, setDesks] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View Mode: 'grid' or 'map'
  const [viewMode, setViewMode] = useState('grid');

  // Search & Filter State
  const [activeZone, setActiveZone] = useState('All');
  const [searchZone, setSearchZone] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Booking Modal State
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Load user's bookings
      const bookingsRes = await bookingAPI.getBookings({ status: 'confirmed' });
      if (bookingsRes && bookingsRes.success) {
        setMyBookings(bookingsRes.data || []);
      }

      // 2. Load desks inventory / available desks
      let desksRes;
      if (searchDate || (startTime && endTime)) {
        desksRes = await deskAPI.getAvailableDesks({
          date: searchDate,
          startTime: startTime && searchDate ? `${searchDate}T${startTime}:00.000Z` : undefined,
          endTime: endTime && searchDate ? `${searchDate}T${endTime}:00.000Z` : undefined,
          zone: searchZone || (activeZone !== 'All' ? activeZone : undefined)
        });
      } else {
        desksRes = await deskAPI.getAllDesks({
          zone: searchZone || (activeZone !== 'All' ? activeZone : undefined)
        });
      }

      if (desksRes && desksRes.success) {
        setDesks(desksRes.data || []);
      }
    } catch (err) {
      console.error('Member Dashboard Error:', err);
      setError(err.message || 'Failed to load member dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeZone]);

  const handleSearch = () => {
    fetchData();
  };

  const handleResetFilters = () => {
    setActiveZone('All');
    setSearchZone('');
    setSearchDate('');
    setStartTime('');
    setEndTime('');
    fetchData();
  };

  const handleOpenBooking = (desk) => {
    setSelectedDesk(desk);
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = async (bookingData) => {
    const res = await bookingAPI.createBooking(bookingData);
    if (res && res.success) {
      setToast({ type: 'success', message: `Desk ${selectedDesk.deskNumber} reserved successfully!` });
      fetchData();
    }
  };

  const handleCancelBooking = async (bookingId, deskNum) => {
    if (window.confirm(`Are you sure you want to cancel your booking for Desk ${deskNum}?`)) {
      try {
        await bookingAPI.cancelBooking(bookingId);
        setToast({ type: 'success', message: 'Booking cancelled successfully.' });
        fetchData();
      } catch (err) {
        setToast({ type: 'error', message: err.message || 'Failed to cancel booking.' });
      }
    }
  };

  const zonesList = ['All', 'Quiet Zone', 'Executive Suite', 'Collaborative Hub', 'Studio'];

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      
      {/* Personalized Member Header Banner */}
      <section className="bg-gradient-to-r from-[#2A3026] via-[#353C30] to-[#2A3026] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#CDD4B1]/20 shadow-organic-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-[#DCA278]/15 rounded-full blur-3xl pointer-events-none animate-float" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 text-[#EBECCC] text-[11px] font-bold uppercase tracking-wider mb-2 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#DCA278]" />
              <span>Personalized Member Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Welcome back, {user?.name || 'Member'}! 👋
            </h1>
            <p className="text-[#EBECCC] text-xs sm:text-sm mt-1 max-w-xl">
              Select date & time slots to reserve conflict-free desks, quiet zones, and executive suites.
            </p>
          </div>

          {/* Quick Summary Card */}
          <div className="flex items-center space-x-4 bg-white/10 p-4.5 rounded-2xl border border-white/15 backdrop-blur-md shadow-organic-sm transition-transform duration-300 hover:scale-105">
            <div className="p-3 rounded-xl bg-[#DCA278] text-white shadow-organic-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#EBECCC] block">
                Active Bookings
              </span>
              <span className="text-2xl font-serif font-bold text-white">
                {myBookings.length} Upcoming
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Reservations Summary Widget */}
      {myBookings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#CDD4B1] p-6 shadow-organic-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#CDD4B1]/60">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#DCA278] block">
                  Your Upcoming Reservation
                </span>
                <h3 className="text-xl font-serif font-bold text-[#2A3026] mt-0.5">
                  Confirmed Desk Slot
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/member/bookings')}
                className="text-xs font-bold text-[#2A3026] hover:text-[#DCA278] uppercase tracking-wider underline transition"
              >
                View All My Bookings
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBookings.slice(0, 3).map((b) => (
                <div key={b._id} className="p-4 rounded-2xl bg-[#FFF9E2] border border-[#CDD4B1] space-y-2 card-hover-lift">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#DCA278]">Desk {b.desk?.deskNumber || 'N/A'}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#CDD4B1]/40 text-[#2A3026]">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#2A3026] font-medium">
                    <div>Date: <strong>{new Date(b.startTime).toLocaleDateString()}</strong></div>
                    <div>Time: <strong>{new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div>
                  </div>
                  <button
                    onClick={() => handleCancelBooking(b._id, b.desk?.deskNumber)}
                    className="pt-1 text-[11px] font-bold text-red-600 hover:underline flex items-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Reservation</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hero Availability Search */}
      <Hero
        searchZone={searchZone}
        setSearchZone={setSearchZone}
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        onSearch={handleSearch}
        onReset={handleResetFilters}
      />

      {/* Desk Catalogue & Visual Floor Plan Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header, Zone Filters & View Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-[#CDD4B1]/60">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#DCA278] block">
              Workspace Catalogue
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#2A3026] mt-1">
              Available Desks ({desks.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle Button */}
            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-[#CDD4B1] shadow-organic-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-[#2A3026] text-white shadow-organic-sm'
                    : 'text-[#62685B] hover:text-[#2A3026]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  viewMode === 'map'
                    ? 'bg-[#2A3026] text-white shadow-organic-sm'
                    : 'text-[#62685B] hover:text-[#2A3026]'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Floor Map</span>
              </button>
            </div>

            {/* Zone Filter Tabs */}
            <div className="flex flex-wrap items-center space-x-1 bg-white p-1 rounded-xl border border-[#CDD4B1] shadow-organic-sm">
              {zonesList.map((z) => (
                <button
                  key={z}
                  onClick={() => setActiveZone(z)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                    activeZone === z
                      ? 'bg-[#DCA278] text-white shadow-organic-sm'
                      : 'text-[#62685B] hover:text-[#2A3026] hover:bg-[#FFF9E2]'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#DCA278] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#62685B] animate-pulse-subtle">
              Loading Available Desks...
            </p>
          </div>
        ) : error ? (
          <div className="my-12 p-8 rounded-3xl bg-white border border-red-200 text-center max-w-md mx-auto shadow-organic-md animate-fade-in">
            <h3 className="text-lg font-serif font-bold text-red-600 mb-2">Connection Error</h3>
            <p className="text-xs text-[#62685B] mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#2A3026] text-white text-xs font-bold uppercase tracking-wider"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : desks.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-white rounded-3xl border border-[#CDD4B1] p-10 my-8 shadow-organic-sm animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF9E2] border border-[#CDD4B1] flex items-center justify-center text-[#62685B] mx-auto">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2A3026]">No Desks Available</h3>
            <p className="text-xs text-[#62685B]">
              No available desks match your selected zone or date/time filter. Try resetting your search filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-[#2A3026] text-white text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'map' ? (
          /* Floor Plan Map View */
          <div className="pt-8">
            <FloorPlanMap
              desks={desks}
              onBook={handleOpenBooking}
            />
          </div>
        ) : (
          /* Desk Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 animate-fade-in">
            {desks.map((desk) => (
              <DeskCard
                key={desk._id}
                desk={desk}
                onBook={handleOpenBooking}
              />
            ))}
          </div>
        )}

      </div>

      {/* Booking Modal */}
      <BookingModal
        desk={selectedDesk}
        initialDate={searchDate}
        initialStart={startTime}
        initialEnd={endTime}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onConfirm={handleConfirmBooking}
      />

    </div>
  );
}
