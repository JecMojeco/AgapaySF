# AgapaySF UI Prototype Design Spec

**Date:** 2026-05-03  
**Project:** AgapaySF UI Development  
**Status:** Approved  

## 1. Overview
Build a functional, modular React interface for AgapaySF using `shadcn/ui`. Focus on responsive navigation (desktop sidebar, mobile bottom nav) and secure-feeling routing.

## 2. Architecture
- **Framework:** Vite + React (JavaScript)
- **UI Library:** shadcn/ui (Tailwind CSS)
- **Icons:** lucide-react
- **Routing:** react-router-dom
- **State:** React Context / LocalStorage (Mock Auth)

## 3. Components (Phase 1)
### Auth
- `LoginForm`: Card with Contact Number, Password, Login button.
- `RegisterForm`: Card with Name, Contact Number, Password, Confirm Password, Register button.

### User Management
- `UserTable`: Table showing Name, Contact, Role, Status (Badge), and Actions (Approve/Reject).

### Dashboard
- `StatsGrid`: Three cards showing "Total Users", "System Uptime", and "Pending Requests".

### Layout
- `Navbar`: Top bar with app logo and user profile/logout.
- `Sidebar`: Desktop-only left navigation.
- `BottomNav`: Mobile-only bottom navigation bar.

## 4. Navigation & Routing (Phase 2)
### Routes
- `/login`: Public Login Page
- `/register`: Public Registration Page
- `/dashboard`: Protected Main Dashboard
- `/dashboard/users`: Protected User Management Page

### Navigation Logic
- Use `useNavigate` for post-login redirect.
- Use `NavLink` for active state styling in Sidebar/BottomNav.

## 5. Auth & Logic (Phase 3)
### Protected Routes
- `ProtectedRoute` component: Redirects to `/login` if no `auth` token in LocalStorage.
- Auth-aware Redirect: Redirects from `/login` to `/dashboard` if `auth` token exists.

### UI Polish
- `shadcn` Toaster: "Login Successful" notification.
- Logout: Clear LocalStorage, redirect to `/login`.

## 6. Success Criteria
- Functional navigation between all pages.
- Desktop and mobile layouts match responsive goal.
- Route protection prevents unauthorized access to dashboard.
- Clean, modular component structure in `@/components/`.
