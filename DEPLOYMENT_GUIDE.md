# Deployment & Staff Presentation Guide

## Quick Overview

This guide provides step-by-step instructions to:
1. **Deploy** the Online Course Platform to live servers
2. **Demonstrate** the project to staff/faculty
3. **Set up** local environment for presentations

---

## Part 1: LOCAL SETUP (For Presentations & Testing)

### Option A: Quick Local Setup (15 minutes)

Use this for fast setup on your laptop for demonstrations.

#### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org/))
- MongoDB Atlas free account ([Sign up](https://www.mongodb.com/cloud/atlas))
- Git installed

#### Steps

**1. Clone the Repository**
```bash
git clone https://github.com/Pradhakshini-p/online-course-platform.git
cd online-course-platform
```

**2. Setup Backend**
```bash
cd backend
npm install
```

**3. Configure Backend Environment**
- Copy `.env.example` to `.env`
  ```bash
  cp .env.example .env
  ```
- Edit `.env` and replace placeholders:
  ```env
  MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/online_course_platform
  JWT_SECRET=your_secret_key_here
  FRONTEND_URL=http://localhost:3000
  PORT=5000
  NODE_ENV=development
  ```

**4. Start Backend Server**
```bash
npm run dev
```
You should see: `Server running on http://localhost:5000`

**5. Setup Frontend (New Terminal)**
```bash
cd frontend
npm install
```

**6. Start Frontend**
```bash
npm run dev
```
You should see: `Local: http://localhost:3000`

**7. Access Application**
- Open browser: `http://localhost:3000`
- **Demo Account:**
  - Email: `demo@student.com`
  - Password: `demo123`

---

### Option B: Docker Setup (If Available)

For consistent environment across machines:

```bash
# Create docker-compose.yml in root directory
docker-compose up
```

---

## Part 2: PRODUCTION DEPLOYMENT

### Backend Deployment (Express API)

#### Option 1: Deploy to Render.com (FREE TIER AVAILABLE)

**Step 1: Create Render Account**
- Visit [render.com](https://render.com/)
- Sign up with GitHub account

**Step 2: Create New Web Service**
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Fill in configuration:
   - **Name:** `online-course-platform-api`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (or `npm run dev` if you have a start script)

**Step 3: Add Environment Variables**
In Render dashboard:
1. Go to "Environment" tab
2. Add variables:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/online_course_platform
   JWT_SECRET=your_production_secret_key
   FRONTEND_URL=https://your-frontend-url.com
   NODE_ENV=production
   PORT=5000
   ```

**Step 4: Deploy**
- Render automatically deploys when you push to main branch
- Your API will be available at: `https://online-course-platform-api.onrender.com`

#### Option 2: Deploy to Railway.app

**Step 1: Create Railway Account**
- Visit [railway.app](https://railway.app/)
- Sign up with GitHub

**Step 2: Create New Project**
1. Click "New Project"
2. "Deploy from GitHub repo"
3. Select your repository

**Step 3: Configure**
- Railway detects Node.js automatically
- Add environment variables in dashboard
- Set start command if needed

**Step 4: Get Public URL**
- Railway provides a public URL automatically
- Update frontend API calls to use this URL

#### Option 3: Deploy to Heroku (Paid)

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI="your_mongo_uri"
heroku config:set JWT_SECRET="your_secret"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

### Frontend Deployment (React + Vite)

#### Option 1: Deploy to Vercel (RECOMMENDED)

**Step 1: Create Vercel Account**
- Visit [vercel.com](https://vercel.com/)
- Sign up with GitHub

**Step 2: Import Project**
1. Click "Add New" → "Project"
2. "Import Git Repository"
3. Select your GitHub repository
4. Select `frontend` folder as root directory

**Step 3: Configure**
1. **Build Command:** `npm run build`
2. **Output Directory:** `dist`
3. **Framework Preset:** Vite
4. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-api.onrender.com
   ```

**Step 4: Deploy**
- Click "Deploy"
- Your site will be live at: `https://your-project-name.vercel.app`

#### Option 2: Deploy to Netlify

**Step 1: Connect GitHub**
- Visit [netlify.com](https://netlify.com/)
- Click "Add new site" → "Import an existing project"
- Connect GitHub repository

**Step 2: Configure Build**
1. **Base directory:** `frontend`
2. **Build command:** `npm run build`
3. **Publish directory:** `dist`
4. **Environment variables:** Add `VITE_API_URL`

**Step 3: Deploy**
- Netlify automatically deploys when you push
- Your site will be live within minutes

#### Option 3: Deploy to AWS S3 + CloudFront

```bash
# Build frontend
cd frontend
npm run build

# Deploy to S3
aws s3 cp dist s3://your-bucket-name --recursive

# Update CloudFront distribution
# (Invalidate cache for instant updates)
```

---

## Part 3: MONGODB ATLAS SETUP (FREE)

For production database:

**Step 1: Create Atlas Account**
- Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create free account

**Step 2: Create Cluster**
1. Click "Build a Cluster"
2. Select "Shared Clusters" (FREE)
3. Choose cloud provider (AWS, Google Cloud, Azure)
4. Select region closest to you
5. Create cluster

**Step 3: Create Database User**
1. Go to "Database Access"
2. Click "Add New Database User"
3. Enter username and password
4. Copy connection string

**Step 4: Whitelist IP**
1. Go to "Network Access"
2. Click "Add IP Address"
3. Add your server IP or `0.0.0.0/0` (allows all IPs)

**Step 5: Get Connection String**
```
mongodb+srv://username:password@cluster.mongodb.net/online_course_platform?retryWrites=true&w=majority
```

---

## Part 4: STAFF PRESENTATION CHECKLIST

### Pre-Presentation Setup (Day Before)

- [ ] Test application locally (no errors)
- [ ] Ensure MongoDB is accessible
- [ ] Test all key features:
  - [ ] Student login/registration
  - [ ] Browse courses
  - [ ] Enroll in course
  - [ ] View lessons
  - [ ] Submit assignments
  - [ ] View progress
  - [ ] Instructor dashboard
  - [ ] Admin panel
- [ ] Prepare demo data (sample courses, users)
- [ ] Take screenshots for backup slides
- [ ] Practice 5-minute demo script

### During Presentation

#### Setup
1. **Start Backend & Frontend** (10 minutes early)
2. **Test WiFi connectivity** if presenting online
3. **Have backup plan:**
   - Pre-recorded video demonstration
   - Screenshots with annotations
   - Live deployed version URL

#### Demo Flow (5-10 minutes)

**Intro (1 min)**
```
"This is an Online Course Platform - a full-stack MERN application
that replicates e-learning platforms like Udemy. It supports students,
instructors, and administrators with different roles and features."
```

**Feature Demo (7 mins)**

1. **Student Journey (2 mins)**
   - Go to `http://localhost:3000`
   - Login with demo student account
   - Show course catalog
   - Enroll in a course
   - View lessons
   - Show progress tracking

2. **Instructor Dashboard (2 mins)**
   - Login as instructor
   - Show course creation flow
   - Show course analytics
   - Show student list

3. **Admin Panel (2 mins)**
   - Login as admin
   - Show user management
   - Show course approval system
   - Show platform analytics

4. **Code Quality (1 min)**
   - Show professional structure
   - Mention REST API endpoints
   - Highlight JWT authentication
   - Mention MongoDB for data persistence

### Talking Points

✅ **What Works Well**
- Full MERN stack implementation
- Role-based access control (Student, Instructor, Admin)
- RESTful API design
- JWT-based authentication
- Responsive UI with Tailwind CSS
- Professional code organization
- Comprehensive documentation
- Git best practices (branches, commits, PRs)

✅ **Technical Highlights**
- Express.js backend with middleware
- MongoDB for flexible data storage
- React with Vite for fast development
- Proper environment configuration
- Error handling and validation
- CORS configuration

✅ **Professional Standards**
- Security: No exposed credentials
- Version control: Clean commit history
- Documentation: README, Setup Guide, Contributing
- Code style: EditorConfig for consistency
- Git hygiene: .gitignore properly configured

### Handling Questions

**Q: Why use MongoDB instead of SQL?**
A: MongoDB provides flexibility for course/lesson data structure. Schema-less design allows easy modification.

**Q: How is authentication handled?**
A: JWT tokens issued on login, stored in localStorage. Validated on backend for each request.

**Q: How do you handle concurrent users?**
A: Node.js event-driven architecture handles concurrent requests. MongoDB ensures data consistency.

**Q: What about scaling?**
A: Can scale vertically (upgrade server) or horizontally (load balancer). MongoDB Atlas handles database scaling.

**Q: How is data secure?**
A: JWT authentication, password hashing, HTTPS in production, environment variables for secrets.

---

## Part 5: QUICK DEPLOYMENT SUMMARY

### Easiest Path (Recommended for Staff Demo)

1. **Use Local Setup** + **Pre-deployed version**
   - Show working local app (backup)
   - Show deployed production version
   - Best of both worlds

### Production Ready Path

**Backend:** Render.com or Railway
**Frontend:** Vercel
**Database:** MongoDB Atlas (Free tier)
**Monitoring:** Enable logs/metrics on deployment platform

### Cost Estimate
- Backend: Free (Render free tier or Railway)
- Frontend: Free (Vercel, Netlify free)
- Database: Free (MongoDB Atlas free tier)
- **Total Cost: $0/month**

---

## Part 6: POST-DEPLOYMENT CHECKLIST

- [ ] Backend API responds on production URL
- [ ] Frontend loads without errors
- [ ] Database connection works
- [ ] Authentication flow works
- [ ] File uploads work (if applicable)
- [ ] SSL certificate is valid (HTTPS)
- [ ] Error handling works properly
- [ ] Performance is acceptable
- [ ] Mobile responsive (test on phone)
- [ ] Update README with live URLs

---

## Part 7: TROUBLESHOOTING

### Backend Won't Start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process using port
kill -9 <PID>

# Check MongoDB connection
mongo "mongodb+srv://..."

# Check environment variables
echo $MONGO_URI
```

### Frontend Won't Load
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite

# Start with fresh cache
npm run dev -- --force
```

### CORS Error
- Check `FRONTEND_URL` in backend `.env`
- Ensure backend allows frontend origin
- Test API with Postman (should work without browser)

### MongoDB Connection Failed
- Check connection string in `.env`
- Verify IP whitelisting in MongoDB Atlas
- Check username/password credentials
- Ensure database name is correct

---

## Conclusion

Your Online Course Platform is ready for:
- ✅ Staff demonstrations
- ✅ Production deployment
- ✅ Portfolio showcase
- ✅ Interview presentations

**Recommended:** Deploy to Vercel + Render (free, fast, professional)
