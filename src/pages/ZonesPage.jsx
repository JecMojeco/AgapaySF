import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function ZonesPage() {
  const [zones, setZones] = useState([]);
  const [kagawads, setKagawads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    zone_name: "",
    assigned_kagawad: ""
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [zonesData, kagawadsData] = await Promise.all([
        api('/zones'),
        api('/users?role=Kagawad')
      ]);
      setZones(zonesData);
      setKagawads(kagawadsData);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDialog = (zone = null) => {
    if (zone) {
      setEditingZone(zone);
      setFormData({
        zone_name: zone.zone_name,
        assigned_kagawad: zone.assigned_kagawad?.toString() || ""
      });
    } else {
      setEditingZone(null);
      setFormData({
        zone_name: "",
        assigned_kagawad: ""
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.assigned_kagawad) {
      toast({
        title: "Assignment Required",
        description: "Please select a Kagawad to assign to this zone",
        variant: "destructive"
      });
      return;
    }

    try {
      const method = editingZone ? 'PUT' : 'POST';
      const endpoint = editingZone ? `/zones/${editingZone.zone_id}` : '/zones';
      
      await api(endpoint, {
        method,
        body: JSON.stringify({
          zone_name: formData.zone_name,
          assigned_kagawad: parseInt(formData.assigned_kagawad)
        })
      });

      toast({ 
        title: "Success", 
        description: `Zone ${editingZone ? 'updated' : 'created'} successfully` 
      });
      setIsOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading barangay zones...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Barangay Zones</h1>
        <Button onClick={() => handleOpenDialog()}>Add Zone</Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zone Name</TableHead>
              <TableHead>Assigned Kagawad</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.map(zone => (
              <TableRow key={zone.zone_id}>
                <TableCell className="font-medium">{zone.zone_name}</TableCell>
                <TableCell>{zone.kagawad_name || "Unassigned"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(zone)}>Assign Kagawad</Button>
                </TableCell>
              </TableRow>
            ))}
            {zones.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                  No zones recorded.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingZone ? 'Assign Kagawad' : 'Add New Zone'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="zone_name">Zone Name</Label>
                <Input 
                  id="zone_name" 
                  value={formData.zone_name}
                  onChange={e => setFormData({...formData, zone_name: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="kagawad">Assigned Kagawad</Label>
                <Select 
                  value={formData.assigned_kagawad} 
                  onValueChange={val => setFormData({...formData, assigned_kagawad: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Kagawad" />
                  </SelectTrigger>
                  <SelectContent>
                    {kagawads.map(k => (
                      <SelectItem key={k.user_id} value={k.user_id.toString()}>
                        {k.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{editingZone ? 'Update' : 'Create'} Zone</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
