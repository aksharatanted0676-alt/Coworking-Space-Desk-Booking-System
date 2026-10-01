const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    desk: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Desk',
      required: [true, 'Desk is required']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required']
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed'
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index to quickly query overlapping bookings for a desk
bookingSchema.index({ desk: 1, status: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema, 'bookings');
