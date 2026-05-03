# Phase 3: Core Directories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement CRUD and lookup interfaces for Disaster Events, Barangay Zones, Residents, and Structures.

**Architecture:** New Express controllers and routes for backend logic. Frontend pages using shadcn `Table` and `Form` components. A specialized `ResidentLookup` component for linking owners to structures.

**Tech Stack:** Node.js, Express, pg, React, react-hook-form, zod, shadcn/ui.

---

### Task 1: Backend - Events & Zones API

**Files:**
- Create: `server/controllers/eventController.js`
- Create: `server/controllers/zoneController.js`
- Create: `server/routes/eventRoutes.js`
- Create: `server/routes/zoneRoutes.js`
- Modify: `server/server.js`
- Test: `server/tests/events.test.js`, `server/tests/zones.test.js`

- [ ] **Step 1: Implement `eventController.js`**
CRUD for `DISASTER_EVENT`.

- [ ] **Step 2: Implement `zoneController.js`**
CRUD for `BARANGAY_ZONE`. Ensure `GET /` joins with `USER` to show Kagawad name.

- [ ] **Step 3: Setup Routes & Register in `server.js`**
Protect with `requireAuth`. Admin-only for POST/PATCH/DELETE on these specific entities.

- [ ] **Step 4: Write & Run Tests**
Verify CRUD and role restrictions.

- [ ] **Step 5: Commit**
```bash
git add server/
git commit -m "feat(api): add events and zones endpoints"
```

---

### Task 2: Backend - Residents & Structures API

**Files:**
- Create: `server/controllers/residentController.js`
- Create: `server/controllers/structureController.js`
- Create: `server/routes/residentRoutes.js`
- Create: `server/routes/structureRoutes.js`
- Modify: `server/server.js`
- Test: `server/tests/residents.test.js`, `server/tests/structures.test.js`

- [ ] **Step 1: Implement `residentController.js`**
Include search by name and filtering by zone.

- [ ] **Step 2: Implement `structureController.js`**
Handle `owner_id` linking.

- [ ] **Step 3: Setup Routes & Register in `server.js`**
Allow Admin, Kagawad, and Staff full CRUD.

- [ ] **Step 4: Write & Run Tests**
Verify vulnerability counts validation (0-99).

- [ ] **Step 5: Commit**
```bash
git add server/
git commit -m "feat(api): add residents and structures endpoints"
```

---

### Task 3: Frontend - Event & Zone Pages

**Files:**
- Create: `src/pages/EventsPage.jsx`
- Create: `src/pages/ZonesPage.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Implement EventsPage**
Table grouped by Year. Simple dialog form for Admin to add/edit.

- [ ] **Step 2: Implement ZonesPage**
List zones and assigned Kagawads. Assignment dropdown.

- [ ] **Step 3: Register Routes in App.jsx**
Paths: `/dashboard/events`, `/dashboard/zones`.

- [ ] **Step 4: Commit**
```bash
git add src/
git commit -m "feat(ui): add events and zones management pages"
```

---

### Task 4: Frontend - Resident Directory

**Files:**
- Create: `src/pages/ResidentsPage.jsx`
- Create: `src/components/residents/ResidentForm.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create ResidentForm**
Comprehensive form with demographics and vulnerability checklist.

- [ ] **Step 2: Implement ResidentsPage**
Searchable table. Action to Open/Edit resident.

- [ ] **Step 3: Commit**
```bash
git add src/
git commit -m "feat(ui): implement resident directory with vulnerability checklist"
```

---

### Task 5: Frontend - Structure Directory & Resident Lookup

**Files:**
- Create: `src/pages/StructuresPage.jsx`
- Create: `src/components/residents/ResidentLookup.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create ResidentLookup**
A searchable dropdown/input that calls `GET /api/residents?search=...`.

- [ ] **Step 2: Implement StructuresPage**
Table of structures. Form uses `ResidentLookup` to select owner.

- [ ] **Step 3: Final Commit**
```bash
git add src/
git commit -m "feat(ui): implement structure directory with resident lookup"
```
