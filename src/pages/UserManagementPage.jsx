import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const data = await api('/users/pending');
      setUsers(data);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (id, action, role = null) => {
    try {
      const body = role ? JSON.stringify({ role }) : undefined;
      await api(`/users/${id}/${action}`, { method: 'PATCH', body });
      toast({ title: "Success", description: `User ${action}ed successfully` });
      fetchUsers();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="p-8">Loading pending users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pending User Approvals</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(u => (
            <TableRow key={u.user_id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.contact_number}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" onClick={() => handleAction(u.user_id, 'approve', 'Kagawad')}>Approve (Kagawad)</Button>
                <Button size="sm" onClick={() => handleAction(u.user_id, 'approve', 'Staff')}>Approve (Staff)</Button>
                <Button size="sm" variant="destructive" onClick={() => handleAction(u.user_id, 'reject')}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow><TableCell colSpan={3} className="text-center p-4">No pending registration requests</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
