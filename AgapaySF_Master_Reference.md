

# AgapaySF: Barangay San Francisco Disaster Assessment and Reporting System

**Institution:** University of Nueva Caceres — School of Computer and Information Sciences  
**Academic Year:** 2025–2026  
**Group Members:** Bautista, John Paulo · Mojeco, Jec Dainel · Sacayan, Maddox Dimitri

---

## 1. Project Overview

### System Purpose

AgapaySF is a web-based disaster assessment and reporting system developed for **Barangay San Francisco, Magarao, Camarines Sur**. The system digitizes the barangay's disaster response documentation process, which is currently paper-based and prone to delays, incomplete records, and consolidation failures during active disaster events.

The name *agapay* is Filipino for *companion*, reflecting the system's intent to be a practical field support tool for barangay officials.

### Objectives

- Enable Barangay Kagawads to submit damage assessment reports directly from the field via mobile browser.
- Enable Barangay Staff to record and update evacuation logs in real time.
- Enable the Admin (Barangay Captain) to generate consolidated Damage Assessment and Evacuation Summary reports exportable for official submission to the LGU and MDRRMO.
- Reduce report consolidation time from hours or days to minutes.
- Eliminate duplicate and missing records through centralized data management.
- Comply with the Philippine Data Privacy Act of 2012 (RA 10173) through controlled access, secure authentication, and proper data handling.
- Support Barangay obligations under RA 10121 (DRRM Act of 2010).

### Scope

**In scope:**
- Recording disaster events (typhoons, floods, fires, earthquakes, landslides)
- Damage assessment reporting for residential, commercial, agricultural, and industrial structures
- Photo documentation upload as proof of damage
- Damage classification: Partially Damaged or Totally Damaged
- Resident evacuation tracking, including arrival/departure dates and status
- Aggregated counts of vulnerable sector members and 4Ps beneficiaries per evacuation record
- Consolidated report generation and PDF export/print for LGU and MDRRMO submission
- Administrator-controlled user registration and role assignment
- Coverage limited to **Barangay San Francisco, Magarao, Camarines Sur only**

**Explicitly out of scope:**
- Financial or monetary damage cost estimation (no peso values)
- Disaster prediction, early warning, or weather monitoring
- Integration with external government databases (NDRRMC, PAGASA, PhilSys, PSA)
- SMS, push notification, OTP, or email alert systems
- Relief goods inventory management or beneficiary payout tracking
- Real-time simultaneous multi-user editing of the same record

### Stakeholders

| Stakeholder | Role in System | System Access |
|---|---|---|
| Barangay Captain | System Admin; oversees operations; manages user accounts | Full access (all modules + User Management) |
| Barangay Kagawads | Primary field users; submit damage assessments; log evacuations | Dashboard, Assessment, Evacuation Log, View Reports (own zone) |
| Barangay Staff / Volunteers | Assist with data encoding; manage evacuation records | Dashboard, Evacuation Log, View Reports (read-only) |
| Affected Residents | Beneficiaries of the system; do not interact with it directly | No system access |
| LGU / MDRRMO | Receive generated reports; allocate resources | No system access (receive printed/exported reports only) |

---

## 2. System Architecture Overview

### High-Level Description

AgapaySF is a **Single Page Application (SPA)** with a three-tier architecture:

1. **Frontend** — React SPA, mobile-first, served to the browser. Navigates between screens without full page reloads, optimizing usability for field use on mobile browsers.
2. **Backend** — Node.js with Express REST API. Handles routing, authentication middleware, session management, and business logic.
3. **Database** — PostgreSQL relational database, normalized to Third Normal Form (3NF).

### Components

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | SPA architecture, component-based UI, mobile-first |
| UI Components | Shadcn | Pre-built mobile-friendly components |
| Backend | Node.js + Express | API routing, authentication, business logic |
| DB Communication | node-postgres (`pg`) or Prisma ORM | Connects Express to PostgreSQL |
| Authentication | Express sessions + bcrypt | Login, session management, password hashing |
| File Storage | Multer (Node.js library) | Server-side photo evidence uploads |
| Version Control | Git + GitHub | Team collaboration and code management |
| Local Dev | Node.js + PostgreSQL local install | Development and demo environment |
| UI Prototyping | Figma / Google Stitch | Mockups prior to development |

### User Roles and Access Matrix

