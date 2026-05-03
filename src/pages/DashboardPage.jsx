import { StatsGrid } from "@/components/dashboard/StatsGrid";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to AgapaySF. Here's an overview of the system.
        </p>
      </div>
      <StatsGrid />
    </div>
  );
}
