import { UserTable } from "@/components/dashboard/UserTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export function UserManagementPage() {
  return (
    <div className="p-6 animate-in fade-in duration-700 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">User Management</h1>
        <p className="text-muted-foreground">
          Review and approve registration requests from barangay officials.
        </p>
      </div>

      <Card className="border-outline-variant/30 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            System Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <UserTable />
        </CardContent>
      </Card>
    </div>
  );
}
