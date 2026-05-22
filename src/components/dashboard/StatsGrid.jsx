import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, ClipboardList, Contact } from "lucide-react";

export function StatsGrid({ stats }) {
  const items = [
    { title: "Assessments Filed", value: stats?.totalAssessments || "0", icon: FileText },
    { title: "Currently Evacuated", value: stats?.activeEvacuations || "0", icon: ClipboardList },
    { title: "Total Residents", value: stats?.totalResidents || "0", icon: Contact },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title} className="border-outline-variant/30 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-on-surface-variant/70 uppercase tracking-wider">{item.title}</CardTitle>
            <div className="p-2 rounded-lg bg-primary/5">
              {item.icon && <item.icon className="h-4 w-4 text-primary" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-on-surface">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
