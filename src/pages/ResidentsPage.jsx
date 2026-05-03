import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Edit2, Users, Baby, Activity, Heart, ShieldAlert } from "lucide-react";
import { ResidentForm } from "@/components/residents/ResidentForm";

export function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchResidents = async () => {
    try {
      const data = await api(`/residents${search ? `?search=${search}` : ''}`);
      setResidents(data);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchData = async () => {
        try {
          const data = await api(`/residents${search ? `?search=${search}` : ''}`);
          setResidents(data);
        } catch (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, toast]);

  const handleOpenDialog = (resident = null) => {
    setEditingResident(resident);
    setIsOpen(true);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const method = editingResident ? 'PUT' : 'POST';
      const endpoint = editingResident ? `/residents/${editingResident.resident_id}` : '/residents';
      
      await api(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      toast({ 
        title: "Success", 
        description: `Resident ${editingResident ? 'updated' : 'created'} successfully` 
      });
      setIsOpen(false);
      fetchResidents();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVulnerabilityBadges = (r) => {
    const badges = [];
    if (r.senior_citizen_count > 0) badges.push({ icon: <Users className="w-3 h-3 mr-1" />, label: `SC: ${r.senior_citizen_count}` });
    if (r.fourPs_member_count > 0) badges.push({ icon: <ShieldAlert className="w-3 h-3 mr-1" />, label: `4Ps: ${r.fourPs_member_count}` });
    if (r.baby_count > 0) badges.push({ icon: <Baby className="w-3 h-3 mr-1" />, label: `B: ${r.baby_count}` });
    if (r.infant_count > 0) badges.push({ icon: <Baby className="w-3 h-3 mr-1" />, label: `I: ${r.infant_count}` });
    if (r.pregnant_count > 0) badges.push({ icon: <Heart className="w-3 h-3 mr-1" />, label: `P: ${r.pregnant_count}` });
    if (r.pwd_count > 0) badges.push({ icon: <Activity className="w-3 h-3 mr-1" />, label: `PWD: ${r.pwd_count}` });
    
    return badges.map((b, i) => (
      <Badge key={i} variant="secondary" className="mr-1 mb-1 text-[10px] px-1.5 py-0">
        {b.icon} {b.label}
      </Badge>
    ));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resident Directory</h1>
          <p className="text-muted-foreground">Manage and track barangay residents</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Resident
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name..." 
          className="pl-10" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Family Size</TableHead>
              <TableHead>Vulnerabilities</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Loading residents...
                </TableCell>
              </TableRow>
            ) : residents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No residents found.
                </TableCell>
              </TableRow>
            ) : (
              residents.map(r => (
                <TableRow key={r.resident_id}>
                  <TableCell className="font-medium">
                    {r.surname}, {r.first_name} {r.middle_initial ? `${r.middle_initial}.` : ''}
                  </TableCell>
                  <TableCell>{r.zone_name}</TableCell>
                  <TableCell>{r.family_size}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap max-w-[300px]">
                      {getVulnerabilityBadges(r)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(r)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResident ? 'Edit Resident' : 'Add New Resident'}</DialogTitle>
          </DialogHeader>
          <ResidentForm 
            initialData={editingResident} 
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
