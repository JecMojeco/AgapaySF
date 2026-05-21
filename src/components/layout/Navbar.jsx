import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, AlertCircle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export function Navbar({ onLogout, onToggleSidebar }) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsLogoutDialogOpen(true)} 
              className="text-on-surface-variant hover:text-destructive h-9 w-9 p-0"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6" />
            </div>
            <DialogTitle>Confirm Sign Out</DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to log out of your account? You will need to sign in again to access the portal.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:flex-col gap-2 mt-4">
            <Button 
              variant="destructive" 
              onClick={onLogout}
              className="w-full h-11 text-sm font-bold"
            >
              Sign Out
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsLogoutDialogOpen(false)}
              className="w-full h-11 text-xs text-muted-foreground"
            >
              Stay Logged In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
