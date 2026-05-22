import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useNavigate, Outlet } from "react-router-dom";

export function Layout() {
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
    <div className="relative flex h-screen flex-col overflow-hidden bg-background font-sans">
      <Navbar onLogout={handleLogout} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto px-[var(--container-padding)] py-[var(--section-gap)] pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
