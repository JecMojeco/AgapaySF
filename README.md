# AgapaySF: Barangay San Francisco Disaster Assessment and Reporting System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

AgapaySF is a web-based operational tool designed for Barangay San Francisco, Magarao, Camarines Sur, to streamline disaster response and reporting. It replaces traditional paper-based documentation with a real-time digital system for field-level damage assessments and evacuation logging, ensuring faster, data-driven assistance for residents.

---

## 1. Title and Description

**Project Name:** AgapaySF: Barangay San Francisco Disaster Assessment and Reporting System

**The "What" and "Why":**
AgapaySF addresses the critical delays and inaccuracies in manual disaster reporting. By providing Kagawads with a mobile-first interface for field data collection and the Barangay Captain with automated report consolidation, the system reduces reporting time from days to minutes, facilitating faster relief allocation from LGUs and MDRRMOs.

---

## 2. Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: v14.x or higher
- **Git**

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/AgapaySF.git
   cd AgapaySF
   ```

2. **Install Frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend dependencies:**
   ```bash
   cd server
   npm install
   ```

### Configuration
1. **Database Setup:**
   - Create a PostgreSQL database.
   - Run the schema script located at `server/schema.sql` or use `init_db.sql`.

2. **Environment Variables:**
   - Create a `.env` file in the `server/` directory.
   - Add the following variables:
     ```env
     DB_USER=your_postgres_user
     DB_PASSWORD=your_postgres_password
     DB_HOST=localhost
     DB_PORT=5432
     DB_DATABASE=agapaysf
     SESSION_SECRET=your_secret_key
     PORT=5000
     ```

---

## 3. Usage

### Quick Start
To run the system locally for development:

1. **Start the Backend Server:**
   ```bash
   cd server
   node server.js
   ```
   *Optional: Use `npx nodemon server.js` for auto-restarts.*

2. **Start the Frontend Application:**
   ```bash
   # In a new terminal from the root directory
   npm run dev
   ```

3. **Access the application:**
   - Frontend: `http://localhost:5173`
   - API: `http://localhost:5000/api`

### Examples
- **Authentication:** Use the `/register` page to request access. Admin approval is required.
- **Reporting:** Authorized Kagawads can navigate to "New Assessment" to file damage reports directly from their mobile devices.

---

## 4. Support and Contributing

### How to Get Help
If you encounter any issues or have questions:
- Open a new issue on the [GitHub Issues](https://github.com/your-repo/AgapaySF/issues) page.
- Contact the project maintainers directly.

### Contribution Guide
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

---

## 5. Project Information

### Authors/Maintainers
- **Bautista, John Paulo**
- **Mojeco, Jec Dainel**
- **Sacayan, Maddox Dimitri**

### License
This project is private and intended for the exclusive use of **Barangay San Francisco, Magarao, Camarines Sur**.

### Acknowledgments
- Inspired by the operational needs of Barangay San Francisco.
- Built using [Shadcn UI](https://ui.shadcn.com/) and [Lucide React](https://lucide.dev/).
- Compliant with **RA 10173 (Data Privacy Act of 2012)** and **RA 10121 (DRRM Act of 2010)**.
