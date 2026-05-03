# AgapaySF Phase 1: DB & Auth API Design Spec

**Date:** 2026-05-03  
**Project:** AgapaySF Backend (Phase 1)  
**Status:** Draft  

## 1. Overview
Build the foundational backend for AgapaySF. This phase focuses on setting up the PostgreSQL database schema and implementing the core authentication API using Node.js, Express, and express-session.

## 2. Architecture & Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **DB Client:** `pg` (Raw SQL)
- **Authentication:** `express-session` (cookie-based), `bcrypt` (password hashing)
- **Environment:** `dotenv` for configuration

## 3. Database Schema
A `schema.sql` file will be created based on the `AgapaySF_Master_Reference.md` Data Dictionary.
It will include table creation for:
- `USER` (Adding explicit `status` ENUM column for PENDING/ACTIVE/INACTIVE as required by workflows).
- `DISASTER_EVENT`
- `BARANGAY_ZONE`
- `RESIDENT`
- `STRUCTURE`
- `ASSESSMENT_REPORT`
- `EVACUATION_LOG`

## 4. API Endpoints
### Auth Module (`/api/auth`)
- **`POST /register`**: Accepts Name, Contact Number, Password. Hashes password. Inserts user with `status='PENDING'`.
- **`POST /login`**: Accepts Contact Number, Password. Checks if status is `ACTIVE`. Verifies hash. Sets `req.session.user_id` and `req.session.role`.
- **`POST /logout`**: Destroys the current session.
- **`GET /me`**: Returns the currently authenticated user's details (excluding password) based on session.

## 5. Middleware
- **`requireAuth`**: Checks if `req.session.user_id` exists. Returns 401 if missing.
- **`requireRole(...roles)`**: Checks if `req.session.role` is in the allowed list. Returns 403 if forbidden.

## 6. Directory Structure
```text
/server
  /config
    db.js
  /controllers
    authController.js
  /middleware
    authMiddleware.js
  /routes
    authRoutes.js
  server.js
  schema.sql
```

## 7. Security & Business Rules
- Passwords must be hashed via `bcrypt` before DB insertion.
- `PENDING` users cannot log in.
- Raw SQL queries must use parameterized inputs (`$1, $2`) to prevent SQL injection.