# AgapaySF System Documentation

AgapaySF is a Disaster Response Management System designed for Barangay San Francisco. It centralizes resident data, structure assessments, and evacuation logs to streamline emergency operations.

## 🏗 Architecture Overview

The system follows a **Single Page Application (SPA)** architecture with a decoupled Backend API.

- **Frontend**: React (Vite) + Tailwind CSS + Shadcn UI.
  - State management via React Hooks (useState, useCallback, useEffect).
  - Routing via react-router-dom (Client-Side Routing).
  - Authentication context (AuthContext) manages session state across the app.
- **Backend**: Node.js + Express.
  - Session-based authentication using express-session.
  - RESTful API endpoints for data operations.
- **Database**: PostgreSQL.
  - Relational schema with Enums for strict data integrity (roles, disaster types, etc.).
- **Storage**: Local filesystem for structure damage photos (server/uploads).

---

## 💡 Technical Rationales

### Why Single Page Application (SPA)?
Unlike traditional multi-page websites that reload the entire page on every click, AgapaySF uses **SPA architecture**.
- **User Experience**: Transitions between pages (e.g., from Dashboard to Evacuation Log) are instantaneous, providing a fluid, "app-like" feel.
- **Operational Speed**: In disaster scenarios, every second counts. SPAs reduce server load and latency by only fetching the data needed, not the entire UI layout.
- **State Persistence**: The authentication and global state remain active without re-initialization during navigation.

### Why PostgreSQL instead of MySQL?
While both are excellent, **PostgreSQL** was chosen for its advanced features:
- **Strict Data Integrity**: AgapaySF relies heavily on ENUM types and CHECK constraints (e.g., ensuring family size is greater than or equal to 1). PostgreSQL handles these natively and more robustly than MySQL.
- **Complex Queries**: PostgreSQL's query planner is superior for the types of multi-table joins used in our reporting and detailed logs.
- **Reliability**: It is widely considered the most advanced open-source database, offering higher concurrency and better data safety.

### Why React + Vite?
- **Component-Based**: Allows us to build reusable UI parts like the Logo, StatsGrid, and Toaster.
- **Fast Development**: **Vite** provides nearly instant hot-module replacement, meaning changes reflect in the browser immediately during development.

---

## 🚀 Core Functionalities

### 1. Authentication & User Management
- **Registration**: Users register with an 11-digit PH mobile number (09XXXXXXXXX). Accounts are PENDING until approved by an Admin.
- **Login**: Validates credentials and establishes a secure session.
- **Roles**: 
  - Admin: Full access, including user approval, event management, and system-wide reports.
  - Kagawad: Assigned to specific zones; can perform assessments and manage evacuations.
  - Staff: General operational access (lookup residents, log evacuations).

### 2. Disaster Event Management
- **Lifecycle**: Admin creates an event (e.g., "Typhoon Odette"). The event stays "Active" until a date_ended is set.
- **Context**: Most operational data (assessments, evacuations) is linked to a specific Disaster Event.

### 3. Damage Assessment
- **Process**: Kagawads or Admin record structure damage.
- **Data**: Linked to a Structure and an Event. Includes damage level (Partial or Total) and optional photo proof.

### 4. Evacuation Logging
- **Process**: Residents are logged into centers during an active event.
- **Tracking**: Monitors arrival dates, departure dates, and current status (Evacuated, Returned, Transferred).
- **Vulnerability**: Specifically tracks vulnerable members (seniors, infants, PWDs, 4Ps) for priority assistance.

### 5. Reporting
- **Dashboard**: Real-time summary of active events and system activity.
- **Exports**: Detailed datasets can be exported as CSV for Damage Assessments and Evacuation Logs.

---

## 📝 Critical Rules to Remember (Memory Sheet)

### Data Validation
- **Phone Numbers**: Must be exactly 11 digits, numeric only, starting with 09.
- **Passwords**: Minimum 8 characters, must contain:
  - At least one Letter (A-Z).
  - At least one Number (0-9).
  - At least one Special Character (@$!%*?&).
- **Family Size**: Minimum of 1.

### Route Mapping
- All Admin-specific pages are prefixed with /admin/ (e.g., /admin/users, /admin/zones).
- Critical operational routes:
  - /assessments: History of damage reports.
  - /evacuation: Resident check-in/out.
  - /residents: Master directory of citizens.

### Database Constraints
- **Zones**: Every resident and structure must be assigned to a BARANGAY_ZONE.
- **Users**: Unique contact numbers; cannot delete users with active logs.

---

## 🛠 Tech Stack Summary

| Layer | Technology |
|-------|------------|
| UI | React 18 (SPA), Tailwind CSS |
| Icons | Lucide React |
| Backend | Node.js, Express |
| DB | PostgreSQL |
| Auth | Bcrypt, Express-Session |
| Date | Date-fns |

---

## 📁 Directory Structure

- /src/components: Reusable UI elements and complex feature forms.
- /src/pages: Top-level route components.
- /server/controllers: Logic for processing API requests.
- /server/routes: API endpoint definitions.
- /server/schema.sql: Foundational database structure.
