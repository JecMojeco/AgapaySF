import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Plus, Edit2, Trash2, Building, Store, Factory, Landmark } from "lucide-react";
import { ResidentLookup } from "@/components/residents/ResidentLookup";

const STRUCTURE_TYPES = ["Residential", "Commercial", "Agricultural", "Industrial"];

export function StructuresPage() {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    structure_type: "Residential",
    owner_id: ""
  });
  const [selectedOwner, setSelectedOwner] = useState(null);
  
  const { toast } = useToast();

  const fetchStructures = async () => {
    try {
      setLoading(true);
      const data = await api("/structures");
      setStructures(data);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStructures();
  }, []);

  const handleOpenDialog = (structure = null) => {
    if (structure) {
      setEditingStructure(structure);
      setFormData({
        address: structure.address,
        structure_type: structure.structure_type,
        owner_id: structure.owner_id
      });
      setSelectedOwner({
        first_name: structure.owner_first_name,
        surname: structure.owner_surname,
        resident_id: structure.owner_id
      });
    } else {
      setEditingStructure(null);
      setFormData({
        address: "",
        structure_type: "Residential",
        owner_id: ""
      });
      setSelectedOwner(null);
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.owner_id) {
      toast({ title: "Validation Error", description: "Please select an owner", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const method = editingStructure ? 'PUT' : 'POST';
      const endpoint = editingStructure ? `/structures/${editingStructure.structure_id}` : '/structures';
      
      await api(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      toast({ 
        title: "Success", 
        description: `Structure ${editingStructure ? 'updated' : 'created'} successfully` 
      });
      setIsOpen(false);
      fetchStructures();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this structure?")) return;
    
    try {
      await api(`/structures/${id}`, { method: 'DELETE' });
      toast({ title: "Success", description: "Structure deleted successfully" });
      fetchStructures();
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Structure Directory</h1>
          <p className="text-muted-foreground">Manage buildings and their owners</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Structure
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  Loading structures...
                </TableCell>
              </TableRow>
            ) : structures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No structures found.
                </TableCell>
              </TableRow>
            ) : (
              structures.map(s => (
                <TableRow key={s.structure_id}>
                  <TableCell className="font-medium">{s.address}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getTypeIcon(s.structure_type)}
                      {s.structure_type}
                    </div>
                  </TableCell>
                  <TableCell>
                    {s.owner_first_name} {s.owner_surname}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(s)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(s.structure_id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStructure ? 'Edit Structure' : 'Add New Structure'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House Number, Street, Zone"
              />
            </div>

            <div className="space-y-2">
              <Label>Structure Type</Label>
              <Select
                value={formData.structure_type}
                onValueChange={(value) => setFormData({ ...formData, structure_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {STRUCTURE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Owner (Resident)</Label>
              <ResidentLookup
                onSelect={(resident) => {
                  setFormData({ ...formData, owner_id: resident.resident_id });
                  setSelectedOwner(resident);
                }}
                initialValue={selectedOwner ? `${selectedOwner.first_name} ${selectedOwner.surname}` : ''}
              />
              {selectedOwner && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {selectedOwner.first_name} {selectedOwner.surname}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (editingStructure ? "Update Structure" : "Create Structure")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
