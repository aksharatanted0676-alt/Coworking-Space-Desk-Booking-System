const Desk = require('../models/Desk');
const Booking = require('../models/Booking');

// @desc    Get all desks with optional filters (zone, status)
// @route   GET /api/desks
// @access  Public / Private
const getAllDesks = async (req, res, next) => {
  try {
    const { zone, status } = req.query;
    const filter = {};

    if (zone) filter.zone = new RegExp(zone, 'i');
    if (status) filter.status = status;

    const desks = await Desk.find(filter).sort({ deskNumber: 1 });

    res.status(200).json({
      success: true,
      count: desks.length,
      data: desks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available desks for a specific time range or date
// @route   GET /api/desks/available
// @access  Public / Private
// Params: date (YYYY-MM-DD), startTime (ISO / time string), endTime (ISO / time string)
const getAvailableDesks = async (req, res, next) => {
  try {
    const { date, startTime, endTime, zone } = req.query;

    let start, end;

    if (startTime && endTime) {
      start = new Date(startTime);
      end = new Date(endTime);
    } else if (date) {
      // Default to full day if only date is provided
      start = new Date(`${date}T00:00:00.000Z`);
      end = new Date(`${date}T23:59:59.999Z`);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either (startTime and endTime) or date parameter'
      });
    }

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date/time format'
      });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'startTime must be before endTime'
      });
    }

    // Find IDs of desks that are currently booked during this time range
    const bookedDeskIds = await Booking.find({
      status: 'confirmed',
      startTime: { $lt: end },
      endTime: { $gt: start }
    }).distinct('desk');

    // Build filter for available desks
    const deskFilter = {
      _id: { $nin: bookedDeskIds },
      status: 'available'
    };

    if (zone) {
      deskFilter.zone = new RegExp(zone, 'i');
    }

    const availableDesks = await Desk.find(deskFilter).sort({ deskNumber: 1 });

    res.status(200).json({
      success: true,
      count: availableDesks.length,
      timeSlot: {
        startTime: start,
        endTime: end
      },
      data: availableDesks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get desk by ID
// @route   GET /api/desks/:id
// @access  Public / Private
const getDeskById = async (req, res, next) => {
  try {
    const desk = await Desk.findById(req.params.id);
    if (!desk) {
      return res.status(404).json({
        success: false,
        message: 'Desk not found'
      });
    }

    res.status(200).json({
      success: true,
      data: desk
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new desk inventory item
// @route   POST /api/desks
// @access  Private (Admin only)
const createDesk = async (req, res, next) => {
  try {
    const { deskNumber, zone, equipment, status, capacity } = req.body;

    if (!deskNumber || !zone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide deskNumber and zone'
      });
    }

    const existingDesk = await Desk.findOne({ deskNumber });
    if (existingDesk) {
      return res.status(400).json({
        success: false,
        message: `Desk number ${deskNumber} already exists`
      });
    }

    const desk = await Desk.create({
      deskNumber,
      zone,
      equipment,
      status,
      capacity
    });

    res.status(201).json({
      success: true,
      message: 'Desk created successfully',
      data: desk
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update desk details
// @route   PUT /api/desks/:id
// @access  Private (Admin only)
const updateDesk = async (req, res, next) => {
  try {
    let desk = await Desk.findById(req.params.id);
    if (!desk) {
      return res.status(404).json({
        success: false,
        message: 'Desk not found'
      });
    }

    desk = await Desk.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Desk updated successfully',
      data: desk
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a desk
// @route   DELETE /api/desks/:id
// @access  Private (Admin only)
const deleteDesk = async (req, res, next) => {
  try {
    const desk = await Desk.findById(req.params.id);
    if (!desk) {
      return res.status(404).json({
        success: false,
        message: 'Desk not found'
      });
    }

    await desk.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Desk deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDesks,
  getAvailableDesks,
  getDeskById,
  createDesk,
  updateDesk,
  deleteDesk
};
