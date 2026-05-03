# AgapaySF Task 2: Backend User Management API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement API endpoints for Admin to manage pending user registrations (approve/reject).

**Architecture:** Express server, PostgreSQL, Admin-only routes.

**Tech Stack:** Node.js, Express, pg, express-session, Jest, Supertest.

---

### Task 1: User Controller

**Files:**
- Create: `server/controllers/userController.js`

- [ ] **Step 1: Implement getPendingUsers**
Fetch users with status 'PENDING'.

- [ ] **Step 2: Implement approveUser**
Update user status to 'ACTIVE' and set role.

- [ ] **Step 3: Implement rejectUser**
Update user status to 'INACTIVE'.

- [ ] **Step 4: Commit**
```bash
git add server/controllers/userController.js
git commit -m "feat: user controller for admin management"
```

---

### Task 2: User Routes

**Files:**
- Create: `server/routes/userRoutes.js`

- [ ] **Step 1: Define routes**
Link controller methods to GET `/pending`, PATCH `/:id/approve`, PATCH `/:id/reject`.

- [ ] **Step 2: Apply Admin middleware**
Protect all routes with `requireAuth` and `requireRole('Admin')`.

- [ ] **Step 3: Commit**
```bash
git add server/routes/userRoutes.js
git commit -m "feat: user management routes with admin protection"
```

---

### Task 3: Integration & Testing

**Files:**
- Modify: `server/server.js`
- Create: `server/tests/user.test.js`

- [ ] **Step 1: Mount routes in server.js**
Add `app.use('/api/users', userRoutes)`.

- [ ] **Step 2: Write integration tests**
Test all three endpoints with Admin and non-Admin users.

- [ ] **Step 3: Run tests**
Run: `cd server && npm test tests/user.test.js`

- [ ] **Step 4: Commit**
```bash
git add server/server.js server/tests/user.test.js
git commit -m "test: user management integration tests"
```
