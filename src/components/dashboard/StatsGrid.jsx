import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, ClipboardList, Contact } from "lucide-react";

export function StatsGrid({ stats }) {
  const items = [
    { title: "Assessments Filed", value: stats?.totalAssessments || "0", icon: FileText },
    { title: "Currently Evacuated", value: stats?.activeEvacuations || "0", icon: ClipboardList },
    { title: "Total Residents", value: stats?.totalResidents || "0", icon: Contact },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            {item.icon && <item.icon className="h-4 w-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
