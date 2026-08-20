# Task Management API

A backend RESTful API built for managing tasks with secure user authentication using **JSON Web Tokens (JWT)**. This API ensures strict user ownership isolation, meaning users can only manage their own tasks.

---

## Features

- **User Authentication**: Secure Sign Up and Sign In endpoints.
- **JWT Protection**: Secured task endpoints that require a valid authorization token.
- **Task CRUD Operations**: Complete control over creating, reading, updating, and deleting tasks.
- **Data Isolation**: Strict user-level isolation ensuring privacy and security.

---

## API Documentation

### 1. Authentication Endpoints

#### Sign Up
Registers a new user in the system.

- **Method**: `POST`
- **Endpoint**: `/api/auth/signup`
- **Auth Required**: No
- **Request Body (JSON)**:
```json
{
  "name": "Muhammad Hanif",
  "email": "hanif@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "64a2b...",
    "name": "Muhammad Hanif",
    "email": "hanif@example.com"
  }
}
```

#### Sign In
Authenticates a user and returns a token.

- **Method**: `POST`
- **Endpoint**: `/api/auth/signin`
- **Auth Required**: No
- **Request Body (JSON)**:
```json
{
  "email": "hanif@example.com",
  "password": "password123"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "64a2b...",
      "name": "Muhammad Hanif",
      "email": "hanif@example.com"
    }
  }
}
```

---

### 2. Task CRUD Endpoints (Protected)

> **Note**: All task endpoints require the following header:
> `Authorization: Bearer <JWT_TOKEN>`

#### Create Task
Creates a new task tied directly to the authenticated user.

- **Method**: `POST`
- **Endpoint**: `/api/tasks`
- **Request Body (JSON)**:
```json
{
  "title": "Complete MERN Assignment",
  "description": "Finish the task management full-stack project"
}
```
- **Success Response (201 Created)**: Returns the created task object with `userId` bound to the authenticated user.

#### Get All Tasks
Retrieves all tasks belonging exclusively to the authenticated user.

- **Method**: `GET`
- **Endpoint**: `/api/tasks`
- **Success Response (200 OK)**: Returns an array of tasks.

#### Get Single Task
Retrieves a specific task by its ID.

- **Method**: `GET`
- **Endpoint**: `/api/tasks/:id`
- **Success Response (200 OK)**: Returns the requested single task object.

#### Update Task (PATCH)
Modifies specific fields of an existing task (supports partial updates).

- **Method**: `PATCH`
- **Endpoint**: `/api/tasks/:id`
- **Request Body (JSON)**:
```json
{
  "completed": true
}
```
- **Success Response (200 OK)**: Returns the updated task object.

#### Delete Task
Removes a specific task from the database.

- **Method**: `DELETE`
- **Endpoint**: `/api/tasks/:id`
- **Success Response (200 OK)**: Returns a deletion confirmation message.

---

## Test Checklist

Verify the following scenarios in Postman or via your frontend implementation:

- [x] Successful user signup & duplicate email conflict test (409).
- [x] Successful signin with JWT generation & incorrect password test (401).
- [x] Protected task routes rejection when token is missing (401).
- [x] Task CRUD operations (POST, GET, PATCH, DELETE) successfully executing under user ownership isolation.
