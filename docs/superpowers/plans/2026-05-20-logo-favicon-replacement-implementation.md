# Logo and Favicon Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralize branding with a reusable `Logo` component and update the system favicon.

**Architecture:** Create a `Logo` UI component, update `Navbar`, `LoginForm`, and `RegisterForm` to use it, and replace the public favicon asset.

**Tech Stack:** React, Tailwind CSS.

---

### Task 1: Create Logo Component

**Files:**
- Create: `src/components/ui/Logo.jsx`

- [ ] **Step 1: Implement Logo component**

```jsx
import logoUrl from "@/assets/AgapaySF.svg";
import { cn } from "@/lib/utils";

export function Logo({ className }) {
  return (
    <img 
      src={logoUrl} 
      alt="AgapaySF Logo" 
      className={cn("h-8 w-auto", className)} 
    />
  );
}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/components/ui/Logo.jsx
git commit -m "feat: add Logo component"
```

### Task 2: Update Navbar

**Files:**
- Modify: `src/components/layout/Navbar.jsx`

- [ ] **Step 1: Replace generic logo with Logo component**

Import `Logo` and replace the generic "A" div and "AgapaySF" span:

```jsx
import { Logo } from "@/components/ui/Logo";
// ... (other imports)

// Inside Navbar div (flex items-center gap-2):
<Logo className="h-8 ml-1" />
```

- [ ] **Step 2: Commit changes**

```bash
git add src/components/layout/Navbar.jsx
git commit -m "feat: use Logo component in Navbar"
```

### Task 3: Update Auth Forms

**Files:**
- Modify: `src/components/auth/LoginForm.jsx`
- Modify: `src/components/auth/RegisterForm.jsx`

- [ ] **Step 1: Add Logo to LoginForm**

```jsx
import { Logo } from "@/components/ui/Logo";

// Inside CardHeader:
<CardHeader>
  <Logo className="h-16 mx-auto mb-2" />
  <CardTitle>Login to AgapaySF</CardTitle>
</CardHeader>
```

- [ ] **Step 2: Add Logo to RegisterForm**

```jsx
import { Logo } from "@/components/ui/Logo";

// Inside CardHeader:
<CardHeader>
  <Logo className="h-16 mx-auto mb-2" />
  <CardTitle>Register for AgapaySF</CardTitle>
</CardHeader>
```

- [ ] **Step 3: Commit changes**

```bash
git add src/components/auth/LoginForm.jsx src/components/auth/RegisterForm.jsx
git commit -m "feat: add Logo to auth forms"
```

### Task 4: Update Favicon

**Files:**
- Modify: `public/favicon.svg` (replace with `src/assets/favicon.svg`)

- [ ] **Step 1: Copy favicon asset**

```bash
cp src/assets/favicon.svg public/favicon.svg
```

- [ ] **Step 2: Commit changes**

```bash
git add public/favicon.svg
git commit -m "feat: update system favicon"
```

### Task 5: Verification

- [ ] **Step 1: Verify Logo in Navbar**
- [ ] **Step 2: Verify Logo in Login/Register pages**
- [ ] **Step 3: Verify browser favicon update**
