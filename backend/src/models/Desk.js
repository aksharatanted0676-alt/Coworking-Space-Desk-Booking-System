const mongoose = require('mongoose');

const deskSchema = new mongoose.Schema(
  {
    deskNumber: {
      type: String,
      required: [true, 'Desk number is required'],
      unique: true,
      trim: true
    },
    zone: {
      type: String,
      required: [true, 'Zone is required'],
      trim: true
    },
    equipment: {
      type: [String],
      default: ['Power Outlet', 'High-Speed Wi-Fi']
    },
    status: {
      type: String,
      enum: ['available', 'maintenance', 'inactive'],
      default: 'available'
    },
    capacity: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Desk', deskSchema, 'desks');