| Permission | Admin | Kagawad | Staff / Volunteer |
|---|---|---|---|
| Dashboard | ✓ | ✓ | ✓ |
| File Assessment Report | ✓ | ✓ | ✗ |
| Evacuation Log | ✓ | ✓ | ✓ |
| View Reports | ✓ | ✓ (own zone only) | ✓ (read-only) |
| Export Reports | ✓ | ✗ | ✗ |
| User Management | ✓ | ✗ | ✗ |

---

## 3. Functional Requirements

### Module 1: User Authentication and Account Management

- **FR-1.1** — The system shall provide a registration page where applicants submit their Name, Contact Number, and desired password.
- **FR-1.2** — Upon registration, the system shall set the account status to `PENDING` and display: *"Your registration request has been submitted. Please wait for your administrator to approve your account before logging in."*
- **FR-1.3** — The Admin shall be able to view all pending registration requests in an approval panel, review applicant name, contact number, and requested role, and either **Approve** or **Reject** each account.
- **FR-1.4** — Upon approval, the Admin shall assign the user's role (`Kagawad`, `Staff`, or `Admin`) before activating the account.
- **FR-1.5** — Approved users shall be able to log in using their registered Contact Number and password.
- **FR-1.6** — The system shall display `"Incorrect contact number or password. Please try again."` for failed login attempts.
- **FR-1.7** — The system shall display `"Your account is still pending approval. Please contact your barangay administrator."` for login attempts by users with `PENDING` status.
- **FR-1.8** — Upon successful login, the system shall redirect the user to a role-appropriate dashboard.
- **FR-1.9** — A brief privacy notice compliant with RA 10173 shall be displayed on the login screen.

### Module 2: Damage Assessment

- **FR-2.1** — Only users with role `Kagawad` or `Admin` shall be able to create new damage assessment reports.
- **FR-2.2** — The damage assessment form shall be implemented as a 3-step stepper form.
  - **Step 1:** User selects the active Disaster Event and corresponding Barangay Zone from dropdowns.
  - **Step 2:** User searches for the affected structure by address or owner name and selects from results. If the structure does not yet exist, the user shall be able to enter new structure details.
  - **Step 3:** User selects damage level via two labeled cards — **Partially Damaged** or **Totally Damaged** — and optionally attaches a photo from the device camera or gallery.
- **FR-2.3** — Before final submission, the system shall display a summary review screen showing all entered data.
- **FR-2.4** — Upon submission, the system shall automatically record a `timestamp` and the filing user's `user_id` against the report.
- **FR-2.5** — A confirmation screen shall be displayed after successful submission, with options to file another report or return to the dashboard.
- **FR-2.6** — Each `ASSESSMENT_REPORT` record shall be linked to exactly one `DISASTER_EVENT`, one `STRUCTURE`, and one `USER`.

### Module 3: Evacuation Log

- **FR-3.1** — Users with role `Kagawad`, `Staff`, or `Admin` shall be able to create and update evacuation log entries.
- **FR-3.2** — The evacuation log form shall be implemented as a 2-step stepper form.
  - **Step 1:** User searches the resident directory by name. If found, user selects the existing record. If not found, user enters resident details: Surname, First Name, Middle Initial, Gender, Contact Number, Family Size, and counts for vulnerable groups: `senior_citizen_count`, `fourPs_member_count`, `baby_count`, `infant_count`, `pregnant_count`, `pwd_count`.
  - **Step 2:** User selects the Disaster Event, enters the Arrival Date, and sets status to `Evacuated`.
- **FR-3.3** — The system shall save the evacuation log record linked to the resident and disaster event.
- **FR-3.4** — Existing evacuation log entries shall be updatable. When a resident returns home or is transferred, the user shall be able to set the Departure Date and change the status to `Returned` or `Transferred`.
- **FR-3.5** — Evacuation status indicators shall be color-coded: `Evacuated` = Green, `Returned` = Blue, `Transferred` = Gray.

### Module 4: Report Generation

- **FR-4.1** — Only users with role `Admin` shall be able to generate and export reports.
- **FR-4.2** — The Admin shall select a Disaster Event and a report type — **Damage Assessment Summary** or **Evacuation Summary** — to generate a report.
- **FR-4.3** — The system shall retrieve all relevant records for the selected event and render them in a consolidated table.
- **FR-4.4** — The Admin shall be able to export the report as a PDF or print it directly for submission to the LGU or MDRRMO.

### Module 5: Resident Directory

- **FR-5.1** — The system shall maintain a centralized resident directory linked to barangay zones.
- **FR-5.2** — Residents shall be searchable by name across all modules that require resident lookup.
- **FR-5.3** — Each resident record shall store demographic and household vulnerability data including family size, senior citizen count, 4Ps membership count, baby count, infant count, pregnant member count, and PWD count.

