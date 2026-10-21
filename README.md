# 📋 Job Application Tracker

A full-stack MERN application to track job applications, with secure signup/login, per-user data, a stats dashboard, and an **AI cover letter generator**.

**🔗 Live Demo:** https://job-application-tracker-henna-nine.vercel.app/

## Features
- 🔐 Signup and login with JWT authentication and bcrypt password hashing
- 🛡️ Protected routes: each user can access only their own data
- ➕ Add, edit, and delete applications (company, role, link, status, dates, notes)
- 🔎 Search by company and filter by status (Applied, Interview, Offer, Rejected)
- 📊 Dashboard with counts for each status
- ⏰ Follow-up reminder for applications with no update in 5+ days
- ✨ **AI cover letter generator:** generates a tailored cover letter for any application from your skills and the job description (Google Gemini API)
- 🎨 Dark purple glassmorphism UI with hover and fade-in animations

## AI Cover Letter
Click **✨ Cover letter** on any application, paste the job description, and generate a letter.

- The AI request goes through the Express backend, so the **API key is never exposed** to the browser.
- The route is protected by JWT authentication, and each user is **rate limited** (10 requests per 15 minutes) to protect the free API quota.
- The prompt tells the model to use only the skills provided and not to invent experience, and to treat the job description as plain data.

## Tech Stack
- **Frontend:** React.js (Vite), React Router, Context API, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js, express-rate-limit
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JSON Web Tokens (JWT), bcryptjs
- **AI:** Google Gemini API
- **Deployment:** Vercel (frontend), Deplexo (backend)

## API Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Create an account | No |
| POST | `/auth/login` | Log in and get a token | No |
| GET | `/applications` | Get your applications | Yes |
| POST | `/applications` | Add an application | Yes |
| PUT | `/applications/:id` | Update an application | Yes |
| DELETE | `/applications/:id` | Delete an application | Yes |
| POST | `/ai/cover-letter` | Generate a cover letter | Yes |

Protected routes expect the header `Authorization: Bearer <token>`.

## How to Run Locally

**Backend**
```bash
cd server
npm install
npm run dev
```
Create `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_gemini_model_name
```

**Frontend**
```bash
cd client
npm install
npm run dev
```
Create `client/.env`:
```
VITE_API_URL=http://localhost:5000
```

## Author
**Amna Ishaq**: [GitHub](https://github.com/amnaverse)
