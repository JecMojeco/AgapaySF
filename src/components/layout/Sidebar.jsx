import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, ClipboardList, Calendar, Map, Contact, Building } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Residents", href: "/dashboard/residents", icon: Contact },
  { title: "Structures", href: "/dashboard/structures", icon: Building },
  { title: "Users", href: "/dashboard/users", icon: Users },
  { title: "Events", href: "/dashboard/events", icon: Calendar },
  { title: "Zones", href: "/dashboard/zones", icon: Map },
  { title: "Assessments", href: "/dashboard/assessments", icon: FileText },
  { title: "Evacuations", href: "/dashboard/evacuations", icon: ClipboardList },
];

export function Sidebar() {
  return (
    <aside className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
      <div className="flex h-full flex-col gap-2 p-4">
        <nav className="grid gap-1">
          {items.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
