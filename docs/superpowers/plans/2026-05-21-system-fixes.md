# System Issues Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address reported bugs in Login validation, User Management, Disaster Events, Barangay Zones, and System Reports.

**Architecture:** Update frontend components and backend controllers to ensure consistent validation, proper conditional rendering, correct date handling, and functional reporting features.

**Tech Stack:** React, Node.js, Express, PostgreSQL, Tailwind CSS.

---

### Task 1: Fix Login/Registration Validation

**Files:**
- Modify: `server/controllers/authController.js`
- Modify: `src/components/auth/RegisterForm.jsx`

- [ ] **Step 1: Update backend password validation**
Change regex to strictly alphanumeric (letters + numbers only) and update error message.
```javascript
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
// Error message: 'Password must be at least 8 characters long and contain both letters and numbers.'
```

- [ ] **Step 2: Update frontend validation**
Sync `RegisterForm.jsx` with backend regex and contact format enforcement.

- [ ] **Step 3: Commit changes**
```bash
git add server/controllers/authController.js src/components/auth/RegisterForm.jsx
git commit -m "fix: enforce strict alphanumeric password and consistent validation"
```

### Task 2: Fix User Management Actions

**Files:**
- Modify: `src/components/dashboard/UserTable.jsx`
- Modify: `server/routes/userRoutes.js` (check if DELETE exists)
- Modify: `server/controllers/userController.js`

- [ ] **Step 1: Add Delete/Reactivate buttons for inactive users**
In `UserTable.jsx`, render actions for `user.status === 'INACTIVE'`.

- [ ] **Step 2: Implement permanent delete backend**
Ensure `DELETE /api/users/:id` works correctly.

- [ ] **Step 3: Commit changes**
```bash
git add src/components/dashboard/UserTable.jsx server/controllers/userController.js server/routes/userRoutes.js
git commit -m "fix: allow deleting inactive accounts and add reactivate option"
```

### Task 3: Fix Disaster Event Date Update

**Files:**
- Modify: `src/pages/EventsPage.jsx`
- Modify: `server/controllers/eventController.js`

- [ ] **Step 1: Improve date string handling**
Ensure `date_started` and `date_ended` are handled safely even if they are already short strings or null.

- [ ] **Step 2: Validate date logic in backend**
Ensure start date is not after end date.

- [ ] **Step 3: Commit changes**
```bash
git add src/pages/EventsPage.jsx server/controllers/eventController.js
git commit -m "fix: handle disaster event date updates reliably"
```

### Task 4: Fix Barangay Zone Updates

**Files:**
- Modify: `src/pages/ZonesPage.jsx`
- Modify: `server/controllers/zoneController.js`

- [ ] **Step 1: Fix Kagawad selection validation**
Prevent sending `NaN` to backend. Ensure a kagawad is selected before submission.

- [ ] **Step 2: Improve error reporting in backend**
Return descriptive errors for constraint violations.

- [ ] **Step 3: Commit changes**
```bash
git add src/pages/ZonesPage.jsx server/controllers/zoneController.js
git commit -m "fix: prevent NaN in zone updates and improve kagawad assignment"
```

### Task 5: Improve System Reports

**Files:**
- Modify: `src/pages/ReportsPage.jsx`
- Modify: `src/index.css` (add print styles)
- Modify: `server/controllers/reportController.js`
- Modify: `server/routes/reportRoutes.js`

- [ ] **Step 1: Implement Print CSS**
Add `@media print` rules to hide navigation and format the report area.

- [ ] **Step 2: Implement CSV/PDF Export Handlers**
Implement actual download logic in frontend and export endpoints in backend.

- [ ] **Step 3: Commit changes**
```bash
git add src/pages/ReportsPage.jsx src/index.css server/controllers/reportController.js server/routes/reportRoutes.js
git commit -m "feat: implement proper report printing and export functionality"
```
