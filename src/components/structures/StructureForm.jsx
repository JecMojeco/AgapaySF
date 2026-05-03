import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResidentLookup } from "@/components/residents/ResidentLookup";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const STRUCTURE_TYPES = ["Residential", "Commercial", "Agricultural", "Industrial"];

export function StructureForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    address: initialData?.address || "",
    structure_type: initialData?.structure_type || "Residential",
    owner_id: initialData?.owner_id || ""
  });
  const [selectedOwner, setSelectedOwner] = useState(initialData ? {
    first_name: initialData.owner_first_name,
    surname: initialData.owner_surname,
    resident_id: initialData.owner_id
  } : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.owner_id) {
      toast({ title: "Validation Error", description: "Please select an owner", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const method = initialData ? 'PUT' : 'POST';
      const endpoint = initialData ? `/structures/${initialData.structure_id}` : '/structures';
      
      const result = await api(endpoint, {
        method,
        body: JSON.stringify(formData)
      });

      toast({ 
        title: "Success", 
        description: `Structure ${initialData ? 'updated' : 'created'} successfully` 
      });
      
      if (onSuccess) {
        // Return the created structure with owner info if it was a POST
        // Note: the POST response might not have owner names joined, 
        // so we might need to fetch it or augment it.
        const augmentedResult = {
          ...result,
          owner_first_name: selectedOwner.first_name,
          owner_surname: selectedOwner.surname
        };
        onSuccess(augmentedResult);
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (initialData ? "Update Structure" : "Create Structure")}
        </Button>
      </div>
    </form>
  );
}