### Module 6: Disaster Event Management

- **FR-6.1** — The system shall allow Admin users to create and manage Disaster Event records.
- **FR-6.2** — Each event shall record: event name, start date, end date (nullable), and disaster type.
- **FR-6.3** — Disaster types supported: `Flood`, `Typhoon`, `Fire`, `Earthquake`, `Landslide`.

---

## 4. Non-Functional Requirements

### Performance
- The SPA architecture shall allow screen transitions without full page reloads to minimize network dependency during active field use.
- Report generation shall consolidate all relevant records and render output within an acceptable response time for academic-grade deployment.

### Security
- All passwords shall be hashed using `bcrypt` before storage. Plaintext passwords shall never be stored.
- User sessions shall be managed server-side using Express sessions.
- Account access shall be gated through Admin-controlled approval workflow; no self-activation is permitted.
- System access shall be restricted to verified barangay personnel only.
- The system shall comply with the Philippine Data Privacy Act of 2012 (RA 10173): controlled access, secure authentication, and proper data handling for sensitive resident information.
- A privacy notice shall be displayed on the login screen.

### Scalability
- The PostgreSQL database shall be normalized to 3NF to support data integrity as records grow across multiple disaster events.
- The modular React component architecture shall allow new features to be added without restructuring existing screens.

### Reliability
- Each `ASSESSMENT_REPORT` submission shall be atomically committed to the database with a system-generated timestamp to prevent partial records.
- Resident lookup shall prevent duplicate entries by searching the existing directory before creating a new record.

### Usability
- The interface shall be designed **mobile-first**, with large touch targets and minimal steps to complete each task.
- All data entry forms shall use multi-step stepper layouts to reduce cognitive load for field users.
- Damage level selection shall use large, clearly labeled visual cards rather than small radio buttons.
- The system shall remain usable by users with limited experience with digital forms.

### Color Palette (Functional Design System)

| Color Name | Hex Code | Usage |
|---|---|---|
| Primary Blue | `#1565C0` | Main brand color, primary buttons, navigation |
| Dark Blue | `#0D47A1` | Headers, emphasis elements |
| Light Blue | `#E3F2FD` | Card backgrounds, information panels |
| Alert Orange | `#E65100` | Totally Damaged status indicator |
| Warning Amber | `#F9A825` | Partially Damaged status indicator |
| Success Green | `#2E7D32` | Evacuated and Returned status confirmations |
| White | `#FFFFFF` | Card and form field backgrounds |
| Gray | `#F5F5F5` | Page backgrounds, alternating table rows |
| Text Dark | `#212121` | Primary body text |

---

## 5. Data Dictionary

### USER

| Field Name | Data Type | Description | Constraints |
|---|---|---|---|
| `user_id` | Integer (1–10 digits) | System-assigned unique identifier | PK, System Assigned, NOT NULL |
| `name` | VARCHAR(100) | Full name of the user | NOT NULL; chars: `a-z`, `A-Z`, `-`, `'`, `.`, space |
| `role` | ENUM | Access role of the user | NOT NULL; values: `Kagawad`, `Staff`, `Admin` |
| `contact_number` | CHAR(11) | Philippine mobile number | NOT NULL; exactly 11 numeric digits |
| `password` | VARCHAR(50) | Encrypted password | NOT NULL; 8–50 chars; `a-z`, `A-Z`, `0-9`, `!`, `@`, `#`, `$`, `%`; stored as bcrypt hash |

---

### DISASTER_EVENT

| Field Name | Data Type | Description | Constraints |
|---|---|---|---|
| `event_id` | Integer (1–10 digits) | System-assigned unique identifier | PK, System Assigned, NOT NULL |
| `event_name` | VARCHAR(100) | Descriptive name of the disaster event | NOT NULL; chars: `a-z`, `A-Z`, `0-9`, `-`, space |
| `date_started` | DATE | Date the disaster event began | NOT NULL |
| `date_ended` | DATE | Date the disaster event ended | NULLABLE |
| `disaster_type` | ENUM | Category of the disaster | NOT NULL; values: `Flood`, `Typhoon`, `Fire`, `Earthquake`, `Landslide` |

---

### BARANGAY_ZONE

| Field Name | Data Type | Description | Constraints |
|---|---|---|---|
| `zone_id` | Integer (1–10 digits) | System-assigned unique identifier | PK, System Assigned, NOT NULL |
| `zone_name` | VARCHAR(30) | Name of the barangay zone | NOT NULL; chars: `a-z`, `A-Z`, `0-9`, `-`, space |
| `assigned_kagawad` | Integer | FK to the Kagawad responsible for this zone | FK → `USER(user_id)`, NOT NULL |

