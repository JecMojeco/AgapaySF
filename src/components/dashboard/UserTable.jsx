import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRoles, setPendingRoles] = useState({});
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [pendingUsers, allUsers] = await Promise.all([
        api("/users/pending"),
        api("/users"),
      ]);

      // Merge: prefer pending data if IDs match, though they should be distinct based on status
      const merged = [...pendingUsers];
      allUsers.forEach((u) => {
        if (!merged.find((p) => p.user_id === u.user_id)) {
          merged.push(u);
        }
      });

      setUsers(merged);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, role) => {
    setPendingRoles((prev) => ({ ...prev, [userId]: role }));
  };

  const handleApprove = async (userId) => {
    const role = pendingRoles[userId];
    if (!role) {
      toast({
        title: "Warning",
        description: "Please select a role first",
        variant: "destructive",
      });
      return;
    }

    try {
      await api(`/users/${userId}/approve`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      toast({ title: "Success", description: "User approved" });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (userId) => {
    try {
      await api(`/users/${userId}/reject`, { method: "PATCH" });
      toast({ title: "Success", description: "User rejected" });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      await api(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      toast({ title: "Success", description: "Role updated" });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      await api(`/users/${userId}/deactivate`, { method: "PATCH" });
      toast({ title: "Success", description: "User deactivated" });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="p-4 text-center">Loading users...</div>;

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
            <TableRow key={user.user_id}>
              <TableCell className="font-medium">
                {user.name}
              </TableCell>
              <TableCell>{user.contact_number}</TableCell>
              <TableCell>
                {user.status === "PENDING" ? (
                  <Select
                    onValueChange={(val) => handleRoleChange(user.user_id, val)}
                    value={pendingRoles[user.user_id] || ""}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kagawad">Kagawad</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : user.status === "ACTIVE" ? (
                  <Select
                    onValueChange={(val) => handleUpdateRole(user.user_id, val)}
                    value={user.role}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kagawad">Kagawad</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  user.role
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.status === "ACTIVE"
                      ? "default"
                      : user.status === "PENDING"
                      ? "secondary"
                      : "destructive"
                  }
                  className={
                    user.status === "PENDING"
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      : ""
                  }
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                {user.status === "PENDING" && (
                  <>
                    <Button size="sm" onClick={() => handleApprove(user.user_id)}>
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(user.user_id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {user.status === "ACTIVE" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeactivate(user.user_id)}
                  >
                    Deactivate
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
