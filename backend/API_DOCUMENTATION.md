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

````json
**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "password123",
  "name": "John Doe",
  "university": "University of California"
}
````

````

**Response (Success - 201):**

```json
**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      ## 📝 Notes

- **Image uploads**: Use `multipart/form-data` for post creation with images
- **Image storage**: Images are stored in the backend directory and served via `/images/` endpoint
- **Image access**: Frontend can access images using `http://localhost:3001/images/{filename}`
- **Image requirements**: Required for all categories except `game-tickets`
- **Authentication**: JWT tokens required for all protected routes
- **Token expiration**: JWT tokens expire after 24 hours
- **Password security**: Passwords are automatically hashed with bcrypt
- **University isolation**: Users only see posts from their own university 2,
      "email": "student@university.edu",
      "name": "John Doe",
      "university": "University of California",
      "role": "student"
    }
  }
}
````

````

**Response (Error - 400):**

```json
**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Email, password, name, and university are required"
}
````

````

**Response (Error - 409):**

```json
{
  "success": false,
  "message": "User already exists with this email"
}
````

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
    "name": "John Doe",
    "university": "University of California"
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

---

## 🛍️ Marketplace Posts

### 1. POST /api/posts

Create a new marketplace listing with images.

**Authentication:** Required (JWT token)

**Content-Type:** `multipart/form-data`

**Form Fields:**

```
title: "MacBook Pro 2021"
description: "Excellent condition MacBook Pro, barely used. Perfect for computer science students!"
price: 1299.99
category: "Electronics"
contactMethod: "email"
course: "CS 106A"
event: "Stanford vs Cal Game"
location: "Campus Library"
images: [file1, file2, file3] // Multiple image files (max 5)
```

**Required Fields:** `title`, `description`, `price`, `category`
**Optional Fields:** `contactMethod`, `course`, `event`, `location`

**Categories:** `textbooks`, `electronics`, `game-tickets`, `furniture`, `clothing`, `other`

**📸 Image Requirements:**

- **Required for:** `textbooks`, `electronics`, `furniture`, `clothing`, `other` (at least 1 image)
- **Optional for:** `game-tickets` (images not required)
- **Maximum:** 5 images per post
- **File size limit:** 10MB per image
- **Supported formats:** Images only (jpg, png, gif, etc.)
- **Field name:** `images` (array of files)

**📋 Category-Specific Fields:**

| Category         | Image Required | Relevant Optional Fields | Purpose                                             |
| ---------------- | -------------- | ------------------------ | --------------------------------------------------- |
| **textbooks**    | ✅ Yes         | `course`, `location`     | Course name (e.g., "CS 106A"), pickup location      |
| **game-tickets** | ❌ No          | `event`, `location`      | Event name (e.g., "Stanford vs Cal"), venue/section |
| **electronics**  | ✅ Yes         | `location`               | Pickup location for meetup                          |
| **furniture**    | ✅ Yes         | `location`               | Pickup location (important for large items)         |
| **clothing**     | ✅ Yes         | `location`               | Pickup location for trying on                       |
| **other**        | ✅ Yes         | `location`               | General pickup location                             |

**🎯 Frontend Form Logic:**

```javascript
const getRelevantFields = (category) => {
  switch (category) {
    case "textbooks":
      return ["course", "location"];
    case "game-tickets":
      return ["event", "location"];
    case "electronics":
    case "furniture":
    case "clothing":
    case "other":
      return ["location"];
    default:
      return [];
  }
};

const isImageRequired = (category) => {
  return category !== "game-tickets";
};
```

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "post": {
      "id": 1,
      "title": "MacBook Pro 2021",
      "description": "Excellent condition MacBook Pro, barely used. Perfect for computer science students!",
      "price": "1299.99",
      "category": "electronics",
      "seller_id": 8,
      "university": "Stanford University",
      "images": [
        "post-1692123456789-abc123def.jpg",
        "post-1692123456790-def456ghi.jpg"
      ],
      "views": 0,
      "status": "active",
      "contact_method": "email",
      "course": null,
      "event": null,
      "location": "Campus Library",
      "created_at": "2025-08-16T02:40:27.051Z",
      "updated_at": "2025-08-16T02:40:27.051Z"
    }
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Title, description, price, and category are required"
}
```

**Response (Error - 400 - Missing Images):**

```json
{
  "success": false,
  "message": "At least one image is required for this category"
}
```

---

### 2. GET /api/posts

Get all marketplace posts from your university.

**Authentication:** Required (JWT token)

**Query Parameters:**

- `category` (optional): Filter by category (e.g., "Electronics", "Textbooks")
- `search` (optional): Search in title and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Post status (default: "active")

**Example:** `GET /api/posts?category=Electronics&search=macbook&page=2&limit=10`

**⚠️ IMPORTANT:** This endpoint requires authentication and only shows posts from your university.

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "MacBook Pro 2021",
        "description": "Excellent condition MacBook Pro, barely used.",
        "price": "1299.99",
        "category": "Electronics",
        "seller_id": 8,
        "university": "Stanford University",
        "images": [],
        "views": 5,
        "status": "active",
        "contact_method": "email",
        "course": null,
        "event": null,
        "location": "Campus Library",
        "created_at": "2025-08-16T02:40:27.051Z",
        "updated_at": "2025-08-16T02:40:27.051Z",
        "seller_name": "University Student",
        "seller_email": "testuni@university.edu"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8,
      "hasNextPage": true
    }
  }
}
```

