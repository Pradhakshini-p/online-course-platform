# Online Course Platform - Design Document

## 1. Overall Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │  Router  │  │  Context │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js + Express)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │  │Controllers│ │Middleware│  │  Models  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    Mongoose ODM
                            │
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │ Courses  │  │Enrollments│ │ Progress │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Structure
- **Pages**: Home, Login, Signup, Course Catalog, Course Details, Student Dashboard, Instructor Dashboard, Course Builder, Lesson Player, Profile, Analytics
- **Components**: Navbar, CourseCard, FilterBar, LessonList, ProgressBar, VideoPlayer, ReviewCard
- **State Management**: React Context API for auth state
- **Routing**: React Router v6
- **Styling**: Tailwind CSS

### Backend Structure
```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── jwt.js             # JWT config
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Lesson.js
│   ├── Enrollment.js
│   ├── Progress.js
│   └── Review.js
├── routes/
│   ├── auth.js
│   ├── courses.js
│   ├── lessons.js
│   ├── enrollments.js
│   ├── progress.js
│   ├── reviews.js
│   └── analytics.js
├── controllers/
│   ├── authController.js
│   ├── courseController.js
│   ├── lessonController.js
│   ├── enrollmentController.js
│   ├── progressController.js
│   ├── reviewController.js
│   └── analyticsController.js
├── middleware/
│   ├── auth.js            # JWT verification
│   ├── roleCheck.js       # Role-based access control
│   └── errorHandler.js    # Global error handler
├── utils/
│   ├── validators.js      # Input validation
│   └── helpers.js         # Utility functions
├── .env                   # Environment variables
├── server.js              # Express app entry point
└── package.json
```

---

## 2. MongoDB Schema Design

### 2.1 User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  role: String (enum: ['student', 'instructor', 'admin'], default: 'student'),
  avatar: String (URL, optional),
  bio: String (optional, max 500 chars),
  skills: [String] (optional),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### 2.2 Course Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  instructor: ObjectId (ref: 'User', required),
  category: String (required, e.g., 'Web Development', 'Data Science'),
  level: String (enum: ['Beginner', 'Intermediate', 'Advanced'], required),
  price: Number (default: 0, min: 0),
  thumbnail: String (URL, optional),
  duration: Number (total minutes, calculated from lessons),
  totalLessons: Number (default: 0),
  enrolledCount: Number (default: 0),
  averageRating: Number (default: 0, min: 0, max: 5),
  totalReviews: Number (default: 0),
  isPublished: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### 2.3 Lesson Model
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: 'Course', required),
  sectionTitle: String (required, e.g., 'Introduction', 'Advanced Topics'),
  lessonNumber: Number (required, within section),
  title: String (required),
  description: String (optional),
  contentType: String (enum: ['video', 'text', 'quiz'], default: 'video'),
  videoUrl: String (optional, if contentType is 'video'),
  textContent: String (optional, if contentType is 'text'),
  duration: Number (minutes, required),
  isPreview: Boolean (default: false), // Free preview lesson
  createdAt: Date,
  updatedAt: Date
}
```

### 2.4 Enrollment Model
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: 'User', required),
  courseId: ObjectId (ref: 'Course', required),
  enrolledAt: Date (default: Date.now),
  completedAt: Date (optional),
  progress: Number (percentage, 0-100, default: 0),
  // Unique constraint on (studentId, courseId)
}
```

### 2.5 Progress Model
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: 'User', required),
  courseId: ObjectId (ref: 'Course', required),
  lessonId: ObjectId (ref: 'Lesson', required),
  completed: Boolean (default: false),
  completedAt: Date (optional),
  timeSpent: Number (minutes, default: 0),
  lastAccessedAt: Date (default: Date.now),
  // Unique constraint on (studentId, lessonId)
}
```

### 2.6 Review Model
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: 'User', required),
  courseId: ObjectId (ref: 'Course', required),
  rating: Number (required, min: 1, max: 5),
  comment: String (optional, max: 1000 chars),
  createdAt: Date (default: Date.now),
  updatedAt: Date,
  // Unique constraint on (studentId, courseId)
}
```

