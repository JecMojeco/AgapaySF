import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  UserPlus, 
  Edit2, 
  Users, 
  Baby, 
  Activity, 
  Heart, 
  ShieldAlert,
  MapPin,
  Filter
} from "lucide-react";
import { ResidentForm } from "@/components/residents/ResidentForm";

export function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const zoneParam = selectedZone !== "all" ? `&zone_id=${selectedZone}` : "";
      const [residentsData, zonesData] = await Promise.all([
        api(`/residents?search=${search}${zoneParam}`),
        api("/zones")
      ]);
      setResidents(residentsData);
      setZones(zonesData);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [search, selectedZone, toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchData]);

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
      fetchData();
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
    <div className="p-6 animate-in fade-in duration-700 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Resident Directory</h1>
          <p className="text-muted-foreground">Manage and track barangay residents</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Resident
        </Button>
      </div>

      <Card className="border-outline-variant/30 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Residents
            </CardTitle>
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  className="pl-9 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="All Zones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    {zones.map(z => (
                      <SelectItem key={z.zone_id} value={z.zone_id.toString()}>
                        {z.zone_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {r.zone_name}
                      </div>
                    </TableCell>
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
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResident ? 'Edit Resident' : 'Add New Resident'}</DialogTitle>
          </DialogHeader>
          <ResidentForm 
            key={editingResident?.resident_id || 'new'}
            initialData={editingResident} 
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
