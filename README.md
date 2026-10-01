# 🏢 Coworking Space Desk Booking System

A full-stack **Coworking Space Desk Booking System** that allows users to view available desks, select a workspace, make bookings, and manage their reservations through a modern web interface.

The project is built using a separate **frontend and backend architecture**, with the frontend deployed on Vercel and the backend deployed on Render.

---

## 🌐 Live Demo

### Frontend

🔗 **Live Website:**
https://coworking-space-desk-booking-system.vercel.app

### Backend

🔗 **Backend API:**
https://coworking-space-desk-booking-system.onrender.com

> The frontend communicates with the deployed backend API to process desk booking operations and manage application data.

---

## 📌 Project Overview

The **Coworking Space Desk Booking System** is designed to simplify the process of reserving desks in a coworking environment.

Instead of manually checking desk availability or maintaining bookings using spreadsheets, the system provides a centralized web application where users can:

* View available coworking desks
* Check desk information
* Select a desk
* Make a booking
* View booking details
* Manage reservations
* Interact with the system through a responsive web interface

The project demonstrates how a modern full-stack web application can connect a frontend interface with a backend API and database.

---

## ✨ Features

### 👤 User Features

* View available desks
* Browse coworking spaces
* View desk details
* Select a preferred desk
* Create desk bookings
* View booking information
* Manage reservations
* Responsive user interface

### 🪑 Desk Management

The system manages coworking desks and their availability.

Each desk can have information such as:

* Desk ID
* Desk number/name
* Location
* Type
* Availability
* Booking status

### 📅 Booking Management

Users can create and manage desk reservations.

The booking system helps prevent conflicts by checking desk availability before creating a reservation.

### 🔄 Real-Time Backend Communication

The frontend communicates with the backend using API requests.

The general flow is:

```text
User
  ↓
Frontend
  ↓
API Request
  ↓
Backend
  ↓
Database
  ↓
Backend Response
  ↓
Frontend
  ↓
User
```

---

# 🏗️ System Architecture

The project follows a **full-stack client-server architecture**.

```text
                  ┌──────────────────────┐
                  │        USER          │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │      FRONTEND        │
                  │       Vercel         │
                  │                      │
                  │  React / UI / Pages │
                  └──────────┬───────────┘
                             │
                         HTTP/API
                             │
                             ▼
                  ┌──────────────────────┐
                  │       BACKEND        │
                  │       Render         │
                  │                      │
                  │   REST API / Logic  │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │       DATABASE       │
                  │                      │
                  │  Users / Desks /     │
                  │  Bookings / Data     │
                  └──────────────────────┘
```

---

# 🛠️ Technologies Used

## Frontend

* React
* JavaScript
* HTML5
* CSS3
* Vite
* Responsive UI
* REST API integration

## Backend

* Node.js
* Express.js
* REST API
* JavaScript
* Environment variables
* Backend validation and business logic

## Database

The backend uses a database to store and manage application data such as:

* Desk information
* User information
* Booking information
* Reservation status

## Deployment

* **Frontend:** Vercel
* **Backend:** Render

---

# 📂 Project Structure

The project is divided into frontend and backend components.

```text
coworking-space-desk-booking-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── config/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

> The exact folder structure may vary depending on the implementation.

---

# 🔄 How the System Works

## 1. User Opens the Website

The user opens the deployed frontend:

https://coworking-space-desk-booking-system.vercel.app

The frontend loads the coworking space interface.

---

## 2. User Views Available Desks

The frontend requests desk information from the backend.

```text
Frontend
   ↓
GET Request
   ↓
Backend API
   ↓
Database
   ↓
Available Desks
   ↓
Frontend
```

The available desks are then displayed to the user.

---

## 3. User Selects a Desk

The user selects a preferred desk from the available options.

The frontend collects the required booking information.

---

## 4. Booking Request

When the user confirms the booking, the frontend sends the booking information to the backend.

```text
Frontend
   ↓
POST Booking Request
   ↓
Backend
   ↓
Validate Booking
   ↓
Check Desk Availability
   ↓
Save Booking
   ↓
Return Response
   ↓
