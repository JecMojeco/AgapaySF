# Design Spec: Reusable Confirmation Dialog

**Goal:** Create a single, reusable dialog component for the system to handle destructive or critical actions like deactivation, deletion, and rejection.

**Architecture:**
- **Component:** `src/components/ui/ConfirmDialog.jsx`
- **Pattern:** Stateless functional component using Radix UI primitives.
- **Integration:** Replace custom dialogs in `UserTable.jsx` with this generic component.

**Props Interface:**
- `isOpen`: boolean
- `onOpenChange`: function
- `title`: string
- `description`: ReactNode/string
- `confirmText`: string
- `onConfirm`: function
- `variant`: 'destructive' | 'warning' | 'default'
- `isLoading`: boolean (to show spinner/disable during API calls)

**Visuals:**
- Icon at top center (optional).
- Centered text.
- Stacked or side-by-side buttons.
- Color coding based on `variant`.

**Success Criteria:**
- Deactivating a user triggers the popup.
- Deleting a user triggers the popup with different text.
- Rejecting a user triggers the popup.
- All actions work as before after confirmation.
