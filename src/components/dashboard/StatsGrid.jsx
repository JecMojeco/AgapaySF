import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Activity, Clock } from "lucide-react";

export function StatsGrid() {
  const stats = [
    { title: "Total Users", value: "12", icon: Users },
    { title: "System Uptime", value: "99.9%", icon: Clock },
    { title: "Pending Requests", value: "3", icon: Activity },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon && <stat.icon className="h-4 w-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