---

### RESIDENT

| Field Name | Data Type | Description | Constraints |
|---|---|---|---|
| `resident_id` | Integer (1–10 digits) | System-assigned unique identifier | PK, System Assigned, NOT NULL |
| `surname` | VARCHAR(30) | Family name | NOT NULL; chars: `a-z`, `A-Z`, `-`, `'` |
| `first_name` | VARCHAR(30) | Given name | NOT NULL; chars: `a-z`, `A-Z`, `-`, `'` |
| `middle_initial` | CHAR(1) | Middle initial | NULLABLE; chars: `a-z`, `A-Z` |
| `gender` | ENUM | Gender of the resident (family head) | NOT NULL; values: `M`, `F` |
| `birth_date` | DATE | Date of birth | NOT NULL |
| `contact_number` | CHAR(11) | Mobile number | NULLABLE; exactly 11 numeric digits |
| `family_size` | Integer (1–3 digits) | Total number of family members | NOT NULL; range: 1–999 |
| `senior_citizen_count` | Integer (0–2 digits) | Count of senior citizens in the household | NOT NULL; range: 0–99; default 0 |
| `fourPs_member_count` | Integer (0–2 digits) | Count of 4Ps beneficiaries in the household | NOT NULL; range: 0–99; default 0 |
| `baby_count` | Integer (0–2 digits) | Count of babies in the household | NOT NULL; range: 0–99; default 0 |
| `infant_count` | Integer (0–2 digits) | Count of infants in the household | NOT NULL; range: 0–99; default 0 |
| `pregnant_count` | Integer (0–2 digits) | Count of pregnant members in the household | NOT NULL; range: 0–99; default 0 |
| `pwd_count` | Integer (0–2 digits) | Count of PWD members in the household | NOT NULL; range: 0–99; default 0 |
| `zone_id` | Integer | FK to the barangay zone of the resident | FK → `BARANGAY_ZONE(zone_id)`, NOT NULL |

---

### STRUCTURE

| Field Name | Data Type | Description | Constraints |
|---|---|---|---|
| `structure_id` | Integer (1–10 digits) | System-assigned unique identifier | PK, System Assigned, NOT NULL |
| `address` | VARCHAR(150) | Physical address of the structure | NOT NULL; chars: `a-z`, `A-Z`, `0-9`, `,`, `.`, `#`, `-`, space |
| `owner_id` | Integer | FK to the resident who owns this structure | FK → `RESIDENT(resident_id)`, NOT NULL |
| `structure_type` | ENUM | Category of the structure | NOT NULL; values: `Residential`, `Commercial`, `Agricultural`, `Industrial` |

---

### ASSESSMENT_REPORT

| Field Name | Data Type | Description | Constraints |
|---|---|---|---|
| `report_id` | Integer (1–10 digits) | System-assigned unique identifier | PK, System Assigned, NOT NULL |
| `user_id` | Integer | FK to the user who filed the report | FK → `USER(user_id)`, NOT NULL |
| `event_id` | Integer | FK to the disaster event this report belongs to | FK → `DISASTER_EVENT(event_id)`, NOT NULL |
| `structure_id` | Integer | FK to the assessed structure | FK → `STRUCTURE(structure_id)`, NOT NULL |
| `damage_level` | ENUM | Classification of structural damage | NOT NULL; values: `Partial`, `Total` |
| `photo_url` | VARCHAR(255) | Server-side path or URL of uploaded photo evidence | NULLABLE; chars: `a-z`, `A-Z`, `0-9`, `/`, `:`, `.`, `_`, `-` |
| `timestamp` | DATETIME | System-generated submission datetime | NOT NULL, System Assigned |

---

### EVACUATION_LOG

| Field Name | Data Type | Description | Constraints |
|---|---|---|---|
| `evacuation_id` | Integer (1–10 digits) | System-assigned unique identifier | PK, System Assigned, NOT NULL |
| `resident_id` | Integer | FK to the evacuated resident | FK → `RESIDENT(resident_id)`, NOT NULL |
| `event_id` | Integer | FK to the associated disaster event | FK → `DISASTER_EVENT(event_id)`, NOT NULL |
| `arrival_date` | DATE | Date the resident arrived at the evacuation site | NOT NULL |
| `departure_date` | DATE | Date the resident left the evacuation site | NULLABLE |
| `status` | ENUM | Current evacuation status of the resident | NOT NULL; values: `Evacuated`, `Returned`, `Transferred` |

