const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Desk = require('../src/models/Desk');
const Booking = require('../src/models/Booking');

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/coworking_test_db';

describe('Coworking Desk Booking System API Integration Tests', () => {
  let adminToken, memberToken, sampleDeskId;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await mongoose.connect(TEST_MONGO_URI);
    await User.deleteMany({});
    await Desk.deleteMany({});
    await Booking.deleteMany({});

    // Create seed admin user directly
    const adminUser = await User.create({
      name: 'Test Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = res.body.data.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Desk.deleteMany({});
    await Booking.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Authentication Endpoints (/api/auth)', () => {
    it('should ALWAYS create role = member on public registration even if role = admin is submitted', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Public Registrant',
          email: 'hacker_admin@example.com',
          password: 'password123',
          role: 'admin' // Attempting to escalate role via body
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('member'); // MUST BE MEMBER
    });

    it('should register a standard member user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Member',
          email: 'testmember@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.role).toBe('member');
      memberToken = res.body.data.token;
    });

    it('should login user and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testmember@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testmember@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Desk Management Endpoints (/api/desks)', () => {
    it('should reject desk creation by non-admin member', async () => {
      const res = await request(app)
        .post('/api/desks')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          deskNumber: 'D-999',
          zone: 'Quiet Zone'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow desk creation by admin', async () => {
      const res = await request(app)
        .post('/api/desks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          deskNumber: 'D-101',
          zone: 'Quiet Zone',
          equipment: ['Dual Monitor', 'Ergonomic Chair']
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.deskNumber).toBe('D-101');
      sampleDeskId = res.body.data._id;
    });

    it('should list all desks', async () => {
      const res = await request(app).get('/api/desks');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('Booking & Conflict Resolution Endpoints (/api/bookings)', () => {
    const startTime = '2026-10-15T10:00:00.000Z';
    const endTime = '2026-10-15T12:00:00.000Z';
    let bookingId;

    it('should reject unauthenticated booking attempt', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .send({
          deskId: sampleDeskId,
          startTime,
          endTime
        });

      expect(res.statusCode).toBe(401);
    });

    it('should allow a member to book an available desk (10:00 - 12:00)', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          deskId: sampleDeskId,
          startTime,
          endTime,
          notes: 'Focused work session'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      bookingId = res.body.data._id;
    });

    it('should REJECT an overlapping booking for the same desk (11:00 - 13:00)', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          deskId: sampleDeskId,
          startTime: '2026-10-15T11:00:00.000Z', // Overlaps 10:00 - 12:00
          endTime: '2026-10-15T13:00:00.000Z'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already booked');
    });

    it('should ALLOW an ADJACENT booking for the same desk (12:00 - 14:00)', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          deskId: sampleDeskId,
          startTime: '2026-10-15T12:00:00.000Z', // Starts exactly when previous ends
          endTime: '2026-10-15T14:00:00.000Z'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should reject invalid time range where startTime >= endTime', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          deskId: sampleDeskId,
          startTime: '2026-10-15T15:00:00.000Z',
          endTime: '2026-10-15T11:00:00.000Z'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should retrieve user bookings', async () => {
      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(1);
    });

    it('should allow user to cancel their booking', async () => {
      const res = await request(app)
        .put(`/api/bookings/${bookingId}/cancel`)
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('cancelled');
    });
  });

  describe('Occupancy Dashboard (/api/occupancy)', () => {
    it('should restrict access from non-admin members', async () => {
      const res = await request(app)
        .get('/api/occupancy?date=2026-10-15')
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.statusCode).toBe(403);
    });

    it('should return occupancy report for admin', async () => {
      const res = await request(app)
        .get('/api/occupancy?date=2026-10-15')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('summary');
      expect(res.body).toHaveProperty('hourlyStats');
    });
  });
});