Frontend
```

---

## 5. Backend Processes the Request

The backend validates the incoming data and checks whether the selected desk is available.

If the desk is available, the booking is stored in the database.

If the desk is already booked or the request is invalid, the backend returns an appropriate response.

---

## 6. Booking Confirmation

After successful booking, the backend sends a response to the frontend.

The frontend then updates the interface and displays the booking information to the user.

---

# 🔌 API Communication

The frontend communicates with the backend through HTTP requests.

### Backend Base URL

```text
https://coworking-space-desk-booking-system.onrender.com
```

Example API request structure:

```text
GET    /api/desks
POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
DELETE /api/bookings/:id
```

> The exact endpoint names depend on the routes implemented in the backend.

---

# 🔐 Environment Variables

Environment variables are used to keep configuration information separate from the source code.

Example:

```env
PORT=5000
DATABASE_URL=your_database_url
```

For the frontend, an API base URL can be configured using:

```env
VITE_API_URL=https://coworking-space-desk-booking-system.onrender.com
```

### Important

Sensitive information such as:

* Database passwords
* API keys
* Secret keys
* Authentication secrets

should **never be committed to GitHub**.

Use `.env` files locally and add them to `.gitignore`.

---

# 💻 Running the Project Locally

## Step 1 — Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project directory:

```bash
cd coworking-space-desk-booking-system
```

---

# 🚀 Running the Backend

Open a terminal and move to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_database_url
```

Start the backend:

```bash
npm start
```

For development, if a development script is available:

```bash
npm run dev
```

The backend will normally run at:

```text
http://localhost:5000
```

---

# 🎨 Running the Frontend

Open another terminal.

Move to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create/configure the frontend environment file if required:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🗄️ Database

The database is responsible for storing the application's persistent information.

Typical data handled by the system includes:

### Users

Stores information about users who interact with the booking system.

### Desks

Stores information about available coworking desks.

### Bookings

Stores reservation information and connects users with their selected desks.

A simplified relationship can be represented as:

```text
USER
 │
 │ creates
 ▼
BOOKING
 │
 │ reserves
 ▼
DESK
```

---

# 🧠 Main Backend Responsibilities

The backend is responsible for:

* Receiving API requests
* Validating incoming data
* Checking desk availability
* Creating bookings
* Retrieving bookings
* Updating booking information
* Cancelling/deleting bookings
* Communicating with the database
* Sending appropriate API responses
* Handling errors

---

# 🎨 Frontend Responsibilities

The frontend is responsible for:

* Displaying the user interface
* Showing available desks
* Collecting user input
* Sending API requests
* Displaying booking information
* Showing success/error messages
* Providing responsive navigation
* Providing an easy-to-use booking experience

---

# 🔒 Security Considerations

The application follows basic security practices such as:

* Environment variables for sensitive configuration
* `.gitignore` for preventing secret files from being committed
* Backend-side validation
* API request validation
* Database validation
* Separation of frontend and backend
* Error handling

Sensitive credentials should never be stored directly in frontend source code.

---

# 📱 Responsive Design

The frontend is designed to provide a usable experience across different screen sizes, including:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📱 Tablet

---

# 📸 Website View

1. Home Page
 <img width="1470" height="754" alt="Screenshot 2026-10-01 at 9 54 00 PM" src="https://github.com/user-attachments/assets/db90d4d7-aaf5-4846-b2a1-f3a1df5d4b47" />
<img width="1470" height="524" alt="Screenshot 2026-10-01 at 9 54 30 PM" src="https://github.com/user-attachments/assets/6d78901a-f533-467d-ae6f-4d7c9de016ed" />
<img width="1470" height="834" alt="Screenshot 2026-10-01 at 9 55 04 PM" src="https://github.com/user-attachments/assets/6822278f-7fa6-47a3-8bbe-d0ce82104dca" />

2. Desk Listing
<img width="1470" height="836" alt="Screenshot 2026-10-01 at 9 55 43 PM" src="https://github.com/user-attachments/assets/630dc786-6997-48fb-9aa3-0436a532a4bb" />

3. Desk Selection
<img width="1470" height="835" alt="Screenshot 2026-10-01 at 9 56 30 PM" src="https://github.com/user-attachments/assets/1951da4c-8473-430a-a0fb-3eb229239388" />
   