---

## 6. Database Schema (Relational Model)

### Table Definitions

```
USER(user_id PK, name, role, contact_number, password)

DISASTER_EVENT(event_id PK, event_name, date_started, date_ended, disaster_type)

BARANGAY_ZONE(zone_id PK, zone_name, assigned_kagawad FK→USER.user_id)

RESIDENT(resident_id PK, surname, first_name, middle_initial, gender, birth_date,
         contact_number, family_size, senior_citizen_count, fourPs_member_count,
         baby_count, infant_count, pregnant_count, pwd_count, zone_id FK→BARANGAY_ZONE.zone_id)

STRUCTURE(structure_id PK, address, owner_id FK→RESIDENT.resident_id, structure_type)

ASSESSMENT_REPORT(report_id PK, user_id FK→USER.user_id, event_id FK→DISASTER_EVENT.event_id,
                  structure_id FK→STRUCTURE.structure_id, damage_level, photo_url, timestamp)

EVACUATION_LOG(evacuation_id PK, resident_id FK→RESIDENT.resident_id,
               event_id FK→DISASTER_EVENT.event_id, arrival_date, departure_date, status)
```

### Relationships and Cardinality

| Relationship | Cardinality | Description |
|---|---|---|
| `BARANGAY_ZONE` → `USER` | Many-to-One | Each zone is assigned to exactly one Kagawad; one Kagawad may be assigned to multiple zones |
| `RESIDENT` → `BARANGAY_ZONE` | Many-to-One | Each resident belongs to exactly one zone; a zone has many residents |
| `STRUCTURE` → `RESIDENT` | Many-to-One | Each structure has exactly one owner; a resident may own multiple structures |
| `ASSESSMENT_REPORT` → `USER` | Many-to-One | Each report is filed by exactly one user; a user may file many reports |
| `ASSESSMENT_REPORT` → `DISASTER_EVENT` | Many-to-One | Each report belongs to exactly one disaster event; an event has many reports |
| `ASSESSMENT_REPORT` → `STRUCTURE` | Many-to-One | Each report assesses exactly one structure; a structure may have multiple reports across events |
| `EVACUATION_LOG` → `RESIDENT` | Many-to-One | Each log entry tracks exactly one resident; a resident may have logs across multiple events |
| `EVACUATION_LOG` → `DISASTER_EVENT` | Many-to-One | Each log entry belongs to exactly one disaster event; an event has many log entries |

---

## 7. System Workflows / Process Flows

### Process 1: User Registration and Account Approval

- **Actor:** Applicant (prospective Kagawad/Staff), Admin
- **Trigger:** Applicant visits the AgapaySF registration page
- **Preconditions:** Registration page is accessible; no active session exists for the applicant

**Main Flow:**
1. Applicant fills in Name, Contact Number, and desired password on the registration page.
2. System creates the user account with `status = PENDING`.
3. System displays confirmation: *"Your registration request has been submitted. Please wait for your administrator to approve your account before logging in."*
4. Admin reviews the pending account in the User Approval Panel (displays name, contact number, requested role).
5. Admin verifies the applicant is a legitimate Barangay San Francisco official or volunteer.
6. Admin assigns a role (`Kagawad`, `Staff`, or `Admin`) and clicks **Approve**.
7. System sets account `status = ACTIVE`.
8. User may now log in with their Contact Number and password.

**Alternate Flow — Rejection:**
- At Step 6, Admin clicks **Reject**.
- Account `status` remains `INACTIVE`.
- User cannot log in.

**Postconditions:** Approved user account is active with an assigned role; rejected account remains inactive.

---

### Process 2: User Login

- **Actor:** Registered User
- **Trigger:** User visits the AgapaySF login page
- **Preconditions:** User has a registered account

**Main Flow:**
1. User enters registered Contact Number and password.
2. System verifies credentials and checks account status.
3. If credentials are valid and account status is `ACTIVE`, user is redirected to their role-appropriate dashboard.

**Alternate Flow A — Invalid Credentials:**
- System displays: *"Incorrect contact number or password. Please try again."*

**Alternate Flow B — Pending Account:**
- System displays: *"Your account is still pending approval. Please contact your barangay administrator."*

**Postconditions:** Authenticated user is on their role-appropriate dashboard with an active session.

---

### Process 3: Damage Assessment Submission

