import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import DeskCard from '../components/DeskCard';
import BookingModal from '../components/BookingModal';
import AdminDeskModal from '../components/AdminDeskModal';
import { deskAPI, bookingAPI } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Plus, SlidersHorizontal, RefreshCw, LayoutGrid, CheckCircle } from 'lucide-react';

export default function HomePage({ setToast, onOpenAuthModal }) {
  const { isLoggedIn, isAdmin } = useAuth();

  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [activeZone, setActiveZone] = useState('All');
  const [searchZone, setSearchZone] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Booking Modal State
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Admin Modal State
  const [adminDeskToEdit, setAdminDeskToEdit] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Load Desks
  const fetchDesks = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (searchDate || (startTime && endTime)) {
        res = await deskAPI.getAvailableDesks({
          date: searchDate,
          startTime: startTime && searchDate ? `${searchDate}T${startTime}:00.000Z` : undefined,
          endTime: endTime && searchDate ? `${searchDate}T${endTime}:00.000Z` : undefined,
          zone: searchZone || (activeZone !== 'All' ? activeZone : undefined)
        });
      } else {
        res = await deskAPI.getAllDesks({
          zone: searchZone || (activeZone !== 'All' ? activeZone : undefined)
        });
      }

      if (res && res.success) {
        setDesks(res.data || []);
      }
    } catch (err) {
      console.error('Fetch Desks Error:', err);
      setError(err.message || 'Failed to load desks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesks();
  }, [activeZone]);

  const handleSearch = () => {
    fetchDesks();
  };

  const handleResetFilters = () => {
    setActiveZone('All');
    setSearchZone('');
    setSearchDate('');
    setStartTime('');
    setEndTime('');
    fetchDesks();
  };

  // Open booking modal
  const handleOpenBooking = (desk) => {
    if (!isLoggedIn) {
      setToast({ type: 'error', message: 'Please sign in to make a desk reservation.' });
      onOpenAuthModal();
      return;
    }
    setSelectedDesk(desk);
    setIsBookingOpen(true);
  };

  // Confirm booking
  const handleConfirmBooking = async (bookingData) => {
    const res = await bookingAPI.createBooking(bookingData);
    if (res && res.success) {
      setToast({ type: 'success', message: `Desk ${selectedDesk.deskNumber} reserved successfully!` });
      fetchDesks();
    }
  };

  // Admin save desk (Create or Update)
  const handleSaveDeskAdmin = async (deskData, deskId) => {
    if (deskId) {
      await deskAPI.updateDesk(deskId, deskData);
      setToast({ type: 'success', message: `Desk ${deskData.deskNumber} updated successfully!` });
    } else {
      await deskAPI.createDesk(deskData);
      setToast({ type: 'success', message: `Desk ${deskData.deskNumber} created successfully!` });
    }
    fetchDesks();
  };

  // Admin delete desk
  const handleDeleteDeskAdmin = async (deskId) => {
    if (window.confirm('Are you sure you want to delete this desk from inventory?')) {
      try {
        await deskAPI.deleteDesk(deskId);
        setToast({ type: 'success', message: 'Desk removed from inventory.' });
        fetchDesks();
      } catch (err) {
        setToast({ type: 'error', message: err.message || 'Failed to delete desk.' });
      }
    }
  };

  const zonesList = ['All', 'Quiet Zone', 'Executive Suite', 'Collaborative Hub', 'Studio'];

  return (
    <div className="space-y-12 pb-20">
      
      {/* Editorial Hero Banner */}
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

      {/* Main Inventory Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-warm-border/60">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta block">
              Workspace Catalogue
            </span>
            <h2 className="text-3xl font-serif font-bold text-warm-dark mt-1">
              Available Desk Inventory ({desks.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Zone Filter Tabs */}
            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-warm-border shadow-warm-sm">
              {zonesList.map((z) => (
                <button
                  key={z}
                  onClick={() => setActiveZone(z)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeZone === z
                      ? 'bg-warm-dark text-white shadow-warm-sm'
                      : 'text-warm-muted hover:text-warm-dark hover:bg-warm-bg'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>

            {/* Admin Add Desk Button */}
            {isAdmin && (
              <button
                onClick={() => {
                  setAdminDeskToEdit(null);
                  setIsAdminModalOpen(true);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold uppercase tracking-wider shadow-warm-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Desk</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold uppercase tracking-wider text-warm-muted">
              Fetching Desk Inventory...
            </p>
          </div>
        ) : error ? (
          <div className="my-12 p-8 rounded-3xl bg-white border border-red-200 text-center max-w-md mx-auto shadow-warm-md">
            <h3 className="text-lg font-serif font-bold text-red-600 mb-2">Inventory Connection Error</h3>
            <p className="text-xs text-warm-muted mb-4">{error}</p>
            <button
              onClick={fetchDesks}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-warm-dark text-white text-xs font-bold uppercase tracking-wider"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Load</span>
            </button>
          </div>
        ) : desks.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-white rounded-3xl border border-warm-border p-10 my-8 shadow-warm-sm">
            <div className="w-12 h-12 rounded-2xl bg-warm-bg border border-warm-border flex items-center justify-center text-warm-muted mx-auto">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-warm-dark">No Desks Found</h3>
            <p className="text-xs text-warm-muted">
              No available desks match your selected zone or date/time range. Try adjusting your search filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-warm-dark text-white text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Desks Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {desks.map((desk) => (
              <DeskCard
                key={desk._id}
                desk={desk}
                onBook={handleOpenBooking}
                onEdit={(d) => {
                  setAdminDeskToEdit(d);
                  setIsAdminModalOpen(true);
                }}
                onDelete={handleDeleteDeskAdmin}
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

      {/* Admin Desk Modal */}
      <AdminDeskModal
        deskToEdit={adminDeskToEdit}
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSave={handleSaveDeskAdmin}
      />

    </div>
  );
}
