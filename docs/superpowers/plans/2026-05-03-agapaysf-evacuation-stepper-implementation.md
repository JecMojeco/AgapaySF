# EvacuationStepper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a 2-step wizard for logging resident evacuations, supporting both existing residents and quick-adding new ones.

**Architecture:** Use a state-driven stepper component similar to `AssessmentStepper`. Step 1 handles resident selection/creation using `ResidentLookup` and `ResidentForm`. Step 2 handles event selection and timing.

**Tech Stack:** React, Lucide-react, Tailwind CSS, shadcn/ui (Dialog, Button, Card, etc.)

---

### Task 1: Create EvacuationStepper Component

**Files:**
- Create: `src/components/evacuation/EvacuationStepper.jsx`

- [ ] **Step 1: Scaffold component with state and fetching**
- [ ] **Step 2: Implement Step 1 (Resident Selection/Creation)**
- [ ] **Step 3: Implement Step 2 (Event Selection & Details)**
- [ ] **Step 4: Add validation and submission logic**

```jsx
// src/components/evacuation/EvacuationStepper.jsx (Simplified logic)
// Validation: sum(vulnerability_counts) <= family_size
const validateVulnerabilities = (data) => {
  const sum = (data.senior_citizen_count || 0) + 
              (data.fourPs_member_count || 0) + 
              (data.baby_count || 0) + 
              (data.infant_count || 0) + 
              (data.pregnant_count || 0) + 
              (data.pwd_count || 0);
  return sum <= (data.family_size || 0);
};
```

### Task 2: Update EvacuationLogPage

**Files:**
- Modify: `src/pages/EvacuationLogPage.jsx`

- [ ] **Step 1: Replace arrival dialog content with EvacuationStepper**
- [ ] **Step 2: Update status badge colors to match spec**
  - Evacuated -> Success Green (#2E7D32)
  - Returned -> Primary Blue (#1565C0)
  - Transferred -> Gray (#9E9E9E)

```jsx
const getStatusBadge = (status) => {
  switch (status) {
    case 'Evacuated':
      return <Badge className="bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white">Evacuated</Badge>;
    case 'Returned':
      return <Badge className="bg-[#1565C0] hover:bg-[#1565C0]/90 text-white">Returned</Badge>;
    case 'Transferred':
      return <Badge className="bg-[#9E9E9E] hover:bg-[#9E9E9E]/90 text-white">Transferred</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
```

### Task 3: Final Verification

- [ ] **Step 1: Verify resident selection works**
- [ ] **Step 2: Verify quick-add resident works (with vulnerability sum validation)**
- [ ] **Step 3: Verify evacuation log submission**
- [ ] **Step 4: Check status colors in table**