- **Actor:** Kagawad (or Admin)
- **Trigger:** User taps "New Assessment" from the dashboard
- **Preconditions:** User is authenticated with role `Kagawad` or `Admin`; at least one active Disaster Event exists; at least one Barangay Zone exists

**Main Flow:**
1. User taps **New Assessment** from the dashboard.
2. **(Stepper Step 1 of 3)** User selects the active Disaster Event and corresponding Zone from dropdowns.
3. **(Stepper Step 2 of 3)** User searches for the affected structure by address or owner name.
   - If structure is found: User selects the correct entry from results.
   - If structure is not found: User enters new structure details (address, owner, structure type).
4. **(Stepper Step 3 of 3)** User selects damage level via labeled card: **Partially Damaged** or **Totally Damaged**. User optionally attaches a photo from the device camera or gallery.
5. System displays a review summary screen with all entered data.
6. User confirms and submits.
7. System saves the `ASSESSMENT_REPORT` record with an auto-generated `timestamp` and the user's `user_id`.
8. System displays a confirmation screen with options to file another report or return to the dashboard.

**Postconditions:** A new `ASSESSMENT_REPORT` record is persisted, timestamped, and attributed to the filing user.

---

### Process 4: Evacuation Log Entry

- **Actor:** Kagawad or Staff (or Admin)
- **Trigger:** User taps "Log Evacuation" from the dashboard
- **Preconditions:** User is authenticated with role `Kagawad`, `Staff`, or `Admin`; at least one active Disaster Event exists

**Main Flow:**
1. User taps **Log Evacuation**.
2. **(Stepper Step 1 of 2)** User searches the resident directory by name.
   - If resident is found: User selects the existing resident record.
   - If resident is not found: User enters resident details — Surname, First Name, Middle Initial, Gender, Contact Number, Family Size, and vulnerable group counts (`senior_citizen_count`, `fourPs_member_count`, `baby_count`, `infant_count`, `pregnant_count`, `pwd_count`).
3. **(Stepper Step 2 of 2)** User selects the Disaster Event, enters the Arrival Date, and sets status to `Evacuated`.
4. User submits.
5. System saves the `EVACUATION_LOG` record linked to the resident and disaster event.

**Alternate Flow — Status Update:**
- When a resident returns home or is transferred, the user locates the existing log entry, sets the Departure Date, and changes status to `Returned` or `Transferred`.

**Postconditions:** A new or updated `EVACUATION_LOG` record is persisted and linked to the correct resident and disaster event.

---

### Process 5: Report Generation and Export

- **Actor:** Admin
- **Trigger:** Admin navigates to the Reports module from the sidebar
- **Preconditions:** Admin is authenticated; at least one Disaster Event with associated records exists

**Main Flow:**
1. Admin navigates to the **Reports** module via the sidebar.
2. Admin selects the relevant Disaster Event from a dropdown.
3. Admin selects report type: **Damage Assessment Summary** or **Evacuation Summary**.
4. System retrieves all relevant records for the selected event and presents them in a consolidated table.
5. Admin reviews the data.
6. Admin exports the report as a PDF or prints it for submission to the LGU or MDRRMO.

**Postconditions:** A consolidated report is available for official submission.

---

## 8. Business Rules

### Authentication Rules
- **BR-1:** Account registration requires Admin approval before login is permitted. No self-activation pathway exists.
- **BR-2:** Login credentials are Contact Number + Password. Usernames or email addresses are not used.
- **BR-3:** Passwords must be 8–50 characters and may contain letters, numbers, and the special characters `!`, `@`, `#`, `$`, `%`. Passwords are stored as bcrypt hashes.

### Damage Assessment Rules
- **BR-4:** Only users with roles `Kagawad` or `Admin` may submit `ASSESSMENT_REPORT` records.
- **BR-5:** Every `ASSESSMENT_REPORT` must be linked to exactly one `DISASTER_EVENT`, one `STRUCTURE`, and one `USER`.
- **BR-6:** `damage_level` accepts only two values: `Partial` or `Total`. No other damage classifications are permitted.
- **BR-7:** `timestamp` on `ASSESSMENT_REPORT` is system-generated at the time of submission and cannot be manually set by the user.
- **BR-8:** Photo upload is optional on damage assessment reports.

### Evacuation Log Rules
- **BR-9:** Users with roles `Kagawad`, `Staff`, or `Admin` may create and update `EVACUATION_LOG` entries.
- **BR-10:** `arrival_date` is required when creating an evacuation log entry. `departure_date` is nullable and set only when the resident departs.
- **BR-11:** Default status on new evacuation log entries is `Evacuated`. Status may be updated to `Returned` or `Transferred` when applicable.
- **BR-12:** Before creating a new `RESIDENT` record during evacuation logging, the system must first search the existing directory to prevent duplicate resident entries.

