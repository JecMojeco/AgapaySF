# Phase 4: Damage Assessment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the 3-step damage assessment workflow with optional photo upload.

**Architecture:** 
- **Backend**: Multer middleware for file storage in `server/uploads`. 
- **Frontend**: Multi-step stepper component using local state to manage the workflow. Integrated `StructureForm` for inline addition.

**Tech Stack:** Node.js, Express, Multer, React, shadcn/ui.

---

### Task 1: Backend - Assessment API & File Storage

**Files:**
- Create: `server/controllers/assessmentController.js`
- Create: `server/routes/assessmentRoutes.js`
- Modify: `server/server.js`
- Create: `server/uploads/.gitkeep`

- [ ] **Step 1: Setup Multer Storage**
In `assessmentRoutes.js`, configure `multer` to save to `uploads/` with unique filenames.

- [ ] **Step 2: Implement `assessmentController.js`**
Handle `POST /api/assessments`. Save data to `ASSESSMENT_REPORT` table. Store `photo_url` if file exists.

- [ ] **Step 3: Serve Static Files**
In `server.js`, use `express.static` to serve the `uploads/` folder so photos can be viewed in the browser.

- [ ] **Step 4: Register Routes**
Mount `/api/assessments`. Protect with `requireAuth` and `requireRole('Admin', 'Kagawad', 'Staff')`.

- [ ] **Step 5: Commit**
```bash
git add server/
git commit -m "feat(api): add damage assessment endpoint with file upload support"
```

---

### Task 2: Frontend - Assessment Stepper (Step 1 & 2)

**Files:**
- Create: `src/pages/AssessmentPage.jsx`
- Create: `src/components/assessment/AssessmentStepper.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Implement Step 1 (Context)**
Select Event and Zone. Keep in local state.

- [ ] **Step 2: Implement Step 2 (Structure Selection)**
Use `StructureLookup`. Add a button to "Add New Structure" if not found, which opens an inline form.

- [ ] **Step 3: Commit**
```bash
git add src/
git commit -m "feat(ui): add assessment stepper with event and structure selection"
```

---

### Task 3: Frontend - Assessment Stepper (Step 3 & Submission)

**Files:**
- Modify: `src/components/assessment/AssessmentStepper.jsx`

- [ ] **Step 1: Implement Step 3 (Damage & Photo)**
Visual cards for Partial/Total damage. File input for photo.

- [ ] **Step 2: Implement Submission Logic**
Convert state to `FormData` and call `POST /api/assessments`.

- [ ] **Step 3: Success Screen**
Show confirmation with options to "File Another" or "Return Home".

- [ ] **Step 4: Commit**
```bash
git add src/
git commit -m "feat(ui): complete damage assessment workflow with photo upload"
```

---

### Task 4: Frontend - Assessment List/History (Dashboard)

**Files:**
- Create: `src/pages/AssessmentHistoryPage.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Implement History Page**
Table showing recent reports with thumbnails of uploaded photos.

- [ ] **Step 2: Commit**
```bash
git add src/
git commit -m "feat(ui): add assessment history view with photo thumbnails"
```