### Relationships Summary
- **User → Course**: One-to-Many (instructor creates courses)
- **Course → Lesson**: One-to-Many (course has multiple lessons)
- **User → Enrollment**: One-to-Many (student enrolls in multiple courses)
- **Enrollment → Course**: Many-to-One
- **User → Progress**: One-to-Many (student has progress on multiple lessons)
- **User → Review**: One-to-Many (student can review multiple courses)

---

## 3. REST API Endpoints

### 3.1 Authentication Endpoints

#### POST `/api/auth/register`
- **Description**: User registration
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student" // optional, defaults to 'student'
  }
  ```
- **Response** (201):
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
  ```
- **Access**: Public

#### POST `/api/auth/login`
- **Description**: User login
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "Login successful",
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
  ```
- **Access**: Public

#### POST `/api/auth/refresh`
- **Description**: Refresh access token
- **Request Body**:
  ```json
  {
    "refreshToken": "..."
  }
  ```
- **Response** (200):
  ```json
  {
    "accessToken": "..."
  }
  ```
- **Access**: Public (with valid refresh token)

#### POST `/api/auth/logout`
- **Description**: Logout (optional - can be handled client-side)
- **Access**: Authenticated

#### GET `/api/auth/me`
- **Description**: Get current user profile
- **Response** (200):
  ```json
  {
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "role": "...",
      "avatar": "...",
      "bio": "...",
      "skills": [...]
    }
  }
  ```
- **Access**: Authenticated

---

### 3.2 Course Endpoints

#### GET `/api/courses`
- **Description**: Get all published courses with filters
- **Query Params**: 
  - `category` (optional)
  - `level` (optional: Beginner/Intermediate/Advanced)
  - `minPrice`, `maxPrice` (optional)
  - `search` (optional: search in title/description)
  - `sort` (optional: 'newest', 'popular', 'rating', 'price')
  - `page`, `limit` (pagination)
- **Response** (200):
  ```json
  {
    "courses": [...],
    "total": 50,
    "page": 1,
    "pages": 5
  }
  ```
- **Access**: Public

#### GET `/api/courses/:id`
- **Description**: Get course details by ID
- **Response** (200):
  ```json
  {
    "course": {
      "_id": "...",
      "title": "...",
      "description": "...",
      "instructor": { "name": "...", "avatar": "..." },
      "category": "...",
      "level": "...",
      "price": 0,
      "thumbnail": "...",
      "duration": 120,
      "totalLessons": 15,
      "enrolledCount": 250,
      "averageRating": 4.5,
      "lessons": [...], // if enrolled or instructor
      "isEnrolled": false // if authenticated
    }
  }
  ```
- **Access**: Public (full details if enrolled/instructor, limited if not)

#### POST `/api/courses`
- **Description**: Create a new course
- **Request Body**:
  ```json
  {
    "title": "React Masterclass",
    "description": "...",
    "category": "Web Development",
    "level": "Intermediate",
    "price": 49.99,
    "thumbnail": "https://..."
  }
  ```
- **Response** (201):
  ```json
  {
    "message": "Course created successfully",
    "course": { ... }
  }
  ```
- **Access**: Instructor, Admin

#### PUT `/api/courses/:id`
- **Description**: Update course
- **Request Body**: Same as POST (all fields optional)
- **Response** (200): Updated course object
- **Access**: Course Instructor, Admin

#### DELETE `/api/courses/:id`
- **Description**: Delete course
- **Response** (200):
  ```json
  {
    "message": "Course deleted successfully"
  }
  ```
- **Access**: Course Instructor, Admin

#### GET `/api/courses/instructor/my-courses`
- **Description**: Get all courses created by current instructor
- **Response** (200): Array of courses
- **Access**: Instructor, Admin

---

### 3.3 Lesson Endpoints

#### GET `/api/courses/:courseId/lessons`
- **Description**: Get all lessons for a course
- **Response** (200):
  ```json
  {
    "lessons": [
      {
        "_id": "...",
        "sectionTitle": "Introduction",
        "lessonNumber": 1,
        "title": "...",
        "duration": 10,
        "isPreview": true
      }
    ]
  }
  ```
- **Access**: Public (limited info), Full if enrolled/instructor

#### POST `/api/courses/:courseId/lessons`
- **Description**: Add a lesson to a course
- **Request Body**:
  ```json
  {
    "sectionTitle": "Introduction",
    "lessonNumber": 1,
    "title": "Welcome to React",
    "description": "...",
    "contentType": "video",
    "videoUrl": "https://...",
    "duration": 15,
    "isPreview": false
  }
  ```
- **Response** (201): Created lesson
- **Access**: Course Instructor, Admin

#### PUT `/api/lessons/:id`
- **Description**: Update a lesson
- **Request Body**: Same as POST (all fields optional)
- **Response** (200): Updated lesson
- **Access**: Course Instructor, Admin

#### DELETE `/api/lessons/:id`
- **Description**: Delete a lesson
- **Response** (200): Success message
- **Access**: Course Instructor, Admin

#### GET `/api/lessons/:id`
- **Description**: Get lesson details (for player)
- **Response** (200): Full lesson object
- **Access**: Enrolled students, Course Instructor, Admin

---

### 3.4 Enrollment Endpoints

#### POST `/api/enrollments`
- **Description**: Enroll in a course
- **Request Body**:
  ```json
  {
    "courseId": "..."
  }
  ```
- **Response** (201):
  ```json
  {
    "message": "Enrolled successfully",
    "enrollment": { ... }
  }
  ```
- **Access**: Student, Admin

#### GET `/api/enrollments/my-courses`
- **Description**: Get all courses enrolled by current student
- **Response** (200):
  ```json
  {
    "enrollments": [
      {
        "course": { ... },
        "progress": 45,
        "enrolledAt": "..."
      }
    ]
  }
  ```
- **Access**: Student, Admin

#### GET `/api/enrollments/:courseId/status`
- **Description**: Check if student is enrolled in a course
- **Response** (200):
  ```json
  {
    "isEnrolled": true,
    "enrollment": { ... }
  }
  ```
- **Access**: Authenticated

---

### 3.5 Progress Endpoints

#### POST `/api/progress/complete`
- **Description**: Mark a lesson as completed
- **Request Body**:
  ```json
  {
    "courseId": "...",
    "lessonId": "..."
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "Lesson marked as completed",
    "progress": { ... },
    "courseProgress": 65 // overall course progress percentage
  }
  ```
- **Access**: Enrolled Student

#### GET `/api/progress/course/:courseId`
- **Description**: Get progress for a specific course
- **Response** (200):
  ```json
  {
    "courseId": "...",
    "totalLessons": 15,
    "completedLessons": 8,
    "progress": 53.33,
    "lessons": [
      {
        "lessonId": "...",
        "completed": true,
        "completedAt": "..."
      }
    ]
  }
  ```
- **Access**: Enrolled Student, Course Instructor

#### GET `/api/progress/overview`
- **Description**: Get overall progress for all enrolled courses
- **Response** (200):
  ```json
  {
    "totalCourses": 5,
    "completedCourses": 1,
    "inProgressCourses": 4,
    "courses": [
      {
        "courseId": "...",
        "courseTitle": "...",
        "progress": 75
      }
    ]
  }
  ```
- **Access**: Student

---

### 3.6 Review Endpoints

#### POST `/api/reviews`
- **Description**: Add a review for a course
- **Request Body**:
  ```json
  {
    "courseId": "...",
    "rating": 5,
    "comment": "Great course!"
  }
  ```
- **Response** (201): Created review
- **Access**: Enrolled Student (who completed course)

#### GET `/api/reviews/course/:courseId`
- **Description**: Get all reviews for a course
- **Query Params**: `page`, `limit`
- **Response** (200):
  ```json
  {
    "reviews": [
      {
        "_id": "...",
        "student": { "name": "...", "avatar": "..." },
        "rating": 5,
        "comment": "...",
        "createdAt": "..."
      }
    ],
    "total": 25
  }
  ```
- **Access**: Public

#### PUT `/api/reviews/:id`
- **Description**: Update own review
- **Request Body**: `rating`, `comment` (optional)
- **Response** (200): Updated review
- **Access**: Review Owner

#### DELETE `/api/reviews/:id`
- **Description**: Delete own review
- **Response** (200): Success message
- **Access**: Review Owner, Admin

---

### 3.7 Analytics Endpoints

#### GET `/api/analytics/instructor/overview`
- **Description**: Get instructor analytics overview
- **Response** (200):
  ```json
  {
    "totalCourses": 10,
    "totalStudents": 500,
    "totalRevenue": 25000,
    "averageRating": 4.6,
    "courses": [
      {
        "courseId": "...",
        "courseTitle": "...",
        "enrolledCount": 50,
        "completionRate": 65.5,
        "averageRating": 4.5,
        "revenue": 2500
      }
    ]
  }
  ```
- **Access**: Instructor, Admin

#### GET `/api/analytics/instructor/course/:courseId`
- **Description**: Get detailed analytics for a specific course
- **Response** (200):
  ```json
  {
    "course": { ... },
    "enrolledCount": 50,
    "completedCount": 30,
    "completionRate": 60,
    "averageProgress": 75.5,
    "lessons": [
      {
        "lessonId": "...",
        "lessonTitle": "...",
        "completedCount": 45,
        "completionRate": 90
      }
    ],
    "reviews": {
      "averageRating": 4.5,
      "totalReviews": 20,
      "ratingDistribution": { "5": 10, "4": 7, "3": 2, "2": 1, "1": 0 }
    }
  }
  ```
- **Access**: Course Instructor, Admin

---

### 3.8 Profile Endpoints

#### GET `/api/profile`
- **Description**: Get current user profile
- **Response** (200): User object with enrolled/created courses
- **Access**: Authenticated

#### PUT `/api/profile`
- **Description**: Update profile
- **Request Body**:
  ```json
  {
    "name": "...",
    "bio": "...",
    "skills": ["React", "Node.js"],
    "avatar": "https://..."
  }
  ```
- **Response** (200): Updated user
- **Access**: Authenticated

#### GET `/api/profile/:userId`
- **Description**: Get public profile of a user
- **Response** (200): Public user info
- **Access**: Public

---

## 4. Frontend Page & Component Structure

### Pages
1. **Home** (`/`) - Hero section, featured courses, categories
2. **Login** (`/login`) - Login form
3. **Signup** (`/signup`) - Registration form with role selection
4. **Course Catalog** (`/courses`) - Browse all courses with filters
5. **Course Details** (`/courses/:id`) - Course info, curriculum, reviews, enroll button
6. **Student Dashboard** (`/dashboard/student`) - Enrolled courses, progress overview
7. **Instructor Dashboard** (`/dashboard/instructor`) - Created courses, analytics
8. **Course Builder** (`/courses/:id/edit`) - Create/edit course and lessons
9. **Lesson Player** (`/courses/:id/lessons/:lessonId`) - Video player, lesson content, navigation
10. **Profile** (`/profile`) - User profile edit page
11. **Analytics** (`/analytics`) - Instructor analytics page

### Components
- **Navbar** - Navigation with auth state
- **CourseCard** - Course preview card
- **FilterBar** - Category, level, price filters
- **LessonList** - Curriculum/syllabus list
- **ProgressBar** - Progress indicator
- **VideoPlayer** - Video player component
- **ReviewCard** - Review display
- **ReviewForm** - Add/edit review
- **EnrollmentButton** - Enroll/Continue Learning button
- **ProtectedRoute** - Route wrapper for auth
- **RoleRoute** - Route wrapper for role-based access

---

## 5. Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/course-platform
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Next Steps

Once you approve this design, I'll help you generate code in this order:
1. Backend project setup (Express, MongoDB connection, middlewares)
2. Auth module (routes, controllers, JWT middleware)
3. Course & Lesson module (models, routes, controllers)
4. Enrollment & Progress module
5. Review & Analytics module
6. Frontend React app structure with routing
7. Key pages implementation (Catalog, Details, Dashboard)

Let me know which part you'd like to start with!