**Note:** Only shows posts from your university (automatic filtering)

---

### 3. GET /api/posts/:id

Get a specific post by ID.

**Authentication:** None required

**URL Parameters:**

- `id` (integer): Post ID

**Example:** `GET /api/posts/1`

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "title": "MacBook Pro 2021",
      "description": "Excellent condition MacBook Pro, barely used.",
      "price": "1299.99",
      "category": "Electronics",
      "seller_id": 8,
      "university": "Stanford University",
      "images": [],
      "views": 6,
      "status": "active",
      "contact_method": "email",
      "course": null,
      "event": null,
      "location": "Campus Library",
      "created_at": "2025-08-16T02:40:27.051Z",
      "updated_at": "2025-08-16T02:40:27.051Z",
      "seller_name": "University Student",
      "seller_email": "testuni@university.edu",
      "seller_phone": null
    }
  }
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Post not found"
}
```

**Note:** Automatically increments view count when accessed

---

### 4. GET /api/posts/user/:userId

Get all posts by a specific user.

**Authentication:** None required

**URL Parameters:**

- `userId` (integer): User ID

**Example:** `GET /api/posts/user/8`

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "MacBook Pro 2021",
        "description": "Excellent condition MacBook Pro, barely used.",
        "price": "1299.99",
        "category": "Electronics",
        "seller_id": 8,
        "university": "Stanford University",
        "images": [],
        "views": 6,
        "status": "active",
        "contact_method": "email",
        "course": null,
        "event": null,
        "location": "Campus Library",
        "created_at": "2025-08-16T02:40:27.051Z",
        "updated_at": "2025-08-16T02:40:27.051Z"
      }
    ]
  }
}
```

---

### 5. PUT /api/posts/:id

Update a post (only by owner).

**Authentication:** Required (JWT token)

**URL Parameters:**

- `id` (integer): Post ID

**Request Body:**

```json
{
  "title": "MacBook Pro 2021 - UPDATED",
  "description": "Updated description with more details",
  "price": 1199.99,
  "category": "Electronics",
  "contactMethod": "phone",
  "course": null,
  "event": null,
  "location": "Student Center"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "post": {
      "id": 1,
      "title": "MacBook Pro 2021 - UPDATED",
      "description": "Updated description with more details",
      "price": "1199.99",
      "category": "Electronics",
      "seller_id": 8,
      "university": "Stanford University",
      "images": [],
      "views": 6,
      "status": "active",
      "contact_method": "phone",
      "course": null,
      "event": null,
      "location": "Student Center",
      "created_at": "2025-08-16T02:40:27.051Z",
      "updated_at": "2025-08-16T03:15:30.123Z"
    }
  }
}
```

**Response (Error - 403):**

```json
{
  "success": false,
  "message": "Not authorized to update this post"
}
```

---

### 6. DELETE /api/posts/:id

Delete a post (only by owner).

**Authentication:** Required (JWT token)

**URL Parameters:**

- `id` (integer): Post ID

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Response (Error - 403):**

```json
{
  "success": false,
  "message": "Not authorized to delete this post or post not found"
}
```

---

### 7. PATCH /api/posts/:id/sold

Mark a post as sold (only by owner).

**Authentication:** Required (JWT token)

**URL Parameters:**

- `id` (integer): Post ID

