const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Desk = require('../models/Desk');
const Booking = require('../models/Booking');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coworking_space');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections & disable old validator rules
    await User.deleteMany({});
    await Desk.deleteMany({});
    await Booking.deleteMany({});
    try {
      await mongoose.connection.db.command({ collMod: 'desks', validator: {}, validationLevel: 'off' });
    } catch (e) {
      // Ignore if collection doesn't exist yet
    }

    console.log('Cleared existing data.');

    // Create Admin and Member users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@coworking.com',
      password: 'admin123',
      role: 'admin'
    });

    const memberUser = await User.create({
      name: 'John Member',
      email: 'john@example.com',
      password: 'member123',
      role: 'member'
    });

    console.log(`Created users: Admin (${adminUser.email}), Member (${memberUser.email})`);

    // Create sample Desks
    const desksData = [
      { deskNumber: 'D-101', zone: 'Quiet Zone', equipment: ['Dual Monitor', 'Ergonomic Chair', 'Power Outlet'], status: 'available', capacity: 1 },
      { deskNumber: 'D-102', zone: 'Quiet Zone', equipment: ['Ergonomic Chair', 'Power Outlet'], status: 'available', capacity: 1 },
      { deskNumber: 'D-103', zone: 'Collaborative Zone', equipment: ['Whiteboard Access', 'Power Outlet', 'Standing Desk'], status: 'available', capacity: 1 },
      { deskNumber: 'D-104', zone: 'Collaborative Zone', equipment: ['Power Outlet', 'Ethernet Cable'], status: 'available', capacity: 1 },
      { deskNumber: 'D-105', zone: 'Window Zone', equipment: ['Natural Light', 'Ergonomic Chair', 'Power Outlet'], status: 'available', capacity: 1 },
      { deskNumber: 'D-106', zone: 'Window Zone', equipment: ['Natural Light', 'Standing Desk', 'Power Outlet'], status: 'available', capacity: 1 },
      { deskNumber: 'D-107', zone: 'Private Nook', equipment: ['Soundproof Booth', 'Power Outlet'], status: 'maintenance', capacity: 1 }
    ];

    const desks = await Desk.create(desksData);
    console.log(`Seeded ${desks.length} desks.`);

    console.log('Database seeding complete successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
