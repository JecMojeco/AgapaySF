import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function Layout({ children, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar onLogout={onLogout} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
