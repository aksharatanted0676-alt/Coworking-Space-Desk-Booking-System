# Coworking Space Desk Booking System - Backend API

Production-ready RESTful API backend built with Express.js and MongoDB (Mongoose) for managing desk inventory, user authorization, time-slot desk reservations, conflict detection, and daily occupancy monitoring in a coworking space.

---

## Features

- **Authentication & Authorization**: JWT-based login/registration with Role-Based Access Control (`member` vs `admin`).
- **Desk Inventory Management**: Full CRUD operations for desks with zone classification and equipment tracking (Admin only).
- **Time-Slot Conflict Prevention**: Overlapping booking detection algorithm rejecting double-booked desks with proper HTTP status codes.
- **Availability Search**: Query desks that are free for any given date and time range.
- **Admin Daily Occupancy Dashboard**: Occupancy percentage, utilization summary, and hourly reservation statistics.
- **Modular MVC Folder Architecture**: Clean separation of routes, controllers, models, middlewares, and utility helpers.
- **Postman Collection**: Includes pre-configured request collection for easy testing.

---

## Project Structure

```text
Backend Major Project/
├── src/
│   ├── config/
│   │   └── db.js                 # Database connection setup
│   ├── controllers/
│   │   ├── authController.js     # User registration, login & profile
│   │   ├── deskController.js     # Desk CRUD & availability lookups
│   │   └── bookingController.js  # Booking creation, conflict checks & occupancy stats
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT & role authorization (Admin/Member)
│   │   └── errorMiddleware.js    # Global error handler & 404 handler
│   ├── models/
│   │   ├── User.js               # Mongoose schema for User
│   │   ├── Desk.js               # Mongoose schema for Desk
│   │   └── Booking.js            # Mongoose schema for Booking
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── deskRoutes.js         # /api/desks routes
│   │   ├── bookingRoutes.js      # /api/bookings routes
│   │   └── occupancyRoutes.js    # /api/occupancy routes
│   ├── utils/
│   │   ├── conflictChecker.js    # Time slot overlapping validation helper
│   │   └── seed.js               # Seeder for admin user and desk inventory
│   ├── app.js                    # Express app setup & middleware pipeline
│   └── server.js                 # HTTP Server entry point
├── postman/
│   └── Coworking_Desk_Booking_API.postman_collection.json
├── tests/
│   └── api.test.js               # API Integration tests (Jest & Supertest)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB running locally or a MongoDB Atlas Connection URI

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment Variables:
   Copy `.env.example` to `.env` and set your credentials:
   ```bash
   cp .env.example .env
   ```
   Example `.env` configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/coworking_db
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

3. Seed Initial Data (Optional):
   Populates default Admin user (`admin@coworking.com` / `adminpassword123`) and desk inventory:
   ```bash
   npm run seed
   ```

4. Start Development Server:
   ```bash
   npm run dev
   ```

---

## API Endpoints Overview

| Category | Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public | Register new Member or Admin |
| **Auth** | `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| **Auth** | `GET` | `/api/auth/me` | Private | Get logged-in user profile |
| **Desks** | `GET` | `/api/desks` | Public | List all desks (filterable by zone/status) |
| **Desks** | `GET` | `/api/desks/available` | Public | Find free desks for time range (`?startTime=&endTime=`) |
| **Desks** | `POST` | `/api/desks` | Admin | Create a new desk |
| **Desks** | `PUT` | `/api/desks/:id` | Admin | Update desk details/status |
| **Desks** | `DELETE` | `/api/desks/:id` | Admin | Delete a desk |
| **Bookings** | `POST` | `/api/bookings` | Private | Create a desk reservation (with conflict check) |
| **Bookings** | `GET` | `/api/bookings` | Private | View bookings (Members see own, Admins see all) |
| **Bookings** | `PUT` | `/api/bookings/:id/cancel` | Private | Cancel a booking |
| **Occupancy**| `GET` | `/api/occupancy?date=YYYY-MM-DD` | Admin | Monitor daily occupancy & hourly statistics |

---

## Conflict Detection Algorithm

To prevent double-booking, a desk reservation is rejected with `HTTP 409 Conflict` if another active booking exists for the same desk satisfying:
$$\text{Existing.startTime} < \text{New.endTime} \quad \text{AND} \quad \text{Existing.endTime} > \text{New.startTime}$$

---

## Testing

Run automated API integration tests:
```bash
npm test
```
