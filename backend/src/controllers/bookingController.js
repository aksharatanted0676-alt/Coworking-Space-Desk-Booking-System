const Booking = require('../models/Booking');
const Desk = require('../models/Desk');
const { checkTimeSlotConflict } = require('../utils/conflictChecker');

// @desc    Create a new desk booking with time-slot conflict validation
// @route   POST /api/bookings
// @access  Private (Member & Admin)
const createBooking = async (req, res, next) => {
  try {
    const { deskId, startTime, endTime, notes } = req.body;

    if (!deskId || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide deskId, startTime, and endTime'
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // 1. Validate date objects
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid startTime or endTime format'
      });
    }

    // 2. Validate time range sequence
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'startTime must be strictly earlier than endTime'
      });
    }

    // 3. Check if desk exists and is active
    const desk = await Desk.findById(deskId);
    if (!desk) {
      return res.status(404).json({
        success: false,
        message: 'Desk not found'
      });
    }

    if (desk.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Desk ${desk.deskNumber} is currently ${desk.status} and cannot be booked`
      });
    }

    // 4. Time-slot conflict check
    const conflict = await checkTimeSlotConflict(deskId, start, end);
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Desk ${desk.deskNumber} is already booked for an overlapping time slot (${new Date(conflict.startTime).toISOString()} to ${new Date(conflict.endTime).toISOString()})`,
        conflictingBooking: {
          id: conflict._id,
          startTime: conflict.startTime,
          endTime: conflict.endTime
        }
      });
    }

    // 5. Create booking
    const booking = await Booking.create({
      desk: deskId,
      user: req.user._id,
      startTime: start,
      endTime: end,
      notes,
      status: 'confirmed'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('desk', 'deskNumber zone equipment')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Desk booked successfully',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings (or all bookings if admin)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    const { status, deskId, date } = req.query;
    const filter = {};

    // Members can only see their own bookings; Admins can see all
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    if (status) filter.status = status;
    if (deskId) filter.desk = deskId;

    if (date) {
      const dayStart = new Date(`${date}T00:00:00.000Z`);
      const dayEnd = new Date(`${date}T23:59:59.999Z`);
      filter.startTime = { $lt: dayEnd };
      filter.endTime = { $gt: dayStart };
    }

    const bookings = await Booking.find(filter)
      .populate('desk', 'deskNumber zone equipment status')
      .populate('user', 'name email role')
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('desk', 'deskNumber zone equipment')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Authorization check: User can view their own booking, Admin can view any
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization: Owner or Admin can cancel
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get daily occupancy metrics for admin dashboard
// @route   GET /api/occupancy
// @access  Private (Admin only)
const getDailyOccupancy = async (req, res, next) => {
  try {
    const { date } = req.query;

    const targetDate = date ? new Date(date) : new Date();
    const dateStr = targetDate.toISOString().split('T')[0];

    const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
    const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

    // Get total desk count
    const totalDesks = await Desk.countDocuments({ status: 'available' });

    // Get all confirmed bookings for that date
    const dayBookings = await Booking.find({
      status: 'confirmed',
      startTime: { $lt: dayEnd },
      endTime: { $gt: dayStart }
    }).populate('desk', 'deskNumber zone').populate('user', 'name email');

    // Distinct desks booked today
    const uniqueBookedDeskIds = new Set(dayBookings.map((b) => b.desk._id.toString()));
    const occupiedDesksCount = uniqueBookedDeskIds.size;

    const occupancyPercentage = totalDesks > 0 
      ? Number(((occupiedDesksCount / totalDesks) * 100).toFixed(2)) 
      : 0;

    // Hourly occupancy matrix (8 AM to 8 PM)
    const hourlyStats = [];
    for (let hour = 8; hour <= 20; hour++) {
      const slotStart = new Date(`${dateStr}T${hour.toString().padStart(2, '0')}:00:00.000Z`);
      const slotEnd = new Date(`${dateStr}T${(hour + 1).toString().padStart(2, '0')}:00:00.000Z`);

      const activeInSlot = dayBookings.filter(
        (b) => b.startTime < slotEnd && b.endTime > slotStart
      );

      hourlyStats.push({
        hour: `${hour}:00 - ${hour + 1}:00`,
        bookedCount: activeInSlot.length,
        occupancyRate: totalDesks > 0 ? Number(((activeInSlot.length / totalDesks) * 100).toFixed(2)) : 0
      });
    }

    res.status(200).json({
      success: true,
      date: dateStr,
      summary: {
        totalAvailableDesks: totalDesks,
        totalBookings: dayBookings.length,
        uniqueDesksBooked: occupiedDesksCount,
        dailyOccupancyRate: `${occupancyPercentage}%`
      },
      hourlyStats,
      bookings: dayBookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  getDailyOccupancy
};
