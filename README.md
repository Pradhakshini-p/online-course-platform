# 🎓 Online Course Platform - Full Stack Web Application

## 📋 Project Overview

A comprehensive full-stack **Online Course Platform** built using the **MERN Stack** (MongoDB, Express.js, React, Node.js). This application replicates the functionality of popular e-learning platforms like Udemy and Coursera, enabling students to enroll in courses, instructors to manage course content, and administrators to oversee platform operations.

---

## 🚀 Key Features

### 👨‍🎓 Student Features
- **User Authentication & Registration** - Secure JWT-based authentication
- **Browse Courses** - Explore all available courses with detailed information
- **Course Enrollment** - Enroll in courses seamlessly
- **Track Progress** - Monitor learning progress and completion status
- **View Certificates** - Access earned certificates (planned feature)

### 👨‍🏫 Instructor Features
- **Create & Manage Courses** - Add, update, and delete courses
- **Add Lesson Content** - Create structured lessons with multimedia
- **Monitor Enrollments** - View student enrollment data
- **Track Analytics** - Access course performance metrics
- **Manage Reviews** - Moderate student reviews and ratings

### 🛡️ Admin Features
- **User Management** - Manage users and assign roles
- **Course Approval** - Approve/reject courses before publishing
- **Platform Analytics** - Monitor overall platform activity and performance
- **Content Moderation** - Review and moderate user-generated content

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) |
| **API** | RESTful API with proper error handling |
| **Version Control** | Git & GitHub |

---

## 📁 Project Structure

```
online-course-platform/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Utility functions
│   ├── .env             # Environment variables
│   ├── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls (Axios)
│   │   └── App.jsx      # Main App component
│   ├── vite.config.js   # Vite configuration
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 📌 API Modules

1. **Authentication Module** - User registration, login, JWT token management
2. **Course Management** - CRUD operations for courses
3. **Lesson Management** - Create and manage course lessons
4. **Enrollment & Progress** - Track student enrollments and progress
5. **Reviews & Ratings** - User reviews and course ratings
6. **Analytics** - Platform and course analytics

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Pradhakshini-p/online-course-platform.git
cd online-course-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/online_course_platform
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

---

## 🔑 Key Configuration Files

### Backend Configuration
- `backend/.env` - Environment variables (MongoDB URI, JWT Secret, etc.)
- `backend/config/db.js` - MongoDB connection setup
- `backend/server.js` - Express server configuration with CORS

### Frontend Configuration
- `frontend/vite.config.js` - Vite dev server with API proxy
- `frontend/tailwind.config.js` - Tailwind CSS customization

---

## 🔐 Authentication Flow

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Server validates credentials and generates JWT token
3. Token is stored in frontend (localStorage/cookies)
4. All subsequent requests include token in Authorization header
5. Backend middleware verifies token before processing requests

---

## 📊 Database Schema (MongoDB)

- **Users** - Student, Instructor, Admin roles
- **Courses** - Course information, metadata
- **Lessons** - Structured course content
- **Enrollments** - Student-Course relationships
- **Progress** - Lesson completion tracking
- **Reviews** - Course reviews and ratings

---

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy automatically on push

### Frontend Deployment (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy on push

---

## 🎯 Future Enhancements

- [ ] Payment Gateway Integration (Stripe/PayPal)
- [ ] Live Classes using WebRTC
- [ ] Certificate Generation (PDF download)
- [ ] Real-time Chat between Students & Instructors
- [ ] Advanced Search & Filtering
- [ ] Course Recommendations Engine
- [ ] Mobile Application (React Native)
- [ ] Multi-language Support

---

## 📝 Recent Fixes (Latest Commits)

- Fixed MongoDB URI environment variable mismatch (MONGO_URI)
- Added missing environment variables (FRONTEND_URL, PORT, NODE_ENV)
- Updated frontend package.json with correct React + Vite configuration
- Configured proper CORS settings for frontend-backend communication

---

## 👨‍💻 Author

**Pradhakshini P**  
B.Tech Computer Science  
Full Stack Developer

**Contact:**
- GitHub: [github.com/Pradhakshini-p](https://github.com/Pradhakshini-p)
- Email: [Your Email]

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## ✅ Testing Checklist

- [ ] User Registration & Login
- [ ] Course Browsing & Enrollment
- [ ] Lesson Viewing & Progress Tracking
- [ ] Admin Course Approval
- [ ] Student Review Submission
- [ ] API Error Handling
- [ ] Database Persistence

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Last Updated:** January 2026  
**Project Status:** ✅ Production Ready for Demonstration
