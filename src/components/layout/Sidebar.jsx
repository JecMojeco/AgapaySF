import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ClipboardList, 
  Calendar, 
  Map as MapIcon, 
  Contact, 
  Building, 
  BarChart3 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const items = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Residents", href: "/dashboard/residents", icon: Contact },
  { title: "Structures", href: "/dashboard/structures", icon: Building },
  { title: "Users", href: "/dashboard/users", icon: Users, roles: ['Admin'] },
  { title: "Events", href: "/dashboard/events", icon: Calendar, roles: ['Admin'] },
  { title: "Zones", href: "/dashboard/zones", icon: MapIcon, roles: ['Admin'] },
  { title: "Reports", href: "/dashboard/reports", icon: BarChart3, roles: ['Admin'] },
  { title: "Assessments", href: "/dashboard/assessments", icon: FileText },
  { title: "Evacuations", href: "/dashboard/evacuations", icon: ClipboardList },
];

export function Sidebar({ isOpen }) {
  const { user } = useAuth();

  const filteredItems = items.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 w-64 border-r border-outline-variant/30 bg-white transition-transform duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0 md:bg-surface-container-low/30",
      isOpen ? "translate-x-0 shadow-2xl md:shadow-none" : "-translate-x-full"
    )}>
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="px-2 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">Operational Menu</p>
        </div>
        <nav className="grid gap-1">
          {filteredItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/10" 
                    : "text-on-surface-variant/70 hover:bg-muted hover:text-primary"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                  {item.title}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
