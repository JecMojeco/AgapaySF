# Design Spec: Fluid Responsive UI Overhaul

**Goal:** Ensure the AgapaySF portal provides a premium, balanced experience across Mobile (Phone), Tablet (Laptop), and Desktop (PC) without compromising visual integrity.

**Architecture:**
- **Global Tokens:** Define fluid spacing and typography in `src/index.css`.
- **Layout Logic:** Enhance `src/components/layout/Layout.jsx` and `Sidebar.jsx` for adaptive visibility and touch-friendly hit areas.
- **Dynamic Grids:** Standardize grid patterns across `DashboardPage.jsx`, `StatsGrid.jsx`, and `UserManagementPage.jsx`.

**Implementation Details:**

1. **Fluid Containers & Spacing**
   - Use `px-4 sm:px-6 lg:px-8` for consistent horizontal margins.
   - Adjust section padding: `py-4` on mobile to `py-8` on desktop.

2. **Adaptive Grid Patterns**
   - **Dashboard Stats:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
   - **Quick Actions:** `grid-cols-2 sm:grid-cols-4 lg:grid-cols-2` (depending on container).
   - **Recent Activity:** Expand to full width on mobile, side-by-side on desktop.

3. **Touch-Optimized UI**
   - Increase `min-h-[44px]` for interactive elements on mobile.
   - Add `active:scale-95` transitions for tactile feedback on touch devices.
   - Refine `BottomNav` for better thumb-reach on large phones.

4. **Responsive Data Display**
   - Tables: Use `overflow-x-auto` with a specialized wrapper.
   - Typography: Scale `h1` from `text-2xl` (mobile) to `text-4xl` (desktop).

**Success Criteria:**
- No horizontal scrollbars on the main body at any width.
- Text remains legible (min 14px) on small screens.
- Interactive elements (buttons/links) have sufficient spacing to prevent accidental clicks.
- Visual hierarchy remains clear as layout shifts from vertical to horizontal.