**Request Body:** None

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Post marked as sold",
  "data": {
    "post": {
      "id": 1,
      "title": "MacBook Pro 2021",
      "status": "sold",
      "updated_at": "2025-08-16T03:20:45.789Z"
    }
  }
}
```

**Response (Error - 403):**

```json
{
  "success": false,
  "message": "Not authorized to update this post or post not found"
}
```

---

## 📋 Example Usage with cURL

### Create a new post with images:

```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Calculus Textbook" \
  -F "description=Stewart Calculus 8th edition. Great condition." \
  -F "price=89.99" \
  -F "category=textbooks" \
  -F "contactMethod=email" \
  -F "course=MATH 41" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### Create a Game Ticket post (no images required):

```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Stanford vs Cal Football Tickets" \
  -F "description=Two tickets for the Big Game! Great seats." \
  -F "price=150.00" \
  -F "category=game-tickets" \
  -F "contactMethod=email" \
  -F "event=Stanford vs Cal Game" \
  -F "location=Section 20, Row 15"
```

### Create an Electronics post with multiple images:

```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=MacBook Pro 2021" \
  -F "description=Excellent condition, includes charger." \
  -F "price=1299.99" \
  -F "category=electronics" \
  -F "contactMethod=phone" \
  -F "location=Engineering Quad" \
  -F "images=@/path/to/macbook1.jpg" \
  -F "images=@/path/to/macbook2.jpg" \
  -F "images=@/path/to/macbook3.jpg"
```

### Get all posts from your university:

```bash
curl -X GET http://localhost:3001/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Search for electronics:

```bash
curl -X GET "http://localhost:3001/api/posts?category=Electronics&search=macbook" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get specific post:

```bash
curl -X GET http://localhost:3001/api/posts/1
```

### Update your post:

```bash
curl -X PUT http://localhost:3001/api/posts/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description",
    "price": 899.99,
    "category": "Electronics"
  }'
```

### Mark post as sold:

```bash
curl -X PATCH http://localhost:3001/api/posts/1/sold \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Delete your post:

```bash
curl -X DELETE http://localhost:3001/api/posts/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## � Authentication Flow

1. **Register** or **Login** to get a JWT token
2. **Include the token** in the `Authorization: Bearer <token>` header for protected routes
3. **Token expires in 24 hours** - you'll need to login again

---

## 📱 Infinite Scroll / Pagination Guide

### **How Pagination Works:**

- **`page`**: Page number (starts at 1)
- **`limit`**: Items per page (default: 20, max recommended: 50)
- **Calculation**: Server uses `OFFSET (page-1) × limit` and `LIMIT limit`

### **Pagination Response:**

```json
"pagination": {
  "page": 2,           // Current page
  "limit": 20,         // Items per page
  "total": 156,        // Total posts available
  "totalPages": 8,     // Total pages (156 ÷ 20 = 8)
  "hasNextPage": true  // More pages available?
}
```

### **Frontend Implementation Example:**

```javascript
// React/React Native infinite scroll example
const [posts, setPosts] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMorePosts = async () => {
  if (!hasMore) return;

  const response = await fetch(`/api/posts?page=${currentPage}&limit=20`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  // Append new posts to existing array
  setPosts((prevPosts) => [...prevPosts, ...data.data.posts]);

  // Check if there are more pages
  setHasMore(data.data.pagination.hasNextPage);
  setCurrentPage(currentPage + 1);
};

// Call loadMorePosts() when user scrolls to bottom
```

### **API Call Sequence:**

```bash
# Initial load
GET /api/posts?page=1&limit=20  # Returns posts 1-20

# User scrolls down
GET /api/posts?page=2&limit=20  # Returns posts 21-40

# User scrolls down again
GET /api/posts?page=3&limit=20  # Returns posts 41-60

# Continue until hasNextPage = false
```

### **Performance Tips:**

- **Don't load too many at once**: Keep limit around 20-30 for smooth scrolling
- **Cache previous pages**: Store loaded posts to avoid re-fetching when scrolling up
- **Show loading states**: Display spinners when loading new pages
- **Handle errors**: Network issues might interrupt loading

---

## 🏫 University-Based Marketplace

- **Automatic University Filtering**: When you get all posts, you only see posts from your university
- **University Inheritance**: When you create a post, it automatically uses your university from your profile
- **Campus-Focused**: Each university has its own isolated marketplace

## �📝 Notes

- All requests and responses use `Content-Type: application/json`
- Passwords are automatically hashed with bcrypt
- JWT tokens expire after 24 hours
- Email addresses must be unique
- All timestamps are in ISO 8601 format (UTC)
- Posts are automatically linked to your university
- View counts increment each time someone views a post
- Only post owners can edit/delete their posts
