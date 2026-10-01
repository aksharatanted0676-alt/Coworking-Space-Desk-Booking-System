import React, { useState, useEffect } from 'react';
import { occupancyAPI, deskAPI } from '../api/apiClient';
import AdminDeskModal from '../components/AdminDeskModal';
import { LayoutDashboard, Calendar, Percent, Users, Layers, Plus, RefreshCw, AlertCircle, Clock } from 'lucide-react';

export default function AdminDashboardPage({ setToast }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [occupancyData, setOccupancyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin Desk Modal State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const fetchOccupancy = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await occupancyAPI.getDailyOccupancy(selectedDate);
      if (res && res.success) {
        setOccupancyData(res);
      }
    } catch (err) {
      console.error('Fetch Occupancy Error:', err);
      setError(err.message || 'Failed to load occupancy report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccupancy();
  }, [selectedDate]);

  const handleSaveDesk = async (deskData) => {
    try {
      await deskAPI.createDesk(deskData);
      setToast({ type: 'success', message: `Desk ${deskData.deskNumber} added to inventory.` });
      fetchOccupancy();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to create desk.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-warm-border/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta flex items-center space-x-1.5">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Administrator Portal</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-warm-dark mt-1">
            Daily Occupancy & Utilization
          </h1>
        </div>

        {/* Date Selector & Add Desk */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-warm-border shadow-warm-sm">
            <Calendar className="w-4 h-4 text-warm-muted" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold text-warm-dark bg-transparent outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold uppercase tracking-wider shadow-warm-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Desk Inventory</span>
          </button>
        </div>
      </div>

      {/* Loading / Error States */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold uppercase tracking-wider text-warm-muted">
            Calculating Occupancy Analytics...
          </p>
        </div>
      ) : error ? (
        <div className="my-12 p-8 rounded-3xl bg-white border border-red-200 text-center max-w-md mx-auto shadow-warm-md">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h3 className="text-lg font-serif font-bold text-red-600 mb-2">Access Denied / Analytics Error</h3>
          <p className="text-xs text-warm-muted mb-4">{error}</p>
          <button
            onClick={fetchOccupancy}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-warm-dark text-white text-xs font-bold uppercase tracking-wider"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      ) : occupancyData ? (
        <div className="space-y-8">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Occupancy Rate */}
            <div className="bg-white p-6 rounded-2xl border border-warm-border shadow-warm-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">Occupancy Rate</span>
                <div className="p-2 rounded-xl bg-terracotta-light text-terracotta">
                  <Percent className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-serif font-bold text-warm-dark">
                  {occupancyData.summary?.dailyOccupancyRate || '0%'}
                </span>
                <span className="block text-[11px] text-warm-muted mt-1">Based on total available inventory</span>
              </div>
            </div>

            {/* Total Available Desks */}
            <div className="bg-white p-6 rounded-2xl border border-warm-border shadow-warm-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">Active Inventory</span>
                <div className="p-2 rounded-xl bg-warm-bg text-warm-dark">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-serif font-bold text-warm-dark">
                  {occupancyData.summary?.totalAvailableDesks || 0} Desks
                </span>
                <span className="block text-[11px] text-warm-muted mt-1">Operational desk spaces</span>
              </div>
            </div>

            {/* Unique Desks Booked Today */}
            <div className="bg-white p-6 rounded-2xl border border-warm-border shadow-warm-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">Desks Occupied</span>
                <div className="p-2 rounded-xl bg-sage-light text-sage">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-serif font-bold text-warm-dark">
                  {occupancyData.summary?.uniqueDesksBooked || 0}
                </span>
                <span className="block text-[11px] text-warm-muted mt-1">Unique desks reserved for {selectedDate}</span>
              </div>
            </div>

            {/* Total Bookings Count */}
            <div className="bg-white p-6 rounded-2xl border border-warm-border shadow-warm-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-warm-muted uppercase tracking-wider">Total Slots</span>
                <div className="p-2 rounded-xl bg-amber-soft text-amber-accent">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-serif font-bold text-warm-dark">
                  {occupancyData.summary?.totalBookings || 0} Bookings
                </span>
                <span className="block text-[11px] text-warm-muted mt-1">Time slot reservations</span>
              </div>
            </div>

          </div>

          {/* Hourly Occupancy Timeline Chart */}
          <div className="bg-white rounded-3xl border border-warm-border p-6 sm:p-8 shadow-warm-sm">
            <div className="flex items-center justify-between pb-6 border-b border-warm-border/60">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-warm-muted block">
                  Hourly Distribution
                </span>
                <h3 className="text-xl font-serif font-bold text-warm-dark mt-0.5">
                  Hourly Occupancy Timeline (8:00 AM – 8:00 PM)
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-xs text-warm-muted">
                <Clock className="w-4 h-4 text-terracotta" />
                <span>Real-time Utilization</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {occupancyData.hourlyStats?.map((slot, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-warm-bg border border-warm-border flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-warm-dark">
                    <span>{slot.hour}</span>
                    <span className="text-terracotta font-bold">{slot.bookedCount} Desk(s) Booked</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-warm-border/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-terracotta h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(slot.occupancyRate, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-warm-muted">
                    <span>Capacity: {occupancyData.summary?.totalAvailableDesks}</span>
                    <span className="font-bold">{slot.occupancyRate}% Utilization</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmed Bookings List */}
          <div className="bg-white rounded-3xl border border-warm-border p-6 sm:p-8 shadow-warm-sm">
            <h3 className="text-xl font-serif font-bold text-warm-dark mb-4">
              Active Reservations on {selectedDate} ({occupancyData.bookings?.length || 0})
            </h3>

            {occupancyData.bookings?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-warm-dark">
                  <thead className="bg-warm-bg border-b border-warm-border text-warm-muted uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Desk</th>
                      <th className="py-3 px-4">Zone</th>
                      <th className="py-3 px-4">Member Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Time Slot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-border/60 font-medium">
                    {occupancyData.bookings.map((b) => (
                      <tr key={b._id} className="hover:bg-warm-bg/50 transition">
                        <td className="py-3 px-4 font-bold text-terracotta">Desk {b.desk?.deskNumber || 'N/A'}</td>
                        <td className="py-3 px-4">{b.desk?.zone || '-'}</td>
                        <td className="py-3 px-4 font-semibold">{b.user?.name || 'Member'}</td>
                        <td className="py-3 px-4 text-warm-muted">{b.user?.email || '-'}</td>
                        <td className="py-3 px-4 font-mono">
                          {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-warm-muted italic py-4">No active desk reservations found for {selectedDate}.</p>
            )}
          </div>

        </div>
      ) : null}

      {/* Admin Add Desk Modal */}
      <AdminDeskModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSave={handleSaveDesk}
      />

    </div>
  );
}
