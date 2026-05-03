# Phase 4: Damage Assessment Design Spec

**Goal:** Implement the core 3-step reporting workflow for Barangay Kagawads to file structural damage reports from the field, including optional photo evidence.

---

## 1. Architecture Overview

### Backend (Node.js/Express)
- **Library**: `multer` for handling file uploads.
- **Storage**: Local filesystem (`server/uploads`).
- **Endpoint**: `POST /api/assessments` (Multipart/form-data).
- **Static Files**: Express will serve the `uploads/` directory for viewing report photos.

### Frontend (React/shadcn)
- **Component**: `AssessmentStepper` - A stateful multi-step form.
- **Step 1**: Context Selection (Disaster Event + Zone).
- **Step 2**: Structure Lookup with "Inline Add" capability.
- **Step 3**: Damage Selection (Visual Cards) + Photo Upload.
- **Review**: Final confirmation screen.

---

## 2. Functional Requirements

### 2.1 Multi-Step Form Logic
- **State Management**: Form data is collected across steps. The user can navigate Back/Next.
- **Persistence**: If "File Another Report" is selected after success, the Event and Zone from Step 1 are preserved to speed up batch reporting.

### 2.2 Step 2: Structure Selection & Inline Add
- Search results will display Address and Owner.
- If no results, show "No structure found. [Add New Structure]".
- Clicking "Add New" expands a sub-form (Address, Type, Resident Lookup).
- Successful "Inline Add" selects the new structure and proceeds to Step 3.

### 2.3 Step 3: Damage Classification
- Two Large Card Buttons:
  - **Partially Damaged**: Labeled with Amber color code (`#F9A825`).
  - **Totally Damaged**: Labeled with Orange color code (`#E65100`).
- **Photo Upload**: Optional file input. Supports camera/gallery on mobile.

### 2.4 Submission & Storage
- Backend generates a unique filename for uploads (timestamp + random string).
- `ASSESSMENT_REPORT` table stores:
  - `user_id` (from session)
  - `event_id`
  - `structure_id`
  - `damage_level`
  - `photo_url` (relative path to file)
  - `timestamp` (server-generated)

### 2.5 Role Access
- **Submission**: Users with role `Kagawad`, `Admin`, or `Staff` can file damage assessment reports.
- **Viewing**: `Admin` can see all reports; `Kagawad` and `Staff` can see reports for their assigned zone.

### 3.1 Upload Flow
1. Frontend sends `FormData` containing JSON fields and the file.
2. `multer` middleware saves file to `server/uploads/`.
3. Controller extracts `req.body` and `req.file`.
4. Controller inserts record into DB.
5. Returns 201 with the created report ID.

---

## 4. UI/UX Specifications
- **Mobile First**: Buttons and inputs sized for touch.
- **Visual Feedback**: Progress bar at the top of the stepper.
- **Confirmation**: Final success screen with "Summary of Submission".

---

## 5. Testing Strategy
- **Integration Tests**: 
  - Test `POST /api/assessments` with and without a file.
  - Test that foreign key violations (invalid event/structure) return 400.
- **Frontend**:
  - Verify stepper state persistence.
  - Verify "Inline Add" correctly populates the next step.
