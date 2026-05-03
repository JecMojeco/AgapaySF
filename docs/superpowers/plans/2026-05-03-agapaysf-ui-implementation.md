# AgapaySF UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a functional, responsive React interface for AgapaySF with mock authentication and route protection.

**Architecture:** Responsive SPA using React Router. Components are modular and separated by domain (auth, dashboard, layout).

**Tech Stack:** Vite, React (JS), Tailwind CSS, shadcn/ui, lucide-react, react-router-dom.

---

### Task 1: Project Scaffolding & Dependencies

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`
- Modify: `src/main.jsx`, `src/App.jsx`

- [ ] **Step 1: Scaffold Vite project**
Run: `npm create vite@latest . -- --template react`
Expected: Project structure created.

- [ ] **Step 2: Install core dependencies**
Run: `npm install tailwindcss postcss autoprefixer react-router-dom lucide-react clsx tailwind-merge lucide-react`
Expected: Dependencies added to `package.json`.

- [ ] **Step 3: Initialize Tailwind**
Run: `npx tailwindcss init -p`
Expected: Config files created.

- [ ] **Step 4: Initialize shadcn/ui**
Run: `npx shadcn-ui@latest init` (Select defaults: Slate, CSS, Yes to everything)
Expected: `components.json` and `src/lib/utils.js` created.

- [ ] **Step 5: Commit scaffolding**
```bash
git add .
git commit -m "chore: scaffold vite + tailwind + shadcn"
```

---

### Task 2: Install UI Components (shadcn)

**Files:**
- Create: `src/components/ui/*.js`

- [ ] **Step 1: Install required components**
Run: `npx shadcn-ui@latest add card input button table badge label toast`
Expected: Files in `src/components/ui/`.

- [ ] **Step 2: Commit UI components**
```bash
git add src/components/ui
git commit -m "chore: add shadcn components"
```

---

### Task 3: Auth Components (LoginForm & RegisterForm)

**Files:**
- Create: `src/components/auth/LoginForm.jsx`
- Create: `src/components/auth/RegisterForm.jsx`

- [ ] **Step 1: Implement LoginForm**
```javascript
// src/components/auth/LoginForm.jsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ onLogin }) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login to AgapaySF</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact">Contact Number</Label>
          <Input id="contact" placeholder="09XXXXXXXXX" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onLogin}>Login</Button>
      </CardFooter>
    </Card>
  );
}
```

- [ ] **Step 2: Implement RegisterForm**
(Similar structure with Name, Contact, Password, Confirm)

- [ ] **Step 3: Commit Auth Components**
```bash
git add src/components/auth
git commit -m "feat: add LoginForm and RegisterForm"
```

---

### Task 4: Dashboard Components (StatsGrid & UserTable)

**Files:**
- Create: `src/components/dashboard/StatsGrid.jsx`
- Create: `src/components/dashboard/UserTable.jsx`

- [ ] **Step 1: Implement StatsGrid**
Using 3 Cards: Total Users, System Uptime, Pending Requests.

- [ ] **Step 2: Implement UserTable**
Columns: Name, Contact, Role, Status (Badge), Actions.

- [ ] **Step 3: Commit Dashboard Components**
```bash
git add src/components/dashboard
git commit -m "feat: add StatsGrid and UserTable"
```

---

### Task 5: Layout Components (Navbar, Sidebar, BottomNav)

**Files:**
- Create: `src/components/layout/Layout.jsx`
- Create: `src/components/layout/Navbar.jsx`
- Create: `src/components/layout/Sidebar.jsx`
- Create: `src/components/layout/BottomNav.jsx`

- [ ] **Step 1: Implement Layout Wrapper**
Conditional rendering: Sidebar on desktop, BottomNav on mobile.

- [ ] **Step 2: Commit Layout**
```bash
git add src/components/layout
git commit -m "feat: add responsive layout components"
```

---

### Task 6: Routing & Page Assembly

**Files:**
- Create: `src/pages/LoginPage.jsx`
- Create: `src/pages/RegisterPage.jsx`
- Create: `src/pages/DashboardPage.jsx`
- Create: `src/pages/UserManagementPage.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Setup React Router in App.jsx**
Define routes: `/login`, `/register`, `/dashboard`, `/dashboard/users`.

- [ ] **Step 2: Implement Pages**
Map components to pages.

- [ ] **Step 3: Commit Routing**
```bash
git add src/pages src/App.jsx
git commit -m "feat: implement routing and pages"
```

---

### Task 7: Auth Logic & Route Protection

**Files:**
- Create: `src/components/auth/ProtectedRoute.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Implement ProtectedRoute**
Check `localStorage.getItem('auth')`. Redirect if missing.

- [ ] **Step 2: Implement Login/Logout logic**
Update `LoginForm` to set `auth` in LocalStorage. Add Logout to Navbar.

- [ ] **Step 3: Add Toaster for login success**
Install `toaster` component and trigger on login.

- [ ] **Step 4: Final Commit**
```bash
git add .
git commit -m "feat: add auth logic and route protection"
```
