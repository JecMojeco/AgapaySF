import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Link } from "react-router-dom";

export function Navbar({ onLogout, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-container-padding max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="flex md:hidden -ml-2 hover:bg-muted" onClick={onToggleSidebar}>
            <Menu className="h-5 w-5 text-on-surface-variant" />
          </Button>
          <Link to="/dashboard" className="transition-opacity hover:opacity-80">
            <Logo className="h-14 ml-1" />
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <span className="hidden md:inline text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mr-4">Institutional Portal</span>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-on-surface-variant hover:text-primary">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
