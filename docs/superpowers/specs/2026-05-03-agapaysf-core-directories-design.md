# Phase 3: Core Directories Design Spec

**Goal:** Implement CRUD and lookup interfaces for Disaster Events, Barangay Zones, Residents, and Structures. This provides the data foundation for disaster assessment and evacuation logging.

---

## 1. Architecture Overview

### Backend (Node.js/Express)
New controllers and routes will be added for each entity. Each will follow a standard pattern:
- `GET /api/<entity>`: List all with optional filters (e.g., zone, disaster type).
- `GET /api/<entity>/:id`: Get details for a single record.
- `POST /api/<entity>`: Create a new record.
- `PATCH /api/<entity>/:id`: Update existing record.
- `DELETE /api/<entity>/:id`: Remove a record (with dependency checks).

### Frontend (React/shadcn)
Each directory will have:
- **Index Page**: A searchable/filterable table using shadcn `Table`.
- **Form Component**: A reusable form for Create/Edit using `react-hook-form` and `zod` for validation.
- **Lookup Component**: Specialized search inputs (e.g., finding a resident by name to assign as an owner).

---

## 2. Functional Requirements

### 2.1 Disaster Event Management
- **Fields**: Name, Type (Enum: Flood, Typhoon, Fire, Earthquake, Landslide), Start Date, End Date (Optional).
- **Listing**: Grouped by Year, then by Date descending. Ongoing events (null `date_ended`) are highlighted.
- **Role Access**: Admin (Full CRUD), others (Read-only).

### 2.2 Barangay Zone Management
- **Fields**: Zone Name, Assigned Kagawad (FK to `USER`).
- **Logic**: Assignment dropdown only lists users with the `Kagawad` role.
- **Role Access**: Admin (Full CRUD), others (Read-only).

### 2.3 Resident Directory
- **Fields**: Surname, First Name, MI, Gender, Birth Date, Contact, Family Size, Zone (FK to `BARANGAY_ZONE`).
- **Vulnerability Checklist**: Manual numeric inputs (0-99) for:
    - Senior Citizens
    - 4Ps Members
    - Babies (0-2 years)
    - Infants (Under 1 year)
    - Pregnant Members
    - PWDs
- **Search**: Case-insensitive name search and zone filtering.
- **Role Access**: Admin, Kagawad, and Staff (Full CRUD).

### 2.4 Structure Directory
- **Fields**: Address, Structure Type (Enum: Residential, Commercial, Agricultural, Industrial), Owner (FK to `RESIDENT`).
- **Workflow**: Requires selecting a resident from a lookup search.
- **Role Access**: Admin, Kagawad, and Staff (Full CRUD).

---

## 3. Data Flow & Logic

### 3.1 Resident Lookup Flow (for Structures)
1. User enters name in "Owner Search" box in Structure form.
2. Frontend debounces call to `GET /api/residents?search=<query>`.
3. User selects resident from results.
4. `resident_id` is stored in form state and sent as `owner_id` on POST.

### 3.2 Dependency Management
- Cannot delete a `USER` assigned to a `ZONE`.
- Cannot delete a `ZONE` containing `RESIDENT`s.
- Cannot delete a `RESIDENT` owning a `STRUCTURE`.
- *Note: For Phase 3, we will implement basic error handling for foreign key violations.*

---

## 4. Testing Strategy
- **Unit Tests**: Controller methods using mocked DB.
- **Integration Tests**: Supertest suite for API endpoints.
- **Frontend**: Verify form validation (e.g., negative numbers in vulnerability counts) and successful lookup population.
