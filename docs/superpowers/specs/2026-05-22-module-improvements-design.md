
# Design Spec: Disaster Events, Registration, and Zone UI Improvements

**Goal:** Enhance security, data integrity, and usability across three key modules.

## 1. Disaster Events: Admin Deletion
- **Requirement:** Only Admins can delete events. Must show confirmation.
- **UI:** Add a "Delete" button (Trash icon) in the `EventsPage` table actions.
- **Guard:** Wrap button in `isAdmin` check.
- **Confirmation:** Use `ConfirmDialog` with `variant="destructive"`.
- **Backend:** Verify `DELETE /api/events/:id` is protected by `requireRole('Admin')` (already done).

## 2. Registration: Strict Phone Validation
- **Requirement:** Enforce valid numeric-only Philippine format (09123456789).
- **Frontend:** 
  - Update `RegisterForm.jsx` validation regex.
  - Ensure `handleChange` prevents entering any non-numeric chars (no "X", no dashes).
- **Backend:**
  - Update `authController.js` regex to match frontend.
  - Return 400 Bad Request for invalid formats.

## 3. Barangay Zones: Assignment UI
- **Requirement:** Make "Assign Kagawad" more prominent and user-friendly.
- **UI:** Redesign the assignment dialog to feel like a "Card" inside the popup.
- **Elements:**
  - Clear section header "Official Assignment".
  - Informative text: "Select a Kagawad to oversee [Zone Name]".
  - Prominent "Save Assignment" button.
- **Table:** Replace the "Assign Kagawad" ghost button with a more visible button variant or icon+label.

## Success Criteria
- Non-admins cannot see or trigger event deletion.
- Phone numbers with "X" or letters are rejected before submission.
- Zone assignment feels like a primary action, not a hidden link.
