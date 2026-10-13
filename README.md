# Job Application Tracker

A full-stack MERN application to track job applications with secure signup/login, per-user data, status tracking, search and filters, and a stats dashboard.

**Live Demo:** https://job-application-tracker-henna-nine.vercel.app/

## Features
- Signup and login with JWT authentication and bcrypt password hashing
- Protected routes: each user can access only their own data
- Full CRUD for job applications
- Search by company and filter by status
- Dashboard with application stats
- Follow-up reminders

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcrypt
- **Deployment:** Vercel (frontend), cloud-hosted backend

## Run Locally
```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

Create a `.env` file in the backend folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Author
**Amna Ishaq** — [GitHub](https://github.com/amnaverse)
