const Booking = require('../models/Booking');

/**
 * Checks if a desk is already booked during the specified time slot.
 * Returns the conflicting booking document if found, otherwise null.
 * 
 * @param {string} deskId 
 * @param {Date} startTime 
 * @param {Date} endTime 
 * @param {string} [excludeBookingId] - Optional booking ID to exclude (useful when updating)
 * @returns {Promise<Object|null>}
 */
const checkTimeSlotConflict = async (deskId, startTime, endTime, excludeBookingId = null) => {
  const query = {
    desk: deskId,
    status: 'confirmed',
    startTime: { $lt: new Date(endTime) },
    endTime: { $gt: new Date(startTime) }
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(query).populate('user', 'name email');
  return conflictingBooking;
};

module.exports = {
  checkTimeSlotConflict
};
