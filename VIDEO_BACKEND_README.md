# Video Learning Backend System

This document describes the new video learning backend system that has been added to the afro-learn application.

## 🎯 Overview

The video backend system provides a complete API for managing video-based learning content, including:
- Subjects and grades
- Units and lessons
- Video progress tracking
- User learning analytics

## 🏗️ Architecture

### Database Schema
The system uses the existing Prisma schema with the following key models:
- **User**: Learners and teachers
- **Subject**: Learning subjects (Math, English, Science, etc.)
- **Grade**: Primary school grades (P1, P2, P3, etc.)
- **Unit**: Subject units within grades
- **Lesson**: Individual video lessons within units
- **Progress**: User progress tracking
- **ProgressUnit**: Unit-level progress
- **ProgressVideo**: Video completion tracking

### API Endpoints

#### Video Routes (`/api/video`)

| Endpoint | Method | Description | Auth Required |
|-----------|--------|-------------|---------------|
| `/subjects` | GET | Get all subjects with units and lessons | No |
| `/courses/:subjectId/:gradeId` | GET | Get courses by subject and grade | No |
| `/units/:unitId` | GET | Get unit details with lessons | No |
| `/lessons/:lessonId` | GET | Get lesson details | No |
| `/progress/video` | POST | Update video progress | Yes |

## 🚀 Getting Started

### 1. Prerequisites
- Node.js and npm installed
- PostgreSQL database running
- Prisma CLI installed

### 2. Database Setup
```bash
# Navigate to the backend directory
cd afro-learn/src/server

# Install dependencies (if not already done)
npm install

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
node seed-video-data.js
```

### 3. Start the Backend Server
```bash
# Start the development server
npm run dev

# Or start the production server
npm start
```

## 📊 Sample Data

The seed script creates:
- **Grades**: Primary 1, Primary 2, Primary 3
- **Subjects**: Mathematics, English, Science, Social Studies
- **Units**: 
  - Mathematics P1: Numbers and Counting
  - Mathematics P2: Addition and Subtraction
  - English P1: Basic Reading
- **Lessons**: Multiple video lessons per unit

## 🔌 API Usage Examples

### Get All Subjects
```javascript
const response = await fetch('/api/video/subjects');
const subjects = await response.json();
```

### Get Courses by Subject and Grade
```javascript
const response = await fetch('/api/video/courses/1/1'); // Math, Primary 1
const courses = await response.json();
```

### Get Unit Details
```javascript
const response = await fetch('/api/video/units/1');
const unit = await response.json();
```

### Update Video Progress
```javascript
const progress = {
  lessonId: 1,
  unitId: 1,
  completed: true,
  currentTime: 300, // 5 minutes
  duration: 330 // 5:30 total
};

const response = await fetch('/api/video/progress/video', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(progress)
});
```

## 📱 Mobile App Integration

The mobile app includes a `VideoService` that provides:
- API client for all video endpoints
- Mock data fallback for development
- TypeScript interfaces for type safety
- Progress tracking integration

### Using VideoService in Mobile App
```typescript
import { VideoService } from '@/services';

const videoService = new VideoService();

// Get subjects
const subjects = await videoService.getSubjects();

// Get courses
const courses = await videoService.getCoursesBySubjectAndGrade(1, 1);

// Get unit details
const unit = await videoService.getUnitDetails(1);

// Update progress
await videoService.updateVideoProgress({
  lessonId: 1,
  unitId: 1,
  completed: true
});
```

## 🔧 Configuration

### Environment Variables
Make sure these are set in your `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/afro_learn"
JWT_SECRET="your-secret-key"
```

### Database Configuration
The system uses PostgreSQL with Prisma ORM. Update the `DATABASE_URL` in your `.env` file to point to your database.

## 🧪 Testing

### Test the API Endpoints
```bash
# Test subjects endpoint
curl http://localhost:3001/api/video/subjects

# Test courses endpoint
curl http://localhost:3001/api/video/courses/1/1

# Test unit endpoint
curl http://localhost:3001/api/video/units/1
```

### Test with Authentication
```bash
# First get a token by logging in
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Use the token to update progress
curl -X POST http://localhost:3001/api/video/progress/video \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"lessonId":1,"unitId":1,"completed":true}'
```

## 🚨 Error Handling

The API includes comprehensive error handling:
- **400**: Bad Request (missing required fields)
- **401**: Unauthorized (missing or invalid token)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error (server issues)

All errors return a JSON response with an `error` field containing the error message.

## 🔄 Progress Tracking

The system automatically tracks:
- Video completion status
- Unit progress
- Subject mastery levels
- Overall learning progress

Progress is calculated in real-time and stored in the database for analytics and reporting.

## 🎯 Next Steps

### Potential Enhancements
1. **Video Upload**: Add endpoints for teachers to upload video content
2. **Analytics**: Enhanced progress analytics and reporting
3. **Quizzes**: Add quiz functionality to lessons
4. **Gamification**: Points, badges, and achievements
5. **Recommendations**: AI-powered lesson recommendations

### Integration Points
- Connect with existing user management system
- Integrate with community features
- Add notification system for progress updates
- Connect with assessment and testing systems

## 📝 API Documentation

For detailed API documentation, see the individual route files in `src/server/routes/`.

## 🤝 Contributing

When adding new features to the video system:
1. Update the Prisma schema if needed
2. Add new routes to `videoRoutes.js`
3. Update the mobile app `VideoService`
4. Add tests for new functionality
5. Update this documentation

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Verify database exists

2. **Migration Errors**
   - Run `npx prisma migrate reset` to reset database
   - Check for schema conflicts

3. **API Errors**
   - Check server logs for detailed error messages
   - Verify endpoint URLs and parameters
   - Check authentication token validity

### Getting Help
- Check the server logs for detailed error information
- Verify all environment variables are set correctly
- Ensure database migrations have been run
- Check that the seed script has been executed

---

For more information, contact the development team or check the main project documentation.



