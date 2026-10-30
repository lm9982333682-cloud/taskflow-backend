# TaskFlow – Backend Server

## 1. Project Overview

TaskFlow is a task management application backend built with Node.js, Express.js, and MongoDB.

The backend provides REST APIs for user authentication and task management. Users can register, log in, manage their profile session, and perform CRUD operations on their personal tasks.

## 2. Technologies Used

- Node.js – JavaScript runtime
- Express.js – Backend framework
- MongoDB – NoSQL database
- Mongoose – MongoDB object modeling
- JSON Web Token (JWT) – Authentication
- bcrypt – Password hashing
- express-validator – Request validation
- cookie-parser – Cookie handling
- CORS – Frontend and backend communication
- Google Auth Library – Google authentication

## 3. Project Structure

```text
server/
│
├── server.js
├── package.json
│
└── src/
    ├── app/
    │   └── app.js
    │
    ├── config/
    │   ├── config.js
    │   └── db.js
    │
    ├── controllers/
    │   ├── authController.js
    │   └── taskController.js
    │
    ├── middleware/
    │   └── authMiddleware.js
    │
    ├── models/
    │   ├── userModel.js
    │   └── taskModel.js
    │
    ├── routers/
    │   ├── authRouter.js
    │   └── taskRouter.js
    │
    ├── utils/
    │   └── authUtil.js
    │
    └── validator/
        ├── authValidator.js
        └── taskValidator.js
```

## 4. Installation and Setup

### Step 1: Install Dependencies

Open the server folder in the terminal:

```bash
cd server
npm install
```

### Step 2: Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=4545
DBURL=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

NODE_ENV=development

GOOGLE_CLIENT_ID=your_google_client_id
```

Keep your actual database URL and secret keys private. Do not upload the `.env` file to GitHub.

### Step 3: Start the Server

```bash
npm run dev
```

The server runs on:

```text
http://localhost:4545
```

API base URL:

```text
http://localhost:4545/api
```

## 5. Authentication APIs

Base route:

```text
/api/auth
```

All authentication endpoints are listed below.

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Not required |
| POST | `/api/auth/login` | Login with email and password | Not required |
| POST | `/api/auth/refresh` | Generate a new access token | Refresh cookie |
| POST | `/api/auth/logout` | Logout the current user | Required |
| GET | `/api/auth/me` | Get logged-in user details | Required |
| POST | `/api/auth/google` | Google authentication | Not required |

### 5.1 Register User

**POST** `/api/auth/register`

Request body:

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "Password123"
}
```

Features:
- Validates name, email, and password.
- Checks whether the email already exists.
- Hashes the password using bcrypt.
- Creates a new user in MongoDB.

### 5.2 Login User

**POST** `/api/auth/login`

Request body:

```json
{
  "email": "alex@example.com",
  "password": "Password123"
}
```

Features:
- Checks user credentials.
- Verifies the hashed password.
- Checks whether the account is active.
- Generates an access token and refresh token.
- Stores the refresh token in an HTTP-only cookie.
- Returns user information and access token.

### 5.3 Refresh Access Token

**POST** `/api/auth/refresh`

Features:
- Reads the refresh token from the cookie.
- Verifies the refresh token.
- Checks the token against the user's saved refresh token.
- Generates a new access token and refresh token.

### 5.4 Logout User

**POST** `/api/auth/logout`

Header:

```text
Authorization: Bearer ACCESS_TOKEN
```

Features:
- Identifies the logged-in user.
- Clears the saved refresh token from the database.
- Clears the refresh-token cookie.
- Returns a logout success response.

### 5.5 Get Logged-in User

**GET** `/api/auth/me`

Header:

```text
Authorization: Bearer ACCESS_TOKEN
```

Returns the authenticated user's profile information.

### 5.6 Google Login

**POST** `/api/auth/google`

Request body:

```json
{
  "credential": "GOOGLE_ID_TOKEN"
}
```

Features:
- Verifies the Google ID token.
- Checks the Google account email.
- Finds or creates the user account.
- Generates authentication tokens.

## 6. Task Management APIs

Base route:

```text
/api/tasks
```

All task routes are protected by `authMiddleware`. A valid access token is required.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks` | Get all tasks of logged-in user |
| GET | `/api/tasks/:id` | Get a single task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### 6.1 Create Task

**POST** `/api/tasks`

Request body:

```json
{
  "title": "Build Login Page",
  "description": "Create the login page UI",
  "dueDate": "2026-11-15",
  "priority": "High",
  "status": "Pending"
}
```

Features:
- Validates task information.
- Saves the task in MongoDB.
- Associates the task with the logged-in user.

### 6.2 Get All Tasks

**GET** `/api/tasks`

Returns all tasks belonging to the authenticated user, sorted by creation date.

### 6.3 Get Single Task

**GET** `/api/tasks/:id`

Example:

```text
GET /api/tasks/67abc1234567890123456789
```

Returns a task using its MongoDB ID.

### 6.4 Update Task

**PUT** `/api/tasks/:id`

Request body:

```json
{
  "title": "Updated Login Page",
  "description": "Complete login page design",
  "priority": "Medium",
  "status": "In Progress"
}
```

Only the supported task fields are updated.

### 6.5 Delete Task

**DELETE** `/api/tasks/:id`

Deletes the selected task if it belongs to the logged-in user.

## 7. Task Data Model

The Task model contains:

| Field | Type | Description |
|---|---|---|
| title | String | Task title |
| description | String | Task description |
| dueDate | Date | Task deadline |
| priority | String | Low, Medium, High |
| status | String | Pending, In Progress, Completed |
| user | ObjectId | Reference to the task owner |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

Default priority: `Low`

Default status: `Pending`

Mongoose automatically manages `createdAt` and `updatedAt`.

## 8. User Authentication and Security

- Passwords are hashed using bcrypt.
- JWT access tokens are used for protected API requests.
- Access tokens expire after 15 minutes.
- Refresh tokens expire after 7 days.
- Refresh tokens are stored in HTTP-only cookies.
- Auth middleware verifies access tokens.
- Users can access only their own tasks.
- Request validation is implemented using express-validator.

## 9. Task Status and Priority

### Status

- Pending
- In Progress
- Completed

### Priority

- Low
- Medium
- High

**Important:** The backend stores `Pending` as the status value. The frontend may display it as `Todo`.

## 10. API Testing

You can test the APIs using Postman or Thunder Client.

Recommended testing order:

1. Register a user.
2. Login with the registered account.
3. Copy the returned access token.
4. Add the token in the Authorization Bearer Token header.
5. Create a task.
6. Get all tasks.
7. Get a single task.
8. Update a task.
9. Delete a task.
10. Test logout and refresh-token functionality.

## 11. Backend Purpose

The TaskFlow backend handles the application's data and business logic.

It provides:
- User registration and login.
- Secure authentication.
- Google authentication endpoint.
- Task creation and management.
- User-specific task access.
- MongoDB database operations.
- Input validation and API responses.

The backend communicates with the TaskFlow React frontend through REST APIs.