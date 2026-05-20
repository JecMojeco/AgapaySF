import { UserTable } from "@/components/dashboard/UserTable";

export function UserManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Review and approve registration requests from barangay officials.
        </p>
      </div>
      <UserTable />
    </div>
  );
}
