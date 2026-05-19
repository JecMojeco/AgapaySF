# 

# **AgapaySF: Barangay San Francisco Disaster Assessment and Reporting System:** 

**Group Members:**  
Bautista, John Paulo  
Mojeco, Jec Dainel  
Sacayan, Maddox Dimitri

1. #  **Table of Contents** {#table-of-contents}

[**I. Table of Contents	2**](#table-of-contents)

[**II. Purpose	4**](#ii.-purpose)

[**III. Goal	4**](#iii.-goal)

[**IV. Objectives	5**](#iv.-objectives)

[**V. Scope	5**](#v.-scope)

[A. Inclusions (What the Project Will Deliver)	5](#inclusions-\(what-the-project-will-deliver\))

[B. Exclusions (What Is Not Included in This Phase)	6](#exclusions-\(what-is-not-included-in-this-phase\))

[**VI. Project Overview	7**](#vi.-project-overview)

[A. Technology Stack	7](#heading=h.cg20lbimw788)

[**VII. Target Audience	8**](#vii.-target-audience)

[A. Primary Users (Direct System Interaction)	8](#a.-primary-users-\(direct-system-interaction\))

[B. Indirect Beneficiaries (No Direct System Access)	8](#b.-indirect-beneficiaries-\(no-direct-system-access\))

[**VIII. Functional & Non-Functional Requirements	9**](#viii.-functional-&-non-functional-requirements)

[A. Functional Requirements	9](#a.-functional-requirements)

[B. Non-Functional Requirements	10](#b.-non-functional-requirements)

[**IX. Modules	11**](#ix.-modules)

[1\. User Management Module	11](#1.-user-management-module)

[a. Account Registration	11](#a.-account-registration)

[b. Account Approval	11](#b.-account-approval)

[c. Login and Authentication	11](#c.-login-and-authentication)

[d. Role-Based Access Control	11](#d.-role-based-access-control)

[2\. Damage Assessment Module	12](#2.-damage-assessment-module)

[b. Report Recording	12](#b.-report-recording)

[c. Structure Management	12](#c.-structure-management)

[3\. Evacuation Log Module	14](#3.-evacuation-log-module)

[a. Evacuation Entry	14](#a.-evacuation-entry)

[b. Status Updates	14](#b.-status-updates)

[c. Evacuation Log Display	14](#c.-evacuation-log-display)

[4\. Report Generation Module	15](#4.-report-generation-module)

[a. Report Selection	15](#a.-report-selection)

[b. Report Display	15](#b.-report-display)

[c. Export and Print	15](#c.-export-and-print)

[5\. Admin Panel Module	16](#5.-admin-panel-module)

[a. Dashboard	16](#a.-dashboard)

[b. User Management	16](#b.-user-management)

[c. Barangay Zone Configuration	16](#c.-barangay-zone-configuration)

[**X. Business Requirements	17**](#x.-business-requirements)

[1\. User Management	17](#heading=)

[2\. Damage Assessment	17](#heading=)

[3\. Evacuation Log	18](#heading=)

[4\. Report Generation	19](#heading=)

[**XI. Database Design	20**](#xi.-database-design)

[Relational Schema	21](#relational-schema)

[User Management Module — Entity-Relationship Diagram	22](#user-management-module-—-entity-relationship-diagram)

[Damage Assessment Module — Entity-Relationship Diagram	22](#damage-assessment-module-—-entity-relationship-diagram)

[Evacuation Log Module — Entity-Relationship Diagram	23](#evacuation-log-module-—-entity-relationship-diagram)

[Data Dictionary (Using Yourdon’s Notation)	24](#data-dictionary-\(using-yourdon’s-notation\))

[**XII. User Persona	26**](#xii.-user-persona)

[C. Web Layout	28](#heading=h.meiapqr7yqjs)

# 

# **II. Purpose**   {#ii.-purpose}

Barangay San Francisco, Magarao, Camarines Sur conducts disaster response through entirely paper-based documentation. When a typhoon or flood event occurs, Kagawads are expected to physically survey damaged structures, record findings on paper forms, return those forms to the barangay hall, and wait for staff to manually compile them into a consolidated submission for the Local Government Unit (LGU) and the Municipal Disaster Risk Reduction and Management Office (MDRRMO). This process consistently produces three failure outcomes: delayed report submissions, records with missing or duplicate entries, and relief allocations that underestimate the barangay's actual needs because the LGU receives an incomplete picture.  
AgapaySF is a web-based system that replaces this workflow. The name is derived from the Filipino word agapay — companion — reflecting its purpose as an operational tool for barangay officials during active disaster events, not a back-office system. It targets two specific points of failure: (1) the field data collection process, by enabling Kagawads to submit structured damage assessment reports directly from a mobile browser; and (2) the report consolidation process, by giving the Barangay Captain a single interface from which to generate and export complete, official-format reports without any manual compilation. All access is restricted to verified barangay personnel through an administrator-controlled registration model, and all data handling is implemented in compliance with Republic Act 10173 (Data Privacy Act of 2012\)

# **III. Goal** {#iii.-goal}

The primary goal of AgapaySF is to reduce the time between a disaster event occurring and the barangay submitting a complete, accurate report to the LGU and MDRRMO — from hours or days to minutes. This is achieved through two mechanisms: a mobile-accessible multi-step data entry interface that allows field personnel to submit records in real time during a disaster, and an automated report generation module that consolidates all submitted records for a given event into a submission-ready document without manual assembly.  
A secondary goal is accountability. Every record created in the system is timestamped by the server and attributed to the specific user who filed it. This creates an auditable chain of custody for disaster data that does not exist in the current paper-based system.

# **IV. Objectives** {#iv.-objectives}

* **Replace paper-based damage assessment with mobile-accessible digital reporting**. Kagawads must be able to submit a complete, structured assessment report — including damage classification and photo evidence — from a mobile browser without returning to the barangay hall.  
* **Replace manual evacuation recordkeeping with a live-updated digital log**. Staff and Kagawads must be able to create and update evacuation entries, including vulnerable sector counts per family, in real time throughout the duration of a disaster event.  
* **Eliminate manual report consolidation for the Barangay Captain**. The Admin must be able to generate a consolidated Damage Assessment Summary or Evacuation Summary for any disaster event in a single action and export it as a PDF for official submission.  
* **Restrict system access to verified barangay personnel only.** All accounts require administrator approval before activation. No self-service access is provided. User roles are assigned by the Admin and enforce module-level permissions throughout the system.  
* **Implement data handling practices compliant with RA 10173 and support the reporting mandates of RA 10121**. Resident data is accessible only to authenticated and authorized users. Passwords are stored as bcrypt hashes. Sessions are managed server-side. The system provides the infrastructure required for the barangay to fulfill its obligations under the DRRM Act of 2010\.  
* 

# **V. Scope** {#v.-scope}

A clear definition of what is included and excluded in the current development phase to prevent scope creep and set accurate expectations.

1. ### **Inclusions (What the Project Will Deliver)** {#inclusions-(what-the-project-will-deliver)}

   

* **Damage Assessment Module:** A three-step guided form for Kagawads to record the disaster event, affected zone, structure identity, damage classification (Partially Damaged / Totally Damaged), and optional photo evidence. Each record is server-timestamped and user-attributed on submission.

* **Evacuation Log Module:** A two-step guided form for Kagawads and Staff to create and update evacuation records per resident per disaster event, including arrival/departure dates, status (Evacuated / Returned / Transferred), and counts for seven vulnerable sector categories (senior citizens, 4Ps beneficiaries, babies, infants, pregnant individuals, PWDs, and family size).

* **Report Generation Module:** Admin-only interface to generate a consolidated Damage Assessment Summary or Evacuation Summary for a selected disaster event, viewable as a formatted table and exportable to PDF or print.

* **User Management and Account Approval:** Closed-registration model where new accounts are created in PENDING status and require Admin review, role assignment (Admin / Kagawad / Staff), and explicit approval before activation.

* **Resident Directory:** A searchable pre-loaded directory of residents indexed by name. Used during both damage assessment (to identify structure owners) and evacuation logging (to retrieve or create resident records) to prevent duplicate entries.

* **Dashboard:** A role-appropriate landing screen displaying the active disaster event, aggregate counts of filed assessments and evacuated residents, a recent activity feed, and quick-action navigation to all accessible modules.


2. ### **Exclusions (What Is Not Included in This Phase)** {#exclusions-(what-is-not-included-in-this-phase)}

   

* **Financial damage estimation:** No monetary or peso values are collected, computed, or displayed at any point in the system.

* **Disaster prediction, weather monitoring, or early warning systems:** AgapaySF records the aftermath of disaster events; it does not anticipate them.

* **Integration with external government systems:** No connection to NDRRMC, PAGASA, PhilSys, PSA, or any other external database.

* **Notification systems:** No SMS, push notification, OTP, or email alerts of any kind.

* **Coverage beyond Barangay San Francisco:** The system is scoped exclusively to Barangay San Francisco, Magarao, Camarines Sur. Multi-barangay operation is not supported.

* **Relief goods inventory or beneficiary payout tracking:** The system records damage and evacuation data; distribution management is outside scope.

* **Real-time collaborative editing:** The system does not support concurrent editing of the same record by multiple users. Last-write-wins on record updates.

* **Native mobile applications:** The deliverable is a responsive web application. No iOS or Android native app development is included.




# **VI. Project Overview** {#vi.-project-overview}

AgapaySF is a web-based disaster assessment and reporting system specifically engineered for Barangay San Francisco, Magarao, Camarines Sur — a community that frequently experiences natural disasters such as typhoons and flooding. The system is built on React for the frontend, Node.js with Express for the backend, and PostgreSQL for the relational database.

At its core, AgapaySF replaces a fully manual, paper-based disaster reporting workflow with a centralized digital platform. The existing process requires barangay officials to physically gather data from multiple sources during an active disaster, verify it manually, and submit consolidated reports under significant time pressure — a workflow that consistently results in delayed submissions, incomplete records, and underestimated needs. AgapaySF directly addresses each of these failure points.

The system operates under a closed registration model. Access is restricted exclusively to verified barangay personnel, with all account approvals managed by the designated System Administrator (the Barangay Captain). This approach ensures that only authorized individuals can encode and manage sensitive disaster-related data, consistent with the system's compliance requirements under RA 10173 (Data Privacy Act of 2012).

The user interface is designed mobile-first, recognizing that the primary users — Kagawads — will be accessing the system from smartphones while conducting field assessments in active disaster conditions. Multi-step guided forms reduce cognitive load, and the Single-Page Application (SPA) architecture ensures fast navigation without full page reloads, which is critical in environments with unstable network connectivity

# **VII. Target Audience** {#vii.-target-audience}

The system serves a defined set of internal and indirect stakeholders within and connected to Barangay San Francisco, Magarao, Camarines Sur.

### **A. Primary Users (Direct System Interaction)** {#a.-primary-users-(direct-system-interaction)}

* **Barangay Captain (Admin role):** Primary administrator and decision-maker. Manages all user accounts, controls system access, and is the only role authorized to generate and export official consolidated reports. Accesses the system primarily from a desktop or tablet at the barangay hall during and after disaster events.

* **Barangay Kagawads (Kagawad role):** Primary field users. Conduct structure assessments in their assigned zones and encode damage reports directly into the system from mobile browsers. Also authorized to create and update evacuation log entries. Access is zone-restricted for report viewing.

* **Barangay Staff and Volunteers (Staff role):** Support users. Authorized to create and update evacuation log entries and view (but not export) reports. Cannot file damage assessments or manage user accounts.


### **B. Indirect Beneficiaries (No Direct System Access)** {#b.-indirect-beneficiaries-(no-direct-system-access)}

* **Affected Residents**: Residents of Barangay San Francisco whose damage and evacuation status are recorded in the system. Accurate and timely data entry directly impacts the speed and completeness of assistance they receive.  
* **Local Government Unit (LGU) / MDRRMO**: These offices receive the official disaster reports generated by AgapaySF. They rely on the system's output to allocate resources, relief goods, and emergency assistance, but do not access the system directly.

# **VIII. Functional & Non-Functional Requirements** {#viii.-functional-&-non-functional-requirements}

## **A. Functional Requirements** {#a.-functional-requirements}

*All requirements use the convention: FR-\[module abbreviation\]-\[sequence number\].*

## **Authentication and Access Control**

1. **FR-AUTH-01:** The system shall allow any visitor to submit a registration request by providing a full name, an 11-digit Philippine mobile number (contact\_number), and a password meeting the minimum complexity policy (≥ 8 characters; must contain at least one letter, one digit, and one special character from the set: \! @ \# $ %).

2. **FR-AUTH-02:** Upon registration submission, the system shall create the account with a status of PENDING and shall not grant the user access to any authenticated route until the Admin explicitly approves the account.

3. **FR-AUTH-03:** The Admin shall be able to view a list of all PENDING accounts, assign a role (Admin, Kagawad, or Staff) to each, and either approve or reject the account. Approved accounts transition to ACTIVE status; rejected accounts transition to INACTIVE and cannot be used to log in.

4. **FR-AUTH-04:** The system shall authenticate users by validating the provided contact\_number and password against stored credentials. Passwords shall be verified against their bcrypt hash. Plaintext passwords shall never be stored or logged.

5. **FR-AUTH-05:** The login screen shall display distinct, role-appropriate error messages for the following failure conditions: (a) credential mismatch — "Incorrect contact number or password. Please try again."; (b) PENDING account — "Your account is still pending approval. Please contact your barangay administrator."; (c) INACTIVE account — "Your account has been deactivated. Please contact your barangay administrator."

6. **FR-AUTH-06:** Upon successful authentication, the system shall establish a server-side session and redirect the user to a dashboard appropriate to their assigned role. All subsequent requests must present a valid session token; unauthenticated requests to protected routes shall be redirected to the login screen.

7. **FR-AUTH-07:** Role-based access control shall be enforced at the API level for every protected endpoint. The permissions matrix defined in the Modules section is authoritative. Attempting to access a forbidden resource shall return HTTP 403\.

## **Disaster Event Management**

8. **FR-EVT-01:** The Admin shall be able to create a disaster event record by providing: event\_name (required, max 100 characters), disaster\_type (required, enum: Flood | Typhoon | Fire | Earthquake | Landslide), and date\_started (required, date). date\_ended is optional and may be entered later.

9. **FR-EVT-02:** The system shall display the most recently created disaster event as the default active event across all module entry points (damage assessment form Step 1, evacuation log form Step 2, report generation dropdown). The Admin shall be able to designate a different event as active if needed.

## **Damage Assessment**

10. **FR-DA-01:** The system shall restrict access to the Damage Assessment submission form to users with the Kagawad or Admin role. Staff/Volunteer accounts shall not see or access this form.

11. **FR-DA-02:** The form shall be implemented as a three-step stepper. The user shall not be able to advance to the next step until all required fields in the current step are valid. A back navigation control shall allow returning to a prior step without losing entered data.

12. **FR-DA-03:** Step 1 shall require selection of: (a) an active disaster event from a dropdown of all recorded events, and (b) a barangay zone from a dropdown of all zones in BARANGAY\_ZONE. Both fields are required.

13. **FR-DA-04:** Step 2 shall provide a text search input allowing the user to search the STRUCTURE directory by structure address or resident owner name. Search results shall display the structure address, structure\_type, and owner name. The user must select an existing structure record to proceed. If the structure does not exist, the user shall be able to add a new structure by providing: owner (selected from RESIDENT directory by name search), and structure\_type (required, enum: Residential | Commercial | Agricultural | Industrial).

14. **FR-DA-05:** Step 3 shall require selection of a damage\_level (required, enum: Partial | Total), presented as two large labeled card UI elements (not a dropdown). Photo upload shall be optional. If provided, the system shall accept JPEG and PNG files only, with a maximum file size of 5MB enforced server-side by Multer before storage.

15. **FR-DA-06:** Before final submission, the system shall display a read-only summary screen showing all values entered across all three steps. The user shall confirm submission from this screen.

16. **FR-DA-07:** On confirmed submission, the system shall: (a) persist the ASSESSMENT\_REPORT record with a server-generated timestamp (not client-provided), (b) set the user\_id field to the session's authenticated user, (c) store the photo\_url if a file was uploaded, and (d) display a confirmation screen showing the submitted report's key details and offering navigation to "File Another Report" or "Return to Dashboard."

## **Evacuation Log**

17. **FR-EL-01:** The system shall allow users with Kagawad or Staff roles to create new evacuation log entries and update the status of existing entries.

18. **FR-EL-02:** The new entry form shall be implemented as a two-step stepper.

19. **FR-EL-03:** Step 1 shall provide a resident search input. If a matching resident is found in the RESIDENT directory, the user shall select the existing record (no re-entry required). If no match is found, the user shall manually enter: surname, first\_name, middle\_initial (optional), gender (M | F), birth\_date, contact\_number (optional), and family\_size. The user shall additionally enter counts for the following vulnerable sector fields: senior\_citizen\_count, fourPs\_member\_count, baby\_count, infant\_count, pregnant\_count, pwd\_count. All count fields default to 0 and must be non-negative integers. The sum of all vulnerable sector counts must not exceed family\_size (validation enforced before advancing).

20. **FR-EL-04:** Step 2 shall require: selection of the disaster event (required), entry of arrival\_date (required, must not be a future date), and confirmation of initial status \= Evacuated. departure\_date and status changes to Returned or Transferred shall only be available through the record update flow.

21. **FR-EL-05:** The Evacuation Log list screen shall display all log entries for the currently active disaster event, each showing: resident full name, zone, family size, arrival date, current status, and a color-coded status chip. Color mapping: Evacuated → Success Green (\#2E7D32); Returned → Primary Blue (\#1565C0); Transferred → Gray (\#9E9E9E).

22. **FR-EL-06:** The user shall be able to update an existing log entry by selecting it from the list and changing the status to Returned or Transferred and entering a departure\_date (required when status changes from Evacuated). departure\_date must not be earlier than arrival\_date.

## **Report Generation**

23. **FR-RG-01:** Report generation and export shall be restricted exclusively to users with the Admin role.

24. **FR-RG-02:** The Admin shall select a disaster event and a report type. Two report types are supported: Damage Assessment Summary and Evacuation Summary.

25. **FR-RG-03 — Damage Assessment Summary:** The system shall retrieve all ASSESSMENT\_REPORT records for the selected event, joined with STRUCTURE, RESIDENT (owner), BARANGAY\_ZONE, and USER (filing Kagawad). The report shall display, at minimum: structure address, structure\_type, damage\_level, filing Kagawad name, zone, and submission timestamp.

26. **FR-RG-04 — Evacuation Summary:** The system shall retrieve all EVACUATION\_LOG records for the selected event, joined with RESIDENT and BARANGAY\_ZONE. The report shall display, at minimum: resident full name, zone, family\_size, vulnerable sector counts, arrival\_date, departure\_date, and current status. Aggregate totals (total evacuees, total per vulnerable sector) shall be computed and displayed at the bottom of the report.

27. **FR-RG-05:** The generated report shall be exportable as a PDF via the browser's print dialog or a server-side PDF generation route. The export shall include: the barangay name, disaster event name and type, report generation date and time, and the name of the Admin who generated it.

## **B. Non-Functional Requirements** {#b.-non-functional-requirements}

## **Performance**

* **SPA navigation:** Client-side route transitions (between Dashboard, Damage Assessment, Evacuation Log, Reports, Admin Panel) shall complete without a network request for HTML. The React SPA loads once; all subsequent navigation is handled by the client router.

* **API response time:** Under normal single-user load in a local or shared-hosting environment, API responses for form submissions and standard list retrievals (e.g., evacuation log list for a given event) shall return within 2 seconds.

* **File upload:** Photo uploads are bounded at 5MB. Multer shall reject oversized files before they are written to disk, returning a 400 error with a descriptive message.

## **Mobile Responsiveness**

* **Layout:** All screens shall be usable on a viewport of 375px width (iPhone SE baseline) without horizontal scrolling or content overflow.

* **Touch targets:** All interactive elements (buttons, form fields, list items, stepper controls) shall have a minimum touch target height of 44px per Apple HIG / Google Material guidelines.

* **Bottom navigation:** On mobile viewports, the primary navigation shall be a fixed bottom bar. On desktop viewports, a sidebar navigation shall be used. This is handled via Shadcn responsive layout components.

## **Security**

* **Password storage:** All passwords shall be hashed using bcrypt with a minimum cost factor of 12\. No plaintext or reversibly-encrypted passwords shall be stored.

* **Session management:** User sessions shall be maintained server-side via Express-session. Session cookies shall be flagged HttpOnly and SameSite=Strict. Session expiry shall be enforced server-side.

* **API authorization:** Every protected API endpoint shall verify (a) that a valid session exists and (b) that the session's user role is permitted to perform the requested action. Authorization is enforced at the route middleware level, not only in the UI.

* **File upload validation:** Multer shall enforce: accepted MIME types (image/jpeg, image/png only), maximum file size (5MB), and server-side storage path. Client-provided MIME type headers shall not be trusted; file content shall be validated.

## **Data Integrity**

* **Schema normalization:** The PostgreSQL schema is normalized to 3NF. No transitive dependencies exist between non-key attributes. Referential integrity is enforced via foreign key constraints with appropriate ON DELETE policies.

* **Enum constraints:** All categorical fields (role, disaster\_type, structure\_type, damage\_level, status, gender) use PostgreSQL ENUM types. The application layer shall not accept values outside the defined enum sets.

* **Server-generated timestamps:** The timestamp field in ASSESSMENT\_REPORT is set by the database server (DEFAULT NOW()) on INSERT. The application layer does not accept a client-provided timestamp value for this field.

## **Legal and Regulatory Compliance**

* **RA 10173 (Data Privacy Act of 2012):** Resident personal data is accessible only to authenticated and role-authorized users. The Login screen shall display a brief privacy notice. The closed registration model prevents unauthorized access. Password hashing and session controls implement the technical security measures required under the Act.

* **RA 10121 (DRRM Act of 2010):** AgapaySF provides the technical infrastructure for Barangay San Francisco to fulfill its mandate under Section 12(b) of RA 10121, which requires barangay-level disaster risk information management and timely reporting to the LGU and MDRRMO.


# **IX. Modules** {#ix.-modules}

##  **1\. User Management Module** {#1.-user-management-module}

### **a. Account Registration** {#a.-account-registration}

* New user registration via a three-step form (Name/Contact Number → Password creation → Pending confirmation)  
* Account status defaults to PENDING upon submission

### **b. Account Approval** {#b.-account-approval}

* Admin reviews pending registration requests in the User Approval Panel  
* Admin assigns role (Admin, Kagawad, Staff/Volunteer) and approves or rejects the account  
* Approved accounts are activated; rejected accounts remain inactive

### **c. Login and Authentication** {#c.-login-and-authentication}

* Users authenticate using their registered Contact Number and password  
* System validates credentials and account status, displaying appropriate error messages for incorrect credentials or pending accounts  
* Successful authentication redirects the user to their role-appropriate dashboard

### **d. Role-Based Access Control** {#d.-role-based-access-control}

* Access to modules and actions is enforced based on the user's assigned role  
* See permissions matrix in Section VII (User Flow) for the complete access table

**User Management Module — User Flow**

The user flow for the User Management Module begins with a prospective user visiting the AgapaySF registration page and completing the three-step registration form (Name and Contact Number → Password creation → Pending confirmation screen). The account is created in a PENDING state. The Admin then reviews the pending request in the User Approval Panel, verifies the applicant's identity, assigns the appropriate role, and either approves or rejects the account. Upon approval, the user may log in using their Contact Number and password. If credentials are valid and the account is active, the system redirects the user to the role-appropriate dashboard.

 

## **2\. Damage Assessment Module** {#2.-damage-assessment-module}

**a. Assessment Submission**

* Step 1: Kagawad selects the active Disaster Event and the corresponding Barangay Zone from dropdowns  
* Step 2: Kagawad searches for the affected structure by address or owner name and selects the matching entry from results  
* Step 3: Kagawad selects the damage level (Partially Damaged or Totally Damaged) using large labeled cards and optionally attaches a photo from the device camera or gallery  
* A summary review screen is presented before final submission

### **b. Report Recording** {#b.-report-recording}

* Each submitted report is automatically timestamped (DateTime) and linked to the filing Kagawad's user ID  
* A confirmation screen is displayed upon successful submission, with options to file another report or return to the dashboard

### **c. Structure Management** {#c.-structure-management}

* If the affected structure is not found in the directory, the Kagawad may enter the structure details (address, owner reference, structure type) before proceeding  
* Structure types: Residential, Commercial, Agricultural, Industrial

 

**Damage Assessment Module — User Flow**

The Kagawad accesses the Damage Assessment Module by tapping "New Assessment" from the dashboard. The three-step stepper form guides the user through: event and zone selection (Step 1), structure search and selection (Step 2), and damage classification with optional photo upload (Step 3). After reviewing the summary screen, the Kagawad submits the report. The system saves the record with an automatic timestamp and the user's ID, and displays a confirmation screen.

## 

## **3\. Evacuation Log Module** {#3.-evacuation-log-module}

### **a. Evacuation Entry** {#a.-evacuation-entry}

* Step 1: User fills in the resident's information (Surname, First Name, Middle Initial, Gender, Contact Number, family size) or searches for an existing resident in the directory  
* Vulnerable sector counts are required: Senior Citizens, 4Ps Beneficiaries, Babies, Infants, Pregnant individuals, PWDs  
* Step 2: User selects the Disaster Event, enters the Arrival Date, and sets the initial status to Evacuated  
* The system saves the evacuation log record linked to the resident and the disaster event

### **b. Status Updates** {#b.-status-updates}

* When a resident's situation changes, the user locates the existing log entry and updates the Departure Date and status to Returned or Transferred

### **c. Evacuation Log Display** {#c.-evacuation-log-display}

* The Evacuation Log Screen displays a resident search bar, result cards showing name, zone, and family size, and a list of existing entries with color-coded status chips  
* Status colors: Evacuated (Green), Returned (Blue), Transferred (Gray)

**Evacuation Log Module — User Flow**

The Kagawad or Staff accesses the Evacuation Log from the dashboard. The two-step form prompts the user to enter or search for the resident's information including all vulnerable sector counts (Step 1), then select the disaster event, enter the arrival date, and confirm the initial Evacuated status (Step 2). The record is saved and appears in the log list with a color-coded status chip. When the resident's status changes, the user updates the existing entry with a departure date and the new status.

## **4\. Report Generation Module** {#4.-report-generation-module}

### **a. Report Selection** {#a.-report-selection}

* Admin selects the relevant Disaster Event from a dropdown  
* Admin chooses the report type: Damage Assessment Summary or Evacuation Summary

### **b. Report Display** {#b.-report-display}

* The system retrieves all relevant records for the selected event and presents them in a consolidated formatted table  
* The Admin reviews the data before proceeding to export

### **c. Export and Print** {#c.-export-and-print}

* The consolidated report can be exported as a PDF document  
* The report can be sent directly to the browser's print dialog for physical submission

 

**Report Generation Module — User Flow**

The Admin navigates to the Reports module via the sidebar. After selecting the relevant Disaster Event and the desired report type, the system retrieves and displays all associated records in a consolidated table. The Admin reviews the data and proceeds to export the report as PDF or prints it directly for official submission to the LGU or MDRRMO.

## **5\. Admin Panel Module** {#5.-admin-panel-module}

### **a. Dashboard** {#a.-dashboard}

* Active disaster event banner displayed prominently at the top  
* Summary cards showing totals for assessed structures and current evacuees  
*  Recent activity feed showing the latest submissions across all users  
* Quick-action buttons for New Assessment, Evacuation Log, and View Reports  
*  Bottom navigation bar on mobile devices

### **b. User Management** {#b.-user-management}

* User Approval Panel: list of pending registration requests displayed as cards showing full name, contact number, and requested role, with Approve and Reject action buttons  
* Admin can manage all existing user accounts including role updates and account deactivation

### **c. Barangay Zone Configuration** {#c.-barangay-zone-configuration}

* Admin can maintain the Barangay Zone directory and assign Kagawads to specific zones


**Admin Panel Module — User Flow**

The Admin accesses the Admin Panel via the sidebar. The Dashboard provides an immediate overview of all active operations. For user management, the Admin reviews pending registrations in the User Approval Panel, verifies each applicant, assigns the appropriate role, and approves or rejects the account. Configuration of barangay zones and kagawad assignments is also managed from this panel.

# **X. Business Requirements** {#x.-business-requirements}

## **1\. User Management**

**Business Rules**

1) All users must register using a valid Philippine mobile contact number (11-digit format).

2) No user may access any system function until their account has been explicitly approved by the Admin and an appropriate role has been assigned.

3) Passwords must meet complexity requirements (minimum 8 characters, including alphanumeric and special characters).

4) Only the Admin role may approve or reject registration requests, assign roles, or deactivate accounts.

   

**Business Activities**

1) User Registration:  
   1) The applicant visits the registration page and completes the three-step form, providing their Name, Contact Number, and a password.  
   2) The system creates the account with a PENDING status and displays a confirmation message informing the applicant to await administrator approval.  
2) Account Approval:  
   1) The Admin reviews the list of pending registrations in the User Approval Panel.  
   2) The Admin verifies the applicant is a legitimate Barangay San Francisco official or volunteer and assigns the appropriate role.  
   3) The Admin approves or rejects the account. Approved accounts are activated; rejected accounts remain inactive.  
3) User Login and Session:  
   1) The user enters their Contact Number and password on the login page.  
   2) The system validates credentials and account status. Appropriate error messages are displayed for incorrect credentials or pending accounts.  
   3) Upon successful authentication, the user is redirected to their role-appropriate dashboard and a session is established.

## **2\. Damage Assessment**

**Business Rules**

1) Only users with the Kagawad or Admin role may submit damage assessment reports.  
2) Every assessment report must be linked to an active Disaster Event.  
3) The damage level classification is limited to two values: Partially Damaged or Totally Damaged. No monetary valuation is collected.  
4) Every submitted assessment report is automatically attributed to the filing user and timestamped by the system. These values cannot be manually entered or modified by the user.  
5) Photo documentation is optional but recommended; a maximum file size and accepted file types must be enforced by the server-side Multer configuration.  
     
   

**Business Activities**

1) Assessment Initiation:   
   1) The Kagawad taps "New Assessment" from the dashboard.   
   2) The system presents Step 1 of the three-step stepper form.  
2) Event, Zone, and Structure Selection:   
   1) The Kagawad selects the active Disaster Event and the corresponding Barangay Zone.  
   2) The Kagawad searches for the affected structure by address or owner name and selects the correct entry. If the structure is not in the directory, the Kagawad enters the structure details before proceeding.  
3) Damage Classification and Submission:  
   1) The Kagawad selects the damage level using clearly labeled card UI elements and optionally uploads a photo.  
   2) A review summary screen is presented for confirmation.  
   3) Upon submission, the system records the report with a server-generated timestamp and the Kagawad's user ID, and displays a confirmation screen.

## **3\. Evacuation Log**

**Business Rules**

1) Kagawads and Staff may create and update evacuation log entries.  
2) Every evacuation log entry must be linked to a specific Disaster Event and a specific resident record.  
3) The initial status of all new evacuation log entries must be set to Evacuated. Departure dates may only be entered when changing the status to Returned or Transferred.  
4) If a resident already exists in the directory, the existing record must be used to prevent duplicate entries.  
5) Vulnerable sector counts (senior citizens, 4Ps beneficiaries, babies, infants, pregnant individuals, and PWDs) must be recorded for each evacuating family.  
   

**Business Activities**

1) New Evacuation Entry:  
   1) The user taps "Log Evacuation" from the dashboard.  
   2) The user either searches for the existing resident in the directory or fills in the resident's personal and demographic information in Step 1 of the two-step form.  
   3) The user selects the Disaster Event, enters the Arrival Date, and confirms the Evacuated status in Step 2\.  
   4) The system saves the record linked to the resident and the event.  
2) Evacuation Status Update:  
   1) When a resident's situation changes, the user locates the relevant log entry.  
   2) The user updates the Departure Date and changes the status to Returned or Transferred as appropriate.  
   3) The system saves the updated record.

## **4\. Report Generation**

**Business Rules**

1) Only the Admin role may generate and export official reports.  
2) Reports must be generated per Disaster Event. Cross-event consolidated reports are not required in this phase.  
3) Two report types are supported: Damage Assessment Summary and Evacuation Summary. The system retrieves all relevant records for the selected event and type automatically.

**Business Activities**

1) Report Generation:  
   1) The Admin navigates to the Reports module via the sidebar.  
   2) The Admin selects the relevant Disaster Event and the desired report type.  
   3) The system retrieves all associated records from the database and presents them in a consolidated formatted table.  
   4) The Admin reviews the data for completeness and accuracy.  
