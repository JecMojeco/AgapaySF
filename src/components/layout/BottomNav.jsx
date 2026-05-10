import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, ClipboardList, Contact, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const items = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Residents", href: "/dashboard/residents", icon: Contact },
  { title: "Buildings", href: "/dashboard/structures", icon: Building },
  { title: "Assess", href: "/dashboard/assessments", icon: FileText },
  { title: "Evacuate", href: "/dashboard/evacuations", icon: ClipboardList },
];

export function BottomNav() {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant/30 bg-white/95 backdrop-blur md:hidden">
      <div className="flex h-16 items-center justify-around max-w-md mx-auto w-full px-2">
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                isActive ? "text-primary" : "text-on-surface-variant/70"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} 
                />
                <span className={cn(
                  "text-[10px] font-bold tracking-wider uppercase",
                  isActive ? "text-primary" : "text-on-surface-variant/60"
                )}>
                  {item.title}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
