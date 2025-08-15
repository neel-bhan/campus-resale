# Campus Resale API Documentation

**Base URL:** `http://localhost:3001`

## Authentication

For protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔗 Health Check

### GET /api/health

Check if the API is running.

**Authentication:** None required

**Response:**

```json
{
  "ok": true,
  "service": "backend",
  "time": "2025-08-15T03:07:11.450Z"
}
```

---

## 👤 User Management

### 1. POST /api/users/register

Register a new user.

**Authentication:** None required

**Request Body:**

```json
{
  "email": "student@university.edu",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "email": "student@university.edu",
      "name": "John Doe",
      "role": "student"
    }
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Email, password, and name are required"
}
```

**Response (Error - 409):**

```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2. POST /api/users/login

Login an existing user.

**Authentication:** None required

**Request Body:**

```json
{
  "email": "student@university.edu",
  "password": "password123"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "email": "student@university.edu",
      "name": "John Doe",
      "role": "student"
    }
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. GET /api/users/profile

Get current user's profile (protected).

**Authentication:** Required (JWT token)

**Request Body:** None

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "email": "student@university.edu",
      "name": "John Doe",
      "role": "student",
      "university": "University Name",
      "phone": "+1234567890",
      "createdAt": "2025-08-15T03:07:11.450Z"
    }
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "message": "Access token is required"
}
```

---

### 4. PUT /api/users/profile

Update current user's profile (protected).

**Authentication:** Required (JWT token)

**Request Body:**

```json
{
  "name": "John Updated",
  "university": "New University",
  "phone": "+1234567890"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Name is required"
}
```

---

### 5. PUT /api/users/change-password

Change user's password (protected).

**Authentication:** Required (JWT token)

**Request Body:**

```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Current password and new password are required"
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### 6. GET /api/users/users/:id

Get public profile of any user.

**Authentication:** None required

**URL Parameters:**

- `id` (integer): User ID

**Example:** `GET /api/users/users/2`

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "name": "John Doe",
      "university": "University Name",
      "role": "student",
      "createdAt": "2025-08-15T03:07:11.450Z"
    }
  }
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 7. DELETE /api/users/profile

Delete current user's account (protected).

**Authentication:** Required (JWT token)

**Request Body:** None

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "User account deleted successfully"
}
```

---

## 📋 Example Usage with cURL

### Register a new user:

```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@university.edu",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login:

```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@university.edu",
    "password": "password123"
  }'
```

### Get profile (with token):

```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Update profile:

```bash
curl -X PUT http://localhost:3001/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "John Updated",
    "university": "New University",
    "phone": "+1234567890"
  }'
```

---

## 🔒 Authentication Flow

1. **Register** or **Login** to get a JWT token
2. **Include the token** in the `Authorization: Bearer <token>` header for protected routes
3. **Token expires in 24 hours** - you'll need to login again

## 📝 Notes

- All requests and responses use `Content-Type: application/json`
- Passwords are automatically hashed with bcrypt
- JWT tokens expire after 24 hours
- Email addresses must be unique
- All timestamps are in ISO 8601 format (UTC)
