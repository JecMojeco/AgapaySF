# AgapaySF Phase 1: DB & Auth API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Setup PostgreSQL schema and Auth API using Node.js, Express, pg, and express-session.
**Architecture:** Express server, raw SQL via pg, session auth.
**Tech Stack:** Node.js, Express, pg, bcrypt, express-session, dotenv, supertest, jest.

---

### Task 1: Backend Initialization

**Files:**
- Create: `server/package.json`
- Create: `server/jest.config.js`
- Create: `server/.env.example`

- [ ] **Step 1: Init project**
Run: `mkdir -p server && cd server && npm init -y`

- [ ] **Step 2: Install dependencies**
Run: `cd server && npm install express pg bcrypt express-session dotenv cors && npm install -D jest supertest nodemon`

- [ ] **Step 3: Setup test config**
Create `server/jest.config.js`:
```javascript
module.exports = { testEnvironment: "node" };
```
Add `"test": "jest"` to package.json.

- [ ] **Step 4: Commit**
```bash
git add server
git commit -m "chore: init backend"
```

---

### Task 2: Database Schema

**Files:**
- Create: `server/schema.sql`

- [ ] **Step 1: Write schema.sql**
Create `server/schema.sql` with tables: USER, DISASTER_EVENT, BARANGAY_ZONE, RESIDENT, STRUCTURE, ASSESSMENT_REPORT, EVACUATION_LOG. Add `status` ENUM to USER.

- [ ] **Step 2: Commit**
```bash
git add server/schema.sql
git commit -m "feat: db schema"
```

---

### Task 3: DB Connection

**Files:**
- Create: `server/config/db.js`
- Create: `server/tests/db.test.js`

- [ ] **Step 1: Test & Implement**
Create `server/tests/db.test.js` checking if pool is defined.
Create `server/config/db.js` using `pg.Pool`.

- [ ] **Step 2: Commit**
```bash
git add server
git commit -m "feat: db pool"
```

---

### Task 4: Auth Middleware

**Files:**
- Create: `server/middleware/authMiddleware.js`
- Create: `server/tests/authMiddleware.test.js`

- [ ] **Step 1: Test & Implement**
Test `requireAuth` returns 401 without session. Implement `requireAuth` and `requireRole`.

- [ ] **Step 2: Commit**
```bash
git add server
git commit -m "feat: auth middleware"
```

---

### Task 5: Auth Controller & Routes

**Files:**
- Create: `server/controllers/authController.js`
- Create: `server/routes/authRoutes.js`
- Create: `server/tests/auth.test.js`

- [ ] **Step 1: Test & Implement Register**
Test 201 on success. Implement bcrypt hash and INSERT to DB.

- [ ] **Step 2: Test & Implement Login/Logout**
Test 403 on PENDING. Implement bcrypt compare and session set.

- [ ] **Step 3: Routes**
Create `authRoutes.js` linking controller methods.

- [ ] **Step 4: Commit**
```bash
git add server
git commit -m "feat: auth api"
```

---

### Task 6: Express Server

**Files:**
- Create: `server/server.js`

- [ ] **Step 1: Setup App**
Create `server.js` with express, cors, express-session, and auth routes.

- [ ] **Step 2: Commit**
```bash
git add server
git commit -m "feat: express server setup"
```