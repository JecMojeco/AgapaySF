import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/dashboard/users", icon: Users },
  { title: "Reports", href: "/dashboard/assessments", icon: FileText },
  { title: "Logs", href: "/dashboard/evacuations", icon: ClipboardList },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-40 w-full border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around">
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 text-[10px] font-medium transition-all",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
