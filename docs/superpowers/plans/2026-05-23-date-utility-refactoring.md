# Date Utility Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor existing pages to use the timezone-safe `formatDate` utility for displaying `DATE` types (YYYY-MM-DD), ensuring consistency and avoiding timezone shifts.

**Architecture:** Replace local date formatting logic and native `toLocaleString()`/`toLocaleDateString()` calls with the centralized `formatDate` utility from `@/lib/utils`.

**Tech Stack:** React, Vite, Lucide React, Shadcn UI (components).

---

### Task 1: Update EventsPage.jsx

**Files:**
- Modify: `src/pages/EventsPage.jsx`

- [ ] **Step 1: Import formatDate and remove local formatter**

```javascript
// Change import
import { formatDate } from "@/lib/utils";

// Remove formatDateDisplay function (around line 124)
// const formatDateDisplay = (dateStr) => { ... };
```

- [ ] **Step 2: Replace formatDateDisplay usages**

```jsx
// Around line 170 & 176
{formatDate(event.date_started)}
{formatDate(event.date_ended)}
```

### Task 2: Update EvacuationLogPage.jsx

**Files:**
- Modify: `src/pages/EvacuationLogPage.jsx`

- [ ] **Step 1: Import formatDate**

```javascript
// Add to existing imports (around line 43)
import { formatDate } from "@/lib/utils";
```

- [ ] **Step 2: Replace format(new Date(), ...) with formatDate**

```jsx
// Around line 304 & 312
// Replace format(new Date(log.arrival_date), "MMM d, yyyy p")
{formatDate(log.arrival_date)}

// Replace format(new Date(log.departure_date), "MMM d, yyyy p")
{formatDate(log.departure_date)}
```

### Task 3: Update ReportsPage.jsx

**Files:**
- Modify: `src/pages/ReportsPage.jsx`

- [ ] **Step 1: Import formatDate**

```javascript
// Add to existing imports (around line 25)
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
```

- [ ] **Step 2: Replace new Date().toLocaleString() for DATE fields**

```jsx
// Around line 364 & 367
// Replace {detail?.arrival_date ? new Date(detail.arrival_date).toLocaleString() : '-'}
{formatDate(detail.arrival_date)}

// Replace {detail?.departure_date ? new Date(detail.departure_date).toLocaleString() : '-'}
{formatDate(detail.departure_date)}
```

### Task 4: Verification

- [ ] **Step 1: Verify all modified files load without errors**
- [ ] **Step 2: Check that dates are formatted as MM/DD/YYYY**
- [ ] **Step 3: Ensure no toLocaleString() or toLocaleDateString() is used on DATE fields**

```bash
grep -r "toLocale" src/pages/EventsPage.jsx src/pages/EvacuationLogPage.jsx src/pages/ReportsPage.jsx
```
Expected: Only `created_at` (TIMESTAMP) in `ReportsPage.jsx` should use `toLocaleString()`.
