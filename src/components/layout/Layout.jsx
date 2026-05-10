import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans">
      <Navbar onLogout={handleLogout} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 justify-center overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="w-full flex-1 overflow-y-auto px-container-padding py-section-padding pb-24 md:pb-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
