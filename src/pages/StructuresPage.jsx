import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Home, Plus, Edit2, Trash2, Building, Store, Factory, Landmark } from "lucide-react";
import { StructureForm } from "@/components/structures/StructureForm";

export function StructuresPage() {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  
  const { toast } = useToast();

  const fetchStructures = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api("/structures");
      setStructures(data);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStructures();
  }, [fetchStructures]);

  const handleOpenDialog = (structure = null) => {
    setEditingStructure(structure);
    setIsOpen(true);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    fetchStructures();
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
