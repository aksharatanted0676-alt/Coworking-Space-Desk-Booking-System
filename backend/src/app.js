const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const deskRoutes = require('./routes/deskRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const occupancyRoutes = require('./routes/occupancyRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route / Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Coworking Space Desk Booking System API is operational',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/desks', deskRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/occupancy', occupancyRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
