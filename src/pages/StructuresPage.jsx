import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Home, 
  Plus, 
  Edit2, 
  Trash2, 
  Building, 
  Store, 
  Factory, 
  Landmark,
  Search,
  MapPin,
  Filter,
  User
} from "lucide-react";
import { StructureForm } from "@/components/structures/StructureForm";

export function StructuresPage() {
  const [structures, setStructures] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const zoneParam = selectedZone !== "all" ? `&zone_id=${selectedZone}` : "";
      const [structuresData, zonesData] = await Promise.all([
        api(`/structures?search=${search}${zoneParam}`),
        api("/zones")
      ]);
      setStructures(structuresData);
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

  const handleOpenDialog = (structure = null) => {
    setEditingStructure(structure);
    setIsOpen(true);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this structure?")) return;
    
    try {
      await api(`/structures/${id}`, { method: 'DELETE' });
      toast({ title: "Success", description: "Structure deleted successfully" });
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Residential": return <Home className="w-4 h-4 mr-2" />;
      case "Commercial": return <Store className="w-4 h-4 mr-2" />;
      case "Agricultural": return <Landmark className="w-4 h-4 mr-2" />;
      case "Industrial": return <Factory className="w-4 h-4 mr-2" />;
      default: return <Building className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <div className="p-6 animate-in fade-in duration-700 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Structure Directory</h1>
          <p className="text-muted-foreground">Manage buildings and their owners</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Structure
        </Button>
      </div>

      <Card className="border-outline-variant/30 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Structures
            </CardTitle>
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search address or owner..."
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
                <TableHead>Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Loading structures...
                  </TableCell>
                </TableRow>
              ) : structures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No structures found.
                  </TableCell>
                </TableRow>
              ) : (
                structures.map(s => (
                  <TableRow key={s.structure_id}>
                    <TableCell className="font-medium">{s.address}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        {getTypeIcon(s.structure_type)}
                        {s.structure_type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {s.zone_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        {s.owner_first_name} {s.owner_surname}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(s)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(s.structure_id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStructure ? 'Edit Structure' : 'Add New Structure'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <StructureForm
              initialData={editingStructure}
              onSuccess={handleSuccess}
              onCancel={() => setIsOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