4. Booking Confirmation
<img width="1470" height="838" alt="Screenshot 2026-10-01 at 9 57 35 PM" src="https://github.com/user-attachments/assets/58d5658a-a246-4943-88eb-9be0f00b2cea" />

5. Admin Portal
<img width="1454" height="517" alt="Screenshot 2026-10-01 at 9 58 33 PM" src="https://github.com/user-attachments/assets/a6a76723-ee3a-4d0f-af3f-d5f9a8035699" />
<img width="1470" height="836" alt="Screenshot 2026-10-01 at 9 58 46 PM" src="https://github.com/user-attachments/assets/b66df2b1-612e-4761-a6a4-e62ddb8bab7e" />
<img width="1470" height="802" alt="Screenshot 2026-10-01 at 9 59 37 PM" src="https://github.com/user-attachments/assets/f7606ac0-a665-4c0f-8de8-ccfee6689d38" />
<img width="1470" height="831" alt="Screenshot 2026-10-01 at 9 59 55 PM" src="https://github.com/user-attachments/assets/62ca6745-c51f-4e57-b59e-69820f34fd07" />

6.In Admin Portal Can add new desk 
<img width="1470" height="838" alt="Screenshot 2026-10-01 at 10 00 41 PM" src="https://github.com/user-attachments/assets/633e0f24-2291-407b-af34-c4c6250ce380" />


---

# 🌐 Deployment

## Frontend Deployment

The frontend is deployed using **Vercel**.

🔗 Live Frontend:

https://coworking-space-desk-booking-system.vercel.app

Vercel automatically builds and deploys the frontend from the Git repository.

---

## Backend Deployment

The backend is deployed using **Render**.

🔗 Live Backend:

https://coworking-space-desk-booking-system.onrender.com

The backend provides the API used by the frontend.

---

# 🔗 Project Links

| Component   | Link                                                     |
| ----------- | -------------------------------------------------------- |
| 🌐 Frontend | https://coworking-space-desk-booking-system.vercel.app   |
| ⚙️ Backend  | https://coworking-space-desk-booking-system.onrender.com |
| 📦 GitHub   | Add your GitHub repository URL here                      |

---

# 📊 Project Workflow

```text
                  START
                    │
                    ▼
            Open Web Application
                    │
                    ▼
             View Available Desks
                    │
                    ▼
             Select Desired Desk
                    │
                    ▼
             Enter Booking Details
                    │
                    ▼
              Send Booking Request
                    │
                    ▼
               Backend API
                    │
                    ▼
            Validate Information
                    │
                    ▼
            Check Desk Availability
                    │
              ┌─────┴─────┐
              │           │
          Available    Not Available
              │           │
              ▼           ▼
        Save Booking    Return Error
              │
              ▼
        Send Confirmation
              │
              ▼
        Display Result
              │
              ▼
              END
```

---

# 🎯 Project Objectives

The main objectives of this project are:

1. To develop a digital coworking desk reservation system.
2. To provide an easy-to-use booking interface.
3. To manage desk availability efficiently.
4. To prevent conflicting reservations.
5. To connect a frontend application with a backend API.
6. To store booking information using a database.
7. To demonstrate full-stack web development concepts.
8. To deploy a complete web application using modern cloud platforms.

---

# 📚 Concepts Demonstrated

This project demonstrates practical knowledge of:

* Full-stack web development
* Frontend development
* Backend development
* REST APIs
* HTTP methods
* CRUD operations
* Database integration
* API communication
* Form handling
* Data validation
* Error handling
* Environment variables
* Git and GitHub
* Cloud deployment
* Vercel deployment
* Render deployment
* Responsive web design

---

# 🚀 Future Improvements

Possible future improvements include:

* User authentication and authorization
* Admin dashboard
* Online payment integration
* Email booking confirmation
* Booking history
* QR-code based check-in
* Advanced desk filtering
* Calendar-based booking
* Automatic booking cancellation
* Notifications and reminders
* Analytics dashboard
* Role-based access control

---

# 👩‍💻 Author

**Akshara Tanted**

B.Tech Computer Science & Engineering

---

# ⭐ Acknowledgement

This project was developed as a full-stack web development project to demonstrate the implementation of a real-world coworking space desk reservation system.

---

## 📄 License

This project is intended for educational and project demonstration purposes.