### Report Access Rules
- **BR-13:** Only users with role `Admin` may generate consolidated reports or export/print them.
- **BR-14:** Kagawad users may view reports scoped to their own zone only.
- **BR-15:** Staff/Volunteer users may view reports in read-only mode; they cannot export or print.

### Data Integrity Rules
- **BR-16:** `STRUCTURE.owner_id` must reference an existing `RESIDENT.resident_id`.
- **BR-17:** `BARANGAY_ZONE.assigned_kagawad` must reference a `USER.user_id` whose `role = 'Kagawad'`.
- **BR-18:** Resident vulnerability counts (`senior_citizen_count`, `fourPs_member_count`, `baby_count`, `infant_count`, `pregnant_count`, `pwd_count`) must each be a non-negative integer not exceeding 99.
- **BR-19:** `family_size` must be a positive integer (minimum 1).

### Scope Rules
- **BR-20:** The system is restricted to Barangay San Francisco, Magarao, Camarines Sur only. Multi-barangay support is not implemented.
- **BR-21:** No financial or monetary values (peso amounts) are collected, computed, or stored anywhere in the system.

---

## 9. Assumptions

### Explicit Assumptions
- All barangay personnel access the system via mobile web browsers (no native app). The system is optimized for mobile browsers.
- Users are assumed to have a basic level of literacy with mobile devices (touch interaction, camera use).
- The Barangay Captain holds the Admin role by default.
- Each Barangay Zone is assigned to exactly one Kagawad, though a single Kagawad may manage multiple zones.
- Resident records represent household family heads, not individuals.
- Vulnerable group counts per resident record represent aggregated household-level counts, not individually named members.
- Photo uploads are stored server-side (not in the database); only the file path/URL is stored in `ASSESSMENT_REPORT.photo_url`.
- Internet connectivity is available during system use. Offline mode is not supported.
- The system will be hosted on basic shared hosting supporting Node.js and PostgreSQL (estimated ₱500–₱1,500/year in the Philippines).

### System Limitations
- No financial damage estimation — no peso values collected or computed.
- No disaster prediction, early warning, or weather monitoring features.
- No integration with external government databases (NDRRMC, PAGASA, PhilSys, PSA).
- No SMS, push notification, OTP, or email alert functionality.
- No coverage of any barangay other than Barangay San Francisco, Magarao, Camarines Sur.
- No relief goods inventory management or beneficiary payout tracking.
- No real-time simultaneous multi-user editing of the same record.
- The system does not directly send any reports to the LGU or MDRRMO; reports must be manually exported and submitted.

---

## 10. Implementation Guidance for Developers

### Backend Expectations (Node.js + Express)

- Use **Express.js** for API routing.
- Implement **Express sessions** for session management.
- Use **bcrypt** for password hashing before storage. Never store plaintext passwords.
- Use **Multer** for handling multipart/form-data photo uploads. Store files on the server filesystem; save only the file path in the database.
- Use **node-postgres (`pg`)** or **Prisma ORM** for PostgreSQL database communication.
- Enforce role-based access control (RBAC) at the route/middleware level — not just in the frontend.
- Apply account status check (`PENDING` / `ACTIVE` / `INACTIVE`) at login middleware.

### Frontend Expectations (React + Shadcn)

- Implement as a **Single Page Application (SPA)** — no full page reloads between screens.
- Use **Shadcn** for pre-built, mobile-friendly components.
- All data entry forms for Damage Assessment (3-step) and Evacuation Log (2-step) must use **multi-step stepper** layouts.
- Registration form uses a **3-step stepper**: Step 1 (Name, Contact Number) → Step 2 (Password + Confirm) → Step 3 (Pending confirmation screen).
- The Dashboard must display: active disaster event banner, quick-action buttons, summary count cards, and a recent activity feed.
- Implement a **bottom navigation bar** on mobile viewports.
- Use the defined color palette consistently for status indicators (Partially Damaged = Amber `#F9A825`, Totally Damaged = Orange `#E65100`, Evacuated/Returned = Green `#2E7D32`).
- Apply route guards based on user role stored in session.

### Suggested Architecture Pattern

