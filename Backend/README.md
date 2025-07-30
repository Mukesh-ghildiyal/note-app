# HD Notes Backend API

A Node.js backend API for the HD Notes application with OTP-based authentication and comprehensive rate limiting.

## Features

- ✅ OTP-based authentication (no passwords)
- ✅ Email OTP delivery
- ✅ JWT token authentication
- ✅ Notes CRUD operations
- ✅ User management
- ✅ MongoDB database
- ✅ RESTful API design
- ✅ **Comprehensive Rate Limiting**
- ✅ **Security Protection**

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Email Configuration
For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in EMAIL_PASS

### 4. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

## Rate Limiting

The API implements comprehensive rate limiting to prevent abuse:

### **General Rate Limiting**
- **100 requests per 15 minutes** per IP address
- Applied to all API endpoints

### **OTP Rate Limiting**
- **5 OTP requests per 15 minutes** per IP address
- Prevents OTP spam and abuse

### **Login Rate Limiting**
- **10 login attempts per 15 minutes** per IP address
- Protects against brute force attacks

### **User-Specific Rate Limiting**
- **100 requests per 15 minutes** per authenticated user
- Tracks by user ID for authenticated requests

### **Notes API Rate Limiting**
- **20 note creations per 15 minutes** per user
- **30 note deletions per 15 minutes** per user
- **50 general notes requests per 15 minutes** per IP

### **User Profile Rate Limiting**
- **30 profile requests per 15 minutes** per IP address

## API Endpoints

### Authentication

#### Send OTP
```
POST /api/v1/users/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Login
```
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Verify OTP (Signup)
```
POST /api/v1/users/verify-otp
Content-Type: application/json

{
  "name": "John Doe",
  "dob": "1990-01-01",
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Get User Profile
```
GET /api/v1/users/me
Authorization: Bearer <token>
```

### Notes

#### Get User's Notes
```
GET /api/v1/notes/me
Authorization: Bearer <token>
```

#### Create Note
```
POST /api/v1/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Note Title",
  "content": "Note content"
}
```

#### Get Single Note
```
GET /api/v1/notes/:id
Authorization: Bearer <token>
```

#### Update Note
```
PUT /api/v1/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Note
```
DELETE /api/v1/notes/:id
Authorization: Bearer <token>
```

## Database Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  dob: Date (required),
  timestamps: true
}
```

### Note
```javascript
{
  title: String (required),
  content: String (required),
  userId: ObjectId (required, ref: 'User'),
  timestamps: true
}
```

### OTP
```javascript
{
  email: String (required),
  otp: String (required),
  expiresAt: Date (required),
  isUsed: Boolean (default: false),
  timestamps: true
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

### Rate Limit Response
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

## Frontend Integration

This backend is designed to work with the HD Notes frontend React application. The API endpoints match exactly what the frontend expects:

- OTP-based authentication
- Notes management
- User profile data
- JWT token authentication

## Security Features

- JWT token authentication
- OTP expiration (10 minutes)
- Email verification
- Protected routes
- Input validation
- Error handling
- **Comprehensive rate limiting**
- **IP-based and user-based tracking**
- **Brute force protection**
- **API abuse prevention**

## Rate Limiting Headers

The API includes rate limiting headers in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when the limit resets 