# Backend Setup Instructions

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/course-platform

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Installation

```bash
cd backend
npm install
```

## Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/           # Route controllers (to be added)
├── middleware/
│   ├── errorHandler.js    # Global error handler
│   └── notFound.js        # 404 handler
├── models/                # Mongoose models (to be updated)
├── routes/                # Express routes (to be updated)
├── utils/
│   ├── helpers.js         # Utility functions
│   └── validators.js      # Input validation
├── .env                   # Environment variables (create this)
├── server.js              # Express app entry point
└── package.json
```

## Next Steps

1. Set up authentication module (JWT)
2. Create models (User, Course, Lesson, etc.)
3. Implement routes and controllers