```
/client (React SPA)
  /components
    /auth         → Login, Registration, ApprovalPending
    /dashboard    → Dashboard, SummaryCards, ActivityFeed
    /assessment   → AssessmentStepper, StepEvent, StepStructure, StepDamage
    /evacuation   → EvacuationStepper, StepResident, StepEvent, LogList
    /reports      → ReportModule, DamageSummaryTable, EvacuationSummaryTable
    /admin        → UserApprovalPanel, UserList
  /hooks
  /context        → AuthContext (role, user_id, session)
  /utils

/server (Node.js + Express)
  /routes
    /auth         → POST /register, POST /login, POST /logout
    /users        → GET /users/pending, PATCH /users/:id/approve, PATCH /users/:id/reject
    /events       → GET, POST /events
    /zones        → GET, POST /zones
    /residents    → GET, POST /residents
    /structures   → GET, POST /structures
    /assessments  → GET, POST /assessments
    /evacuations  → GET, POST /evacuations, PATCH /evacuations/:id
    /reports      → GET /reports/damage/:eventId, GET /reports/evacuation/:eventId
  /middleware
    → authMiddleware (session check)
    → roleMiddleware (role-based guard)
  /uploads        → Multer-served photo files
  /db             → pg or Prisma config
```

### API Structure Suggestion

| Method | Endpoint | Role Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Submit new registration request |
| POST | `/api/auth/login` | Public | Authenticate user |
| POST | `/api/auth/logout` | Any | End session |
| GET | `/api/users/pending` | Admin | List all PENDING accounts |
| PATCH | `/api/users/:id/approve` | Admin | Approve and assign role to account |
| PATCH | `/api/users/:id/reject` | Admin | Reject account |
| GET | `/api/events` | Any | List all disaster events |
| POST | `/api/events` | Admin | Create new disaster event |
| GET | `/api/zones` | Any | List all barangay zones |
| GET | `/api/residents` | Kagawad, Staff, Admin | Search resident directory |
| POST | `/api/residents` | Kagawad, Staff, Admin | Add new resident record |
| GET | `/api/structures` | Kagawad, Admin | Search structure directory |
| POST | `/api/structures` | Kagawad, Admin | Add new structure record |
| POST | `/api/assessments` | Kagawad, Admin | Submit damage assessment report |
| GET | `/api/assessments/:eventId` | Kagawad (own zone), Admin | Get assessments by event |
| POST | `/api/evacuations` | Kagawad, Staff, Admin | Log new evacuation entry |
| PATCH | `/api/evacuations/:id` | Kagawad, Staff, Admin | Update evacuation status/departure date |
| GET | `/api/evacuations/:eventId` | Kagawad (view), Staff (view), Admin | Get evacuation log by event |
| GET | `/api/reports/damage/:eventId` | Admin | Generate damage summary |
| GET | `/api/reports/evacuation/:eventId` | Admin | Generate evacuation summary |

### Role-Based Access Logic

```
Session payload: { user_id, role, status }

Middleware guard (pseudocode):
  requireRole(...allowedRoles) {
    if (!session || !session.user_id) → 401 Unauthorized
    if (!allowedRoles.includes(session.role)) → 403 Forbidden
    if (session.status !== 'ACTIVE') → 403 Forbidden
    next()
  }

Kagawad zone scoping (assessments):
  If role === 'Kagawad':
    Filter ASSESSMENT_REPORT results where STRUCTURE.zone_id
    matches the zone(s) assigned to session.user_id in BARANGAY_ZONE
```

### Key Implementation Notes

1. **Account Status Flow:** `PENDING` → (Admin approves) → `ACTIVE` | (Admin rejects) → `INACTIVE`. Only `ACTIVE` accounts may authenticate.
2. **Stepper Forms:** Each step should validate its own fields before allowing progression to the next step. Do not submit partial data to the server mid-stepper.
3. **Timestamp Injection:** `ASSESSMENT_REPORT.timestamp` must be set server-side at request processing time, not client-side.
4. **Resident Deduplication:** The resident search in the Evacuation Log stepper must query the `RESIDENT` table before allowing creation of a new record. The user must confirm no match exists before creating a duplicate.
5. **Photo Storage:** Configure Multer to store uploads in a designated `/uploads` directory. Generate unique filenames (e.g., UUID-based) to prevent collisions. Return the relative path as `photo_url` to be stored in `ASSESSMENT_REPORT`.
6. **Report Export:** Use a server-side or client-side PDF generation library (e.g., `pdfkit` on Node.js or `jsPDF` on the client) to convert the consolidated report table to a printable PDF.
7. **Database Normalization:** The schema is normalized to 3NF. Avoid denormalizing by storing computed aggregates in the database; aggregate counts for reports should be computed at query time via SQL `SUM`/`COUNT`.
