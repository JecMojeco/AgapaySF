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
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Trash2, ShieldAlert, XCircle } from "lucide-react";

export function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRoles, setPendingRoles] = useState({});
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "",
    onConfirm: () => {},
    variant: "default",
    icon: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [pendingUsers, allUsers] = await Promise.all([
        api("/users/pending"),
        api("/users"),
      ]);

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
    setIsProcessing(true);
    try {
      await api(`/users/${userId}/reject`, { method: "PATCH" });
      toast({ title: "Success", description: "User rejected" });
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
    setIsProcessing(true);
    try {
      await api(`/users/${userId}/deactivate`, { method: "PATCH" });
      toast({ 
        title: "User Deactivated", 
        description: "This user can no longer access the system until reactivated.",
        variant: "warning"
      });
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await api(`/users/${userId}/reactivate`, { method: "PATCH" });
      toast({ title: "Success", description: "User access restored" });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (userId) => {
    setIsProcessing(true);
    try {
      await api(`/users/${userId}`, { method: "DELETE" });
      toast({ 
        title: "Permanently Deleted", 
        description: "User has been removed from the system.",
        variant: "destructive" 
      });
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const openConfirm = (type, user) => {
    switch (type) {
      case "deactivate":
        setConfirmConfig({
          isOpen: true,
          title: "Deactivate User",
          description: (
            <span>
              Are you sure you want to deactivate <span className="font-bold text-foreground">{user.name}</span>? 
              They will lose all system access immediately.
            </span>
          ),
          confirmText: "Deactivate User",
          onConfirm: () => handleDeactivate(user.user_id),
          variant: "warning",
          icon: ShieldAlert,
        });
        break;
      case "delete":
        setConfirmConfig({
          isOpen: true,
          title: "Permanent Deletion",
          description: (
            <span>
              Are you sure you want to delete <span className="font-bold text-foreground">{user.name}</span>? 
              This action is <span className="text-destructive font-bold underline">permanent</span> and cannot be undone.
            </span>
          ),
          confirmText: "Confirm Permanent Deletion",
          onConfirm: () => handleDelete(user.user_id),
          variant: "destructive",
          icon: Trash2,
        });
        break;
      case "reject":
        setConfirmConfig({
          isOpen: true,
          title: "Reject Registration",
          description: (
            <span>
              Are you sure you want to reject the registration of <span className="font-bold text-foreground">{user.name}</span>? 
              This will remove their pending request.
            </span>
          ),
          confirmText: "Reject Request",
          onConfirm: () => handleReject(user.user_id),
          variant: "danger",
          icon: XCircle,
        });
        break;
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
                      onClick={() => openConfirm("reject", user)}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {user.status === "ACTIVE" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openConfirm("deactivate", user)}
                    className="gap-2"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Deactivate
                  </Button>
                )}
                {user.status === "INACTIVE" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleReactivate(user.user_id)}
                    >
                      Reactivate
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openConfirm("delete", user)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onOpenChange={(open) => setConfirmConfig(prev => ({ ...prev, isOpen: open }))}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText={confirmConfig.confirmText}
        onConfirm={confirmConfig.onConfirm}
        variant={confirmConfig.variant}
        icon={confirmConfig.icon}
        isLoading={isProcessing}
      />
    </div>
  );
}