2) Report Export:  
   1) The Admin selects the export option. The system generates a PDF version of the report or opens the browser's print dialog.  
   2) The printed or exported report is submitted to the LGU or MDRRMO.

# 

# 

# 

# 

# 

# **XI. Database Design** {#xi.-database-design}

[Entity Relationship Diagram](https://drive.google.com/file/d/1D9AS1ecA1vKvKEMuSPx0CGLSlvgAfoKR/view?usp=sharing) 

## 

## **Relational Schema** {#relational-schema}

USER(**user\_id**, name, role(Kagawad, Staff, Admin), contact\_number, password)

DISASTER\_EVENT(**event\_id**, event\_name, date\_started, date\_ended, disaster\_type(Flood, Typhoon, Fire, Earthquake, Landslide))

BARANGAY\_ZONE(**zone\_id**, zone\_name, assigned\_kagawad)

RESIDENT(**resident\_id**, surname, first\_name, middle\_initial, gender(Male, Female), birth\_date, contact\_number, family\_size, senior\_citizen\_count, fourPs\_member\_count, baby\_count, infant\_count, pregnant\_count, pwd\_count, zone\_id)

STRUCTURE(**structure\_id**, owner\_id, structure\_type(Residential, Commercial, Agricultural, Industrial))

ASSESSMENT\_REPORT(report\_id, user\_id, event\_id, structure\_id, damageLevel(Partial, Total),  photo\_url, timestamp)

EVACUATION\_LOG(**log\_id**, resident\_id, event\_id, arrival\_date, departure\_date, status(Evacuated, Returned, Transferred))

### 

### 

### 

### 

### 

### 

### 

### 

### **User Management Module — Entity-Relationship Diagram** {#user-management-module-—-entity-relationship-diagram}

* The User Management ERD models three core entities.   
* The USER entity captures the user\_id (PK), name, role (enum: Kagawad, Staff, Admin), contact\_number, and password (hashed).   
* The BARANGAY\_ZONE entity captures zone\_id (PK), zone\_name, and assigned\_kagawad (FK to USER.user\_id), establishing a many-to-one relationship between zones and the Kagawad assigned to manage them.   
* The RESIDENT entity captures resident\_id (PK) and all demographic attributes, linked to BARANGAY\_ZONE via zone\_id (FK). This structure enforces that each resident belongs to exactly one zone, and each zone has one assigned Kagawad.

### **Damage Assessment Module — Entity-Relationship Diagram** {#damage-assessment-module-—-entity-relationship-diagram}

* The Damage Assessment ERD models the relationships between USER, DISASTER\_EVENT, STRUCTURE, and ASSESSMENT\_REPORT.   
* The ASSESSMENT\_REPORT entity is the central junction, holding report\_id (PK), user\_id (FK to USER), event\_id (FK to DISASTER\_EVENT), structure\_id (FK to STRUCTURE), damage\_level (enum: Partial, Total), photo\_url (nullable), and timestamp.  
* A single USER may file many ASSESSMENT\_REPORTs.   
* A single DISASTER\_EVENT may have many ASSESSMENT\_REPORTs.   
* A single STRUCTURE may appear in multiple ASSESSMENT\_REPORTs across different events.

### **Evacuation Log Module — Entity-Relationship Diagram** {#evacuation-log-module-—-entity-relationship-diagram}

* The Evacuation Log ERD models the EVACUATION\_LOG entity as a junction between RESIDENT and DISASTER\_EVENT.   
* EVACUATION\_LOG holds log\_id (PK), resident\_id (FK to RESIDENT), event\_id (FK to DISASTER\_EVENT), arrival\_date, departure\_date (nullable), and status (enum: Evacuated, Returned, Transferred).   
* A RESIDENT may have multiple log entries across different DISASTER\_EVENTs. Each log entry is uniquely identified by the combination of resident and event.

## **Data Dictionary (Using Yourdon’s Notation)** {#data-dictionary-(using-yourdon’s-notation)}

**Database Structure**  
AgapaySF\_Database \= user \+ disaster\_event \+ barangay\_zone \+ resident \+ structure \+ assessment\_report \+ evacuation\_log

1. **user**   
   user \= @user\_id \+ name \+ role \+ contact\_number \+ password  
     
   user\_id \= \* System Assigned \* \+ 1{0-9}10  
   name \= 1{a-z | A-Z | \- | ' | . | | }100  
   role \= \[ Kagawad | Staff | Admin \]  
   contact\_number \= \* Numeric \* \+ 11{0-9}11  
   password \= \* Encrypted String \* \+ 8{a-z | A-Z | 0-9 | \! | @ | \# | $ | %}50

2. **disaster\_event** 

disaster\_event \= @event\_id \+ event\_name \+ date\_started \+ disaster\_type

event\_id \= \* System Assigned \* \+ 1{0-9}10  
event\_name \= 1{a-z | A-Z | 0-9 | \- | }100  
date\_started \= \* Date \*  
date\_ended \= \* Date\*  
disaster\_type \= \[ Flood | Typhoon | Fire | Earthquake | Landslide \]

3. **barangay\_zone**  
   barangay\_zone \= @zone\_id \+ zone\_name \+ assigned\_kagawad  
     
   zone\_id \= \* System Assigned \* \+ 1{0-9}10  
   zone\_name \= 1{a-z | A-Z | 0-9 | \- | }30  
   assigned\_kagawad \= \* FK user\_id \*

4. **RESIDENT**  
   resident \= @resident\_id \+ surname \+ first\_name \+ middle\_initial \+ gender \+ birth\_date \+ contact\_number \+ family\_size \+ senior\_citizen\_count \+ fourPs\_member\_count \+ baby\_count \+ infant\_count \+ pregnant\_count \+ pwd\_count \+ zone\_id

   resident\_id \= \*System Assigned\* \+ 1{0-9}10

   surname \= 1{a-z | A-Z | \- | ' }30

   first\_name \= 1{a-z | A-Z | \- | ' }30

   middle\_initial \= ({a-z | A-Z}1)

   gender \= \[ M | F \]

   birth\_date  \= \*Date\*

   contact\_number \= (11{0-9}) OR NULL

   family\_size \= 1{0-9}3

   senior\_citizen\_count  \= 0{0-9}2

   fourPs\_member\_count  \= 0{0-9}2

   baby\_count \= 0{0-9}2

   infant\_count \= 0{0-9}2

   pregnant\_count \= 0{0-9}2

   pwd\_count \= 0{0-9}2

   zone\_id \= \*FK zone\_id\*

5. **structure**   
   structure \= @structure\_id \+ address \+ owner\_name \+ structure\_type  
     
   structure\_id \= \* System Assigned \* \+ 1{0-9}10  
   address \= 1{a-z | A-Z | 0-9 | , | . | \# | \- | }150  
   owner\_id \= \*FK resident\_id\*   
   structure\_type \= \[ Residential | Commercial | Agricultural | Industrial \]  
     
6. **assessment\_report**  
   assessment\_report \= @report\_id \+ user\_id \+ event\_id \+  
   structure\_id \+ damage\_level \+ photo\_url \+ timestamp  
     
   report\_id \= \* System Assigned \* \+ 1{0-9}10  
   user\_id \= \* FK user\_id \*  
   event\_id \= \* FK user\_id \*  
   structure\_id \= \* FK structure\_id \*  
   damage\_level \= \[ Partial | Total \]  
   photo\_url \= 1{a-z | A-Z | 0-9 | / | : | . | \_ | \- | }255  
   timestamp \= \* DateTime \*  
7. **evacuation\_log**  
   evacuation\_log \= @log\_id \+ resident\_id \+ event\_id \+ arrival\_date \+ (departure\_date) \+ status  
     
   Log\_id \= \* System Assigned \* \+ 1{0-9}10  
   resident\_id \= \* FK resident\_id \*  
   event\_id \= \* FK event\_id \*  
   arrival\_date \= \* Date \*  
   departure\_date \= ( \* Date \* )  
   status \= \[ Evacuated | Returned | Transferred \]

# **XII. User Persona** {#xii.-user-persona}

The primary user persona for AgapaySF is a barangay official of Barangay San Francisco, Magarao, Camarines Sur. This individual is civic-minded and duty-driven, but not necessarily experienced with digital tools. During a disaster, they are operating under significant time pressure and stress, often in the field and using a smartphone. Their priority is not learning a system — it is completing a task that directly affects the welfare of their neighbors. Any friction in the interface translates directly to delayed reports and delayed relief. Reliability, speed, and clarity are the defining requirements of this persona.

	  
**Sample Persona 1**

**Sample Persona 2**

# **XIII. User Flow and Journey Map**

## **A. User Flow**

AgapaySF’s user flows map the exact paths our barangay officials take to complete critical tasks. Because field assessors (Kagawads) and command center staff (Admins) face different challenges and require different access levels, these sequences are strictly segmented by user role and core module to ensure secure, efficient data entry.

### **Registration and Login Flow**

1. Applicant visits the registration page and completes the three-step form.  
2. System creates account with PENDING status and displays awaiting-approval message.  
3. Admin reviews pending request, assigns role, and approves or rejects.  
4. If approved: account is activated. If rejected: account remains inactive.  
5. Approved user visits login page, enters Contact Number and password.  
6. System validates credentials and status, then redirects to role-appropriate dashboard.

### 

### 

### 

### **Damage Assessment Flow (Kagawad)**

1. Kagawad taps "New Assessment" from the dashboard.

2. \[Step 1 of 3\] Selects active Disaster Event and Zone.

3. \[Step 2 of 3\] Searches for and selects the affected structure.

4. \[Step 3 of 3\] Selects damage level and optionally attaches photo.

5. Reviews summary screen and confirms submission.

6. System saves record with timestamp and user ID; confirmation screen displayed.

### **Evacuation Log Flow (Kagawad / Staff)**

1. User taps "Log Evacuation" from the dashboard.

2. \[Step 1 of 2\] Searches for resident or enters resident information and vulnerable sector counts.

3. \[Step 2 of 2\] Selects Disaster Event, enters Arrival Date, confirms Evacuated status.

4. System saves the evacuation log record linked to the resident and event.

5. \[Update\] When status changes: user locates existing entry, enters Departure Date, updates status to Returned or Transferred.

   

### **Report Generation Flow (Admin)**

1. Admin navigates to Reports module via sidebar.

2. Selects the relevant Disaster Event.

3. Chooses report type: Damage Assessment Summary or Evacuation Summary.

4. System retrieves all records and presents consolidated table.

## **B. Journey Map**

To ensure the system holds up under pressure, the following journey maps chart the user's experience through the lens of an active disaster. They document the physical and emotional realities of barangay personnel at each touchpoint, revealing critical pain points and opportunities to streamline the interface.

# **SITEMAP**

AgapaySF is a Single Page Application. All routes below are client-side routes managed by the React router. The server exposes a corresponding REST API under /api/. Navigation is instant between screens — no full-page reloads.

## **Public Routes (Unauthenticated)**

* /login — Login form (contact\_number \+ password). Links to /register.

  * /register — Three-step registration stepper. No session required.

    * Step 1: Name \+ Contact Number

    * Step 2: Password \+ Confirmation

    * Step 3: Pending confirmation screen

## **Authenticated Routes — All Roles**

* /dashboard — Role-appropriate dashboard: active event banner, summary cards, activity feed, quick-action buttons.

  * /evacuation — Evacuation Log module.

    * /evacuation/new — Two-step new entry form (Step 1: Resident; Step 2: Event \+ Status).

    * /evacuation/:log\_id/edit — Status update form for an existing log entry.

## **Authenticated Routes — Kagawad and Admin**

* /assessment/new — Three-step Damage Assessment form (Step 1: Event \+ Zone; Step 2: Structure; Step 3: Damage \+ Photo).

## **Authenticated Routes — Admin, Kagawad (zone-filtered), Staff (view only)**

* /reports — Report selection screen (event dropdown \+ report type selector).

  * /reports/damage — Damage Assessment Summary table for selected event.

  * /reports/evacuation — Evacuation Summary table for selected event.

## **Authenticated Routes — Admin Only**

* /admin/users/pending — User Approval Panel (pending account cards with role selector, Approve/Reject).

  * /admin/users — Full user list with status management.

  * /admin/zones — Barangay Zone list; add zone; assign Kagawad.

  * /admin/events — Disaster Event list; create event; close event.

## **API Routes (Server, /api/)**

* POST /api/auth/login — Authenticate user, establish session.

* POST /api/auth/logout — Destroy session.

* POST /api/users/register — Create PENDING user account.

* GET /api/users/pending — List PENDING accounts. (Admin)

* PATCH /api/users/:id/approve — Set ACTIVE \+ assign role. (Admin)

* PATCH /api/users/:id/reject — Set INACTIVE. (Admin)

* GET /api/events — List all disaster events.

* POST /api/events — Create disaster event. (Admin)

* GET /api/zones — List all barangay zones.

* GET /api/residents?q= — Search residents by name.

* GET /api/structures?q= — Search structures by address or owner name.

* POST /api/structures — Create new structure record. (Kagawad, Admin)

* POST /api/assessments — Submit damage assessment report. Multipart. (Kagawad, Admin)

* GET /api/assessments?event\_id= — List assessments for event. (Role-filtered)

* GET /api/evacuation?event\_id= — List evacuation logs for event. (Role-filtered)

* POST /api/evacuation — Create evacuation log entry. (Kagawad, Staff, Admin)

* PATCH /api/evacuation/:id — Update status and departure\_date. (Kagawad, Staff, Admin)

* GET /api/reports/damage?event\_id= — Retrieve consolidated damage report data. (Admin)

* GET /api/reports/evacuation?event\_id= — Retrieve consolidated evacuation report data. (Admin)

# **STYLEGUIDE**

The AgapaySF design system prioritizes functional clarity over aesthetic decoration. The interface will be used under field conditions — by users who may be standing in rain, under time pressure, on a mobile screen in variable lighting. Every design decision is evaluated against that context.

## **Color Palette**

Colors serve functional roles, not decorative ones. Blue establishes authority and consistency with official barangay operations. Amber and orange encode damage severity without requiring users to read labels. Green encodes safety and resolution in the evacuation context.

| Color Name | Hex | Token | Functional Role |
| ----- | ----- | ----- | ----- |
| Primary Blue | \#1565C0 | \--color-primary | Primary buttons, navigation elements, active states, header backgrounds. |
| Dark Blue | \#0D47A1 | \--color-primary-dark | Section headers, emphasis elements, focused input borders. |
| Light Blue | \#E3F2FD | \--color-primary-light | Card backgrounds for informational panels, dashboard summary cards. |
| Alert Orange | \#E65100 | \--color-damage-total | Totally Damaged status indicator. High-urgency visual signal. |
| Warning Amber | \#F9A825 | \--color-damage-partial | Partially Damaged status indicator. Medium-urgency visual signal. |
| Success Green | \#2E7D32 | \--color-status-evacuated | Evacuated and Returned status chips in the Evacuation Log. |
| White | \#FFFFFF | \--color-surface | Card surfaces, form field backgrounds, modal backgrounds. |
| Gray | \#F5F5F5 | \--color-background | Application page background, alternating table rows. |
| Text Dark | \#212121 | \--color-text-primary | All primary body text, form labels, table content. |

## **Typography**

## **UI Components (Shadcn/ui)**

* **Buttons:** Primary actions — solid Primary Blue (\#1565C0), white text, full-width on mobile. Destructive actions (Reject account) — Alert Orange (\#E65100). Secondary actions (Back, Cancel) — ghost variant with dark text. Minimum height: 44px.

* **Damage Level Cards:** Full-width tappable cards replacing a radio input. "Partially Damaged" card: Warning Amber (\#F9A825) left border (4px), amber icon. "Totally Damaged" card: Alert Orange (\#E65100) left border (4px), orange icon. Selected state: filled background at 10% opacity of the respective color. Non-selected state: white background with gray border. Cards must be distinguishable without relying on color alone (label and icon).

* **Status Chips:** Inline pills with colored background. Evacuated: Success Green (\#2E7D32) background, white text. Returned: Primary Blue (\#1565C0) background, white text. Transferred: Gray (\#9E9E9E) background, dark text.

* **Stepper Component:** Horizontal step indicator at the top of multi-step forms showing current step, completed steps (checkmark), and remaining steps (numbered, grayed). On mobile: a simplified linear indicator with step count (e.g., "Step 2 of 3"). Each step's form content is shown below the indicator. Back and Next buttons at the bottom of the screen.

* **Search Input with Results:** A text input field with a results list rendered below. Each result item is a tappable card. Minimum card height: 56px. Selected result highlighted in Light Blue (\#E3F2FD).

* **Form Fields:** White (\#FFFFFF) background, 1px \#CCCCCC border, dark text. Focus state: Primary Blue border (\#1565C0), 2px. Error state: Alert Orange border, error message below field in Alert Orange text. Labels above fields, not as placeholder text.

* **Navigation:** Mobile: fixed bottom nav bar with icon \+ label for Dashboard, Evacuation Log, Assessment (Kagawad/Admin only), Reports, and Admin (Admin only). Desktop: left sidebar with same items as text links.

## **Layout**

* **Mobile-first:** All screens designed at 375px base width and tested up to 428px. Desktop layout adapts via CSS breakpoints (≥ 768px: sidebar appears, content area expands).

* **Card-based:** Dashboard summary cards, log entry cards, and search result cards use a consistent card component: white background, Light Blue (\#E3F2FD) header band, 1px \#CCCCCC border, 8px border radius, 16px padding.

* **Spacing:** Base spacing unit: 8px. All margins and padding are multiples of 8px. Form field vertical spacing: 24px between fields.

# **WIREFRAMES**

Full high-fidelity interactive prototype:

https://www.figma.com/design/v1nJ0JSoriHEzP8fWL3DRg/AgapaySF\_UserInterface?node-id=0-1\&t=zno2BTC2H3yi2p8O-1

Key screen specifications are described below.

## **Login Screen (/login)**

* Single-column, vertically centered layout.

* "AgapaySF" wordmark in Primary Blue at the top.

* Contact Number input (type="tel", inputmode="numeric", maxlength="11").

* Password input (type="password") with show/hide toggle.

* "Log In" button: full-width, Primary Blue, 48px height.

* "Request Access" text link below the button → /register.

* Privacy notice at screen bottom: "This system handles personal information in accordance with Republic Act 10173." — 12px, gray, centered.

## **Registration Screen — 3-Step Stepper (/register)**

* Step indicator at top: three numbered circles connected by a progress line.

* Step 1: "Full Name" input (type="text") \+ "Contact Number" input (type="tel"). Validation feedback inline.

* Step 2: "Password" input (type="password") \+ "Confirm Password" input. Password strength indicator below password field.

* Step 3: Static confirmation card — "Your registration request has been submitted. Please wait for your administrator to approve your account before logging in." — with a home icon and a link back to /login.

## **Dashboard (/dashboard)**

* Active event banner: full-width card in Dark Blue (\#0D47A1), white text. Shows event name, disaster type, and date started. Displayed only when an active event exists.

* Summary cards row: two cards side by side — "Assessments Filed" (count) and "Currently Evacuated" (count) — for the active event.

* Quick-action buttons: "New Assessment" (Kagawad/Admin only), "Evacuation Log," "Reports" — arranged as large tappable tiles with icons.

* Recent Activity feed: chronological list of the 10 most recent submissions across all modules, showing: action type, filing user name, timestamp.

* Bottom navigation bar (mobile): Dashboard | Evacuation | Assessment | Reports | Admin.

## **Damage Assessment Form — 3-Step Stepper (/assessment/new)**

* Step indicator: 3 steps with labels ("Event & Zone," "Structure," "Classification").

* Step 1: Event dropdown (all events, most recent pre-selected). Zone dropdown (all zones). Both required.

* Step 2: Search input with placeholder "Search by address or owner name." Results list below. Each result card: address (bold), structure\_type (small text), owner name (small text). "Structure not found? Add new" link opens an inline expansion with owner search and structure\_type selector.

* Step 3: Two full-width damage level cards (Partial / Total as specified in Styleguide). File upload button: "Add Photo (Optional)" — opens device camera/gallery picker. Thumbnail preview shown if photo selected.

* Review Screen (before submit): read-only summary table of all entered values. "Edit" link per section. "Confirm and Submit" button.

* Confirmation Screen: success icon, submitted record summary, "File Another Report" and "Return to Dashboard" buttons.

## **Evacuation Log Screen (/evacuation)**

* Search bar at top: "Search residents" — live-filters the displayed log entries.

* "New Entry" button: Primary Blue, top-right, sticky on mobile.

* Log entries list: each entry as a card with — resident full name (bold), zone (small text), family size, arrival date, status chip. Tap to open update view.

* Empty state (no entries for active event): illustration and "No entries yet. Tap New Entry to log the first evacuation."

## **Admin — User Approval Panel (/admin/users/pending)**

* Page title: "Pending Registrations" with a count badge.

* Each pending account as a card: full name (bold), contact number, "Requested \[relative time ago\]."

* Within each card: role selector dropdown (Kagawad | Staff | Admin) \+ "Approve" button (Primary Blue) \+ "Reject" button (outlined Alert Orange).

* After action: card removed from list with a brief success/rejection toast notification.

* Empty state: "No pending registrations."

