import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function UserTable() {
  const users = [
    { id: 1, name: "John Paulo Bautista", contact: "09123456789", role: "Admin", status: "Active" },
    { id: 2, name: "Maddox Dimitri Sacayan", contact: "09987654321", role: "Kagawad", status: "Pending" },
    { id: 3, name: "Jec Dainel Mojeco", contact: "09112233445", role: "Staff", status: "Active" },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.contact}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                {user.status === "Pending" && (
                  <>
                    <Button size="sm" variant="outline">Approve</Button>
                    <Button size="sm" variant="destructive">Reject</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
