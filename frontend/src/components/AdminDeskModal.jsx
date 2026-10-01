import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, AlertCircle } from 'lucide-react';

export default function AdminDeskModal({ deskToEdit, isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const [deskNumber, setDeskNumber] = useState('');
  const [zone, setZone] = useState('Quiet Zone');
  const [equipmentInput, setEquipmentInput] = useState('');
  const [status, setStatus] = useState('available');
  const [capacity, setCapacity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (deskToEdit) {
      setDeskNumber(deskToEdit.deskNumber || '');
      setZone(deskToEdit.zone || 'Quiet Zone');
      setEquipmentInput(deskToEdit.equipment ? deskToEdit.equipment.join(', ') : '');
      setStatus(deskToEdit.status || 'available');
      setCapacity(deskToEdit.capacity || 1);
    } else {
      setDeskNumber('');
      setZone('Quiet Zone');
      setEquipmentInput('Dual Monitor, Ergonomic Chair');
      setStatus('available');
      setCapacity(1);
    }
    setErrorMsg(null);
  }, [deskToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!deskNumber || !zone) {
      setErrorMsg('Please provide a desk number and zone.');
      return;
    }

    const equipment = equipmentInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    setLoading(true);
    try {
      await onSave({
        deskNumber,
        zone,
        equipment,
        status,
        capacity: Number(capacity)
      }, deskToEdit?._id);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save desk details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A3026]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#CDD4B1] max-w-lg w-full p-6 sm:p-8 shadow-organic-lg relative overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl border border-[#CDD4B1] text-[#62685B] hover:text-[#2A3026] hover:bg-[#FFF9E2] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FEECD0] border border-[#DCA278]/30 flex items-center justify-center text-[#DCA278]">
            {deskToEdit ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#DCA278]">
              Admin Desk Inventory
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#2A3026]">
              {deskToEdit ? `Edit Desk ${deskToEdit.deskNumber}` : 'Create New Desk'}
            </h2>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#FFF5F5] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2A3026] uppercase tracking-wider mb-1.5">
                Desk Number / Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. D-301"
                value={deskNumber}
                onChange={(e) => setDeskNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-medium focus:ring-2 focus:ring-[#DCA278] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2A3026] uppercase tracking-wider mb-1.5">
                Workspace Zone
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-medium focus:ring-2 focus:ring-[#DCA278] outline-none"
              >
                <option value="Quiet Zone">Quiet Zone</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Collaborative Hub">Collaborative Hub</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2A3026] uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-medium focus:ring-2 focus:ring-[#DCA278] outline-none"
              >
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2A3026] uppercase tracking-wider mb-1.5">
                Capacity
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-medium focus:ring-2 focus:ring-[#DCA278] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2A3026] uppercase tracking-wider mb-1.5">
              Equipment / Amenities (Comma Separated)
            </label>
            <input
              type="text"
              placeholder="Dual 4K Monitor, Ergonomic Chair, Standing Desk"
              value={equipmentInput}
              onChange={(e) => setEquipmentInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#CDD4B1] bg-[#FFF9E2] text-[#2A3026] text-sm font-medium focus:ring-2 focus:ring-[#DCA278] outline-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#CDD4B1] text-[#62685B] hover:text-[#2A3026] text-xs font-bold uppercase tracking-wider transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#DCA278] hover:bg-[#C88D63] text-white text-xs font-bold uppercase tracking-wider shadow-organic-sm transition"
            >
              {loading ? 'Saving...' : 'Save Desk Inventory'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
