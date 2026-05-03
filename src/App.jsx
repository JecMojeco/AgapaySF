import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { Layout } from "./components/layout/Layout";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("auth")
  );
  const { toast } = useToast();

  const handleLogin = () => {
    localStorage.setItem("auth", "true");
    setIsAuthenticated(true);
    toast({
      title: "Login Successful",
      description: "Welcome back to AgapaySF.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
  };

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
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Routes */}
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <Routes>
                  <Route index element={<DashboardPage />} />
                  <Route path="users" element={<UserManagementPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

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
