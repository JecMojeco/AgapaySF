import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { EventsPage } from "./pages/EventsPage";
import { ZonesPage } from "./pages/ZonesPage";
import { Layout } from "./components/layout/Layout";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard/*"
            element={
              <Layout>
                <Routes>
                  <Route index element={<DashboardPage />} />
                  <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                    <Route path="users" element={<UserManagementPage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="zones" element={<ZonesPage />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            }
          />
        </Route>

        {/* Root Redirect */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
