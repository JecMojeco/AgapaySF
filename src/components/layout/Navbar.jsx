import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Link } from "react-router-dom";

export function Navbar({ onLogout, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between w-full">
        {/* Branding Zone - Aligns with Sidebar on Desktop */}
        <div className="flex items-center gap-2 px-4 md:w-64 md:border-r md:border-outline-variant/30 h-full">
          <Button variant="ghost" size="icon" className="flex md:hidden -ml-2 hover:bg-muted" onClick={onToggleSidebar}>
            <Menu className="h-5 w-5 text-on-surface-variant" />
          </Button>
          <Link to="/dashboard" className="transition-opacity hover:opacity-80 flex items-center">
            <Logo className="h-10 sm:h-12 w-auto" />
          </Link>
        </div>

        {/* Portal Info & Actions */}
        <div className="flex-1 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">Institutional Portal</span>
            <div className="h-4 w-px bg-outline-variant/30 mx-1" />
            <span className="text-[10px] text-primary font-bold uppercase tracking-tighter bg-primary/5 px-2 py-0.5 rounded">Barangay San Francisco</span>
          </div>
          
          <div className="flex items-center gap-1 ml-auto">
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-on-surface-variant hover:text-primary h-9 w-9 p-0">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
