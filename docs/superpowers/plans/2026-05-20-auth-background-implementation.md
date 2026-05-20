# Auth Pages Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set `src/assets/background.jpg` as the background for Login and Registration pages with 70% opacity.

**Architecture:** Use a CSS `::before` pseudo-element on the main container of the pages to apply the background image and control opacity without affecting child elements (the forms).

**Tech Stack:** React, Tailwind CSS, CSS.

---

### Task 1: Define CSS Overlay Rule

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add `.auth-bg-overlay` class to CSS**

Add the following rule to the `@layer components` or at the end of the file:

```css
.auth-bg-overlay {
  position: relative;
  overflow: hidden;
}

.auth-bg-overlay::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/src/assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.7;
  z-index: 0;
}

/* Ensure children are above the pseudo-element */
.auth-bg-overlay > * {
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/index.css
git commit -m "style: add auth-bg-overlay CSS rule"
```

### Task 2: Update Login Page

**Files:**
- Modify: `src/pages/LoginPage.jsx`

- [ ] **Step 1: Apply `.auth-bg-overlay` class**

Replace the root div class:
`old: className="flex min-h-screen items-center justify-center bg-muted/50 p-4"`
`new: className="auth-bg-overlay flex min-h-screen items-center justify-center p-4"`

- [ ] **Step 2: Commit changes**

```bash
git add src/pages/LoginPage.jsx
git commit -m "feat: apply background overlay to LoginPage"
```

### Task 3: Update Register Page

**Files:**
- Modify: `src/pages/RegisterPage.jsx`

- [ ] **Step 1: Apply `.auth-bg-overlay` class**

Replace the root div class:
`old: className="flex min-h-screen items-center justify-center bg-muted/50 p-4"`
`new: className="auth-bg-overlay flex min-h-screen items-center justify-center p-4"`

- [ ] **Step 2: Commit changes**

```bash
git add src/pages/RegisterPage.jsx
git commit -m "feat: apply background overlay to RegisterPage"
```

### Task 4: Verification

- [ ] **Step 1: Visual check**
- Run the development server if not already running.
- Visit `/login` and `/register` routes.
- Verify background image is visible, covering the screen, and has 70% opacity.
- Verify form text and inputs are clearly readable.
