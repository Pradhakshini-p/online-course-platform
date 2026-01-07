# 🚀 Complete Setup Guide - Online Course Platform

## Quick Start (First Time Setup)

This guide walks you through setting up the Online Course Platform on your local machine.

---

## ✅ Prerequisites

Before starting, ensure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - Either [local installation](https://docs.mongodb.com/manual/installation/) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **Git** - [Download](https://git-scm.com/)
- A code editor (VS Code recommended)

---

## 📥 Step 1: Clone the Repository

```bash
git clone https://github.com/Pradhakshini-p/online-course-platform.git
cd online-course-platform
```

---

## ⚙️ Step 2: Backend Setup

### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

**Expected Output:**
```
added XXX packages in X.XXXs
```

### 2.2 Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cat > .env << EOF
MONGO_URI=mongodb://127.0.0.1:27017/online_course_platform
JWT_SECRET=your_jwt_secret_key_replace_this_in_production
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
EOF
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/online_course_platform
```

### 2.3 Test MongoDB Connection

```bash
node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected!')).catch(e => console.error('Error:', e))"
```

---

## 🎨 Step 3: Frontend Setup

### 3.1 Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

**Expected Output:**
```
added XXX packages in X.XXXs
```

### 3.2 Verify Vite Configuration

The `vite.config.js` should have:
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

This ensures frontend API calls to `/api` are proxied to the backend.

---

## 🏃 Step 4: Run the Application

### Option 1: Two Terminal Windows (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running in development mode on port 5000
MongoDB Connected: 127.0.0.1
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.0  ready in XXX ms
→ Local:   http://localhost:3000/
```

### Option 2: Single Terminal (Using npm-run-all)

```bash
cd backend && npm install -g npm-run-all
npm-run-all --parallel "npm:backend" "npm:frontend"
```

---

## ✔️ Verification Checklist

After starting both servers:

- [ ] Backend runs on `http://localhost:5000`
- [ ] Frontend runs on `http://localhost:3000`
- [ ] MongoDB connection is successful
- [ ] No CORS errors in browser console
- [ ] API proxy works (check Network tab in DevTools)

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"success": true, "message": "Server is running"}
```

---

## 🔧 Troubleshooting

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (if needed)
kill -9 <PID>
```

### Issue: "MongoDB connection failed"
**Solution:**
- Verify MongoDB is running: `mongo` or `mongosh`
- Check MONGO_URI in .env file
- For MongoDB Atlas, whitelist your IP

### Issue: "CORS errors in browser"
**Solution:**
- Verify FRONTEND_URL in backend .env
- Check vite.config.js proxy settings
- Restart backend server

### Issue: "npm install fails"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📂 Project Structure Reference

```
online-course-platform/
├── backend/
│   ├── .env              ← Environment config
│   ├── server.js         ← Express server
│   ├── config/db.js      ← MongoDB connection
│   ├── routes/           ← API endpoints
│   ├── controllers/      ← Business logic
│   ├── models/           ← Database schemas
│   └── middleware/       ← Auth, logging
├── frontend/
│   ├── vite.config.js    ← Frontend config
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/  ← API calls
│   └── tailwind.config.js
└── README.md         ← Project overview
```

---

## 🧪 Testing the API

### Using curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'
```

### Using Postman:
1. Import endpoints from backend/routes/
2. Test each endpoint
3. Verify CORS headers in response

---

## 🏁 Development Commands

**Backend:**
- `npm run dev` - Start with hot reload
- `npm start` - Start normally
- `npm test` - Run tests (if configured)

**Frontend:**
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview build

---

## 🚀 Production Deployment

### Build Frontend:
```bash
cd frontend
npm run build
```

This creates a `dist` folder ready for deployment.

### Deploy to Vercel/Netlify:
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Deploy Backend:
Use Render, Railway, or Heroku with environment variables.

---

## 📞 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review GitHub Issues
3. Check console/terminal output for error messages
4. Ensure all prerequisites are installed

---

**Last Updated:** January 2026  
**Status:** ✅ Setup Complete
