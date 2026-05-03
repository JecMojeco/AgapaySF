import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";

export function Navbar({ onLogout, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-bold text-primary">AgapaySF</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
