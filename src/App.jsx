import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { EventsPage } from "./pages/EventsPage";
import { ZonesPage } from "./pages/ZonesPage";
import { ResidentsPage } from "./pages/ResidentsPage";
import { StructuresPage } from "./pages/StructuresPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import AssessmentHistoryPage from "./pages/AssessmentHistoryPage";
import { EvacuationLogPage } from "./pages/EvacuationLogPage";
import { ReportsPage } from "./pages/ReportsPage";
import { Layout } from "./components/layout/Layout";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Admin Only */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin/users/pending" element={<UserManagementPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/events" element={<EventsPage />} />
              <Route path="/admin/zones" element={<ZonesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>

            {/* Admin, Kagawad, Staff */}
            <Route element={<ProtectedRoute allowedRoles={['Admin', 'Kagawad', 'Staff']} />}>
              <Route path="/residents" element={<ResidentsPage />} />
              <Route path="/structures" element={<StructuresPage />} />
              <Route path="/assessments" element={<AssessmentHistoryPage />} />
              <Route path="/assessment/new" element={<AssessmentPage />} />
              <Route path="/evacuation" element={<EvacuationLogPage />} />
              <Route path="/evacuation/new" element={<EvacuationLogPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
