import React, { useState, useEffect } from 'react';
import { occupancyAPI, deskAPI, bookingAPI } from '../api/apiClient';
import AdminDeskModal from '../components/AdminDeskModal';
import FloorPlanMap from '../components/FloorPlanMap';
import { 
  ShieldCheck, 
  Layers, 
  Percent, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Power, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2,
  Map,
  List
} from 'lucide-react';

export default function AdminControlCenterPage({ setToast, activeAdminTab = 'dashboard' }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [tab, setTab] = useState(activeAdminTab);
  const [occupancyData, setOccupancyData] = useState(null);
  const [allDesks, setAllDesks] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin Modal State
  const [deskToEdit, setDeskToEdit] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    setTab(activeAdminTab);
  }, [activeAdminTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Occupancy Stats
      const occRes = await occupancyAPI.getDailyOccupancy(selectedDate);
      if (occRes && occRes.success) {
        setOccupancyData(occRes);
      }

      // 2. Fetch All Desks Inventory
      const desksRes = await deskAPI.getAllDesks();
      if (desksRes && desksRes.success) {
        setAllDesks(desksRes.data || []);
      }

      // 3. Fetch All Members' Bookings
      const bookingsRes = await bookingAPI.getBookings({ date: selectedDate });
      if (bookingsRes && bookingsRes.success) {
        setAllBookings(bookingsRes.data || []);
      }
    } catch (err) {
      console.error('Admin Control Center Error:', err);
      setError(err.message || 'Failed to load administrative data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [selectedDate]);

  // Inventory Actions
  const handleSaveDesk = async (deskData, deskId) => {
    try {
      if (deskId) {
        await deskAPI.updateDesk(deskId, deskData);
        setToast({ type: 'success', message: `Desk ${deskData.deskNumber} updated successfully!` });
      } else {
        await deskAPI.createDesk(deskData);
        setToast({ type: 'success', message: `Desk ${deskData.deskNumber} added to inventory!` });
      }
      fetchAdminData();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to save desk.' });
    }
  };

  const handleToggleDeskStatus = async (desk) => {
    const newStatus = desk.status === 'available' ? 'maintenance' : 'available';
    try {
      await deskAPI.updateDesk(desk._id, { status: newStatus });
      setToast({ type: 'success', message: `Desk ${desk.deskNumber} status changed to ${newStatus}.` });
      fetchAdminData();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update desk status.' });
    }
  };

  const handleDeleteDesk = async (deskId, deskNum) => {
    if (window.confirm(`Are you sure you want to delete Desk ${deskNum} from inventory?`)) {
      try {
        await deskAPI.deleteDesk(deskId);
        setToast({ type: 'success', message: `Desk ${deskNum} removed.` });
        fetchAdminData();
      } catch (err) {
        setToast({ type: 'error', message: err.message || 'Failed to delete desk.' });
      }
    }
  };

  const availableDesksCount = allDesks.filter(d => d.status === 'available').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      
      {/* Admin Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#DCA278] flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#DCA278]" />
            <span>Administrative Control Center</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
            Workspace Operations & Occupancy
          </h1>
        </div>

        {/* Date Selection & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 text-xs text-white">
            <Calendar className="w-4 h-4 text-[#DCA278]" />
            <span className="text-gray-300 font-semibold">Target Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-bold text-white outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => {
              setDeskToEdit(null);
              setIsAdminModalOpen(true);
            }}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#DCA278] hover:bg-[#C88D63] text-white text-xs font-bold uppercase tracking-wider shadow-organic-sm hover:shadow-organic-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Desk</span>
          </button>
        </div>
      </div>

      {/* Admin Section Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl bg-white/5 p-1.5 border border-white/10 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setTab('dashboard')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl transition-all duration-200 ${
            tab === 'dashboard' ? 'bg-[#DCA278] text-white shadow-organic-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          Control Center
        </button>
        <button
          onClick={() => setTab('inventory')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl transition-all duration-200 ${
            tab === 'inventory' ? 'bg-[#DCA278] text-white shadow-organic-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          Desk Inventory ({allDesks.length})
        </button>
        <button
          onClick={() => setTab('floormap')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl transition-all duration-200 ${
            tab === 'floormap' ? 'bg-[#DCA278] text-white shadow-organic-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          Visual Floor Map
        </button>
        <button
          onClick={() => setTab('occupancy')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl transition-all duration-200 ${
            tab === 'occupancy' ? 'bg-[#DCA278] text-white shadow-organic-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          Daily Occupancy Report
        </button>
        <button
          onClick={() => setTab('bookings')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl transition-all duration-200 ${
            tab === 'bookings' ? 'bg-[#DCA278] text-white shadow-organic-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          Members Bookings ({allBookings.length})
        </button>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#DCA278] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 animate-pulse-subtle">
            Loading Administrative Analytics...
          </p>
        </div>
      ) : error ? (
        <div className="my-12 p-8 rounded-3xl bg-[#2A1717] border border-red-500/30 text-center max-w-md mx-auto shadow-organic-md animate-fade-in">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <h3 className="text-lg font-serif font-bold text-red-400 mb-2">Admin Authorization Error</h3>
          <p className="text-xs text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchAdminData}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#DCA278] text-white text-xs font-bold uppercase tracking-wider"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          
          {/* 4 Summary Metric Cards */}
          {(tab === 'dashboard' || tab === 'occupancy') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* 1. Total Desk Count */}
              <div className="bg-[#1F241C] p-6 rounded-2xl border border-white/10 shadow-organic-sm hover:border-[#DCA278]/40 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Desk Inventory</span>
                  <div className="p-2 rounded-xl bg-white/10 text-white">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-serif font-bold text-white">{allDesks.length}</span>
                  <span className="block text-[11px] text-gray-400 mt-1">Desks registered in space</span>
                </div>
              </div>

              {/* 2. Available Desk Count */}
              <div className="bg-[#1F241C] p-6 rounded-2xl border border-white/10 shadow-organic-sm hover:border-[#DCA278]/40 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available Desks</span>
                  <div className="p-2 rounded-xl bg-green-500/20 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-serif font-bold text-white">{availableDesksCount}</span>
                  <span className="block text-[11px] text-gray-400 mt-1">Ready for instant booking</span>
                </div>
              </div>

              {/* 3. Confirmed Booking Count */}
              <div className="bg-[#1F241C] p-6 rounded-2xl border border-white/10 shadow-organic-sm hover:border-[#DCA278]/40 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirmed Bookings</span>
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-serif font-bold text-white">
                    {occupancyData?.summary?.totalBookings || 0}
                  </span>
                  <span className="block text-[11px] text-gray-400 mt-1">Bookings for {selectedDate}</span>
                </div>
              </div>

              {/* 4. Daily Occupancy Percentage */}
              <div className="bg-[#1F241C] p-6 rounded-2xl border border-white/10 shadow-organic-sm hover:border-[#DCA278]/40 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Occupancy Rate</span>
                  <div className="p-2 rounded-xl bg-[#DCA278]/20 text-[#DCA278]">
                    <Percent className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-serif font-bold text-[#DCA278]">
                    {occupancyData?.summary?.dailyOccupancyRate || '0%'}
                  </span>
                  <span className="block text-[11px] text-gray-400 mt-1">Occupancy percentage</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB: VISUAL FLOOR MAP */}
          {tab === 'floormap' && (
            <div className="space-y-4">
              <FloorPlanMap
                desks={allDesks}
                onEdit={(desk) => {
                  setDeskToEdit(desk);
                  setIsAdminModalOpen(true);
                }}
              />
            </div>
          )}

          {/* TAB 1: DESK INVENTORY MANAGEMENT TABLE */}
          {(tab === 'dashboard' || tab === 'inventory') && (
            <div className="bg-[#1F241C] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-organic-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#DCA278] block">
                    Administrative Inventory
                  </span>
                  <h2 className="text-xl font-serif font-bold text-white mt-0.5">
                    Desk Inventory Management ({allDesks.length})
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setDeskToEdit(null);
                    setIsAdminModalOpen(true);
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#DCA278] hover:bg-[#C88D63] text-white text-xs font-bold uppercase tracking-wider shadow-organic-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Desk</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-white">
                  <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Desk #</th>
                      <th className="py-3.5 px-4">Zone</th>
                      <th className="py-3.5 px-4">Amenities</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Capacity</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {allDesks.map((d) => (
                      <tr key={d._id} className="hover:bg-white/5 transition duration-150">
                        <td className="py-3.5 px-4 font-bold text-[#DCA278] text-sm">{d.deskNumber}</td>
                        <td className="py-3.5 px-4">{d.zone}</td>
                        <td className="py-3.5 px-4 text-gray-300">{d.equipment?.join(', ') || 'Standard'}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            d.status === 'available'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">{d.capacity || 1} Person</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleDeskStatus(d)}
                            className="p-1.5 rounded-lg border border-white/15 text-gray-300 hover:text-amber-400 hover:bg-amber-500/10 transition"
                            title={d.status === 'available' ? 'Set to Maintenance' : 'Set to Available'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeskToEdit(d);
                              setIsAdminModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-white/15 text-gray-300 hover:text-white hover:bg-white/10 transition"
                            title="Edit Desk"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDesk(d._id, d.deskNumber)}
                            className="p-1.5 rounded-lg border border-white/15 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition"
                            title="Delete Desk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: DAILY OCCUPANCY REPORT */}
          {(tab === 'dashboard' || tab === 'occupancy') && occupancyData && (
            <div className="bg-[#1F241C] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-organic-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#DCA278] block">
                    Occupancy Matrix
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                    Hourly Utilization Timeline (8:00 AM – 8:00 PM)
                  </h3>
                </div>
                <span className="text-xs text-gray-400 font-mono">Date: {selectedDate}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {occupancyData.hourlyStats?.map((slot, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 transition-transform duration-200 hover:scale-[1.02]">
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span>{slot.hour}</span>
                      <span className="text-[#DCA278] font-bold">{slot.bookedCount} Desk(s)</span>
                    </div>

                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#DCA278] h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${Math.min(slot.occupancyRate, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                      <span>Utilization</span>
                      <span className="font-bold text-white">{slot.occupancyRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ALL MEMBERS BOOKINGS OVERVIEW */}
          {(tab === 'dashboard' || tab === 'bookings') && (
            <div className="bg-[#1F241C] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-organic-sm space-y-6">
              <div className="pb-4 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-[#DCA278] block">
                  Space-Wide Reservations
                </span>
                <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                  All Members' Bookings ({allBookings.length})
                </h3>
              </div>

              {allBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-white">
                    <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Desk</th>
                        <th className="py-3.5 px-4">Zone</th>
                        <th className="py-3.5 px-4">Member Name</th>
                        <th className="py-3.5 px-4">Member Email</th>
                        <th className="py-3.5 px-4">Time Slot</th>
                        <th className="py-3.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {allBookings.map((b) => (
                        <tr key={b._id} className="hover:bg-white/5 transition duration-150">
                          <td className="py-3.5 px-4 font-bold text-[#DCA278]">Desk {b.desk?.deskNumber || 'N/A'}</td>
                          <td className="py-3.5 px-4">{b.desk?.zone || '-'}</td>
                          <td className="py-3.5 px-4 font-semibold text-white">{b.user?.name || 'Member'}</td>
                          <td className="py-3.5 px-4 text-gray-400">{b.user?.email || '-'}</td>
                          <td className="py-3.5 px-4 font-mono text-gray-300">
                            {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.status === 'confirmed'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic py-4">No reservations found for {selectedDate}.</p>
              )}
            </div>
          )}

        </div>
      )}

      {/* Admin Desk Modal */}
      <AdminDeskModal
        deskToEdit={deskToEdit}
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSave={handleSaveDesk}
      />

    </div>
  );
}
