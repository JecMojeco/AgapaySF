import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function ResidentForm({ initialData, onSubmit, isLoading }) {
  const [zones, setZones] = useState([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    surname: "",
    first_name: "",
    middle_initial: "",
    gender: "M",
    birth_date: "",
    contact_number: "",
    family_size: 1,
    senior_citizen_count: 0,
    fourPs_member_count: 0,
    baby_count: 0,
    infant_count: 0,
    pregnant_count: 0,
    pwd_count: 0,
    zone_id: ""
  });

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const data = await api('/zones');
        setZones(data);
      } catch (err) {
        toast({ title: "Error", description: "Failed to fetch zones", variant: "destructive" });
      }
    };
    fetchZones();
  }, [toast]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        birth_date: initialData.birth_date ? initialData.birth_date.split('T')[0] : "",
        zone_id: initialData.zone_id?.toString() || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSelectChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      zone_id: parseInt(formData.zone_id),
      middle_initial: formData.middle_initial || null,
      contact_number: formData.contact_number || null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="surname">Surname</Label>
          <Input id="surname" value={formData.surname} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middle_initial">Middle Initial</Label>
          <Input id="middle_initial" value={formData.middle_initial} onChange={handleChange} maxLength={1} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(v) => handleSelectChange("gender", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="F">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birth_date">Birth Date</Label>
          <Input id="birth_date" type="date" value={formData.birth_date} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_number">Contact Number</Label>
          <Input id="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="09XXXXXXXXX" maxLength={11} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="family_size">Family Size</Label>
          <Input id="family_size" type="number" min={1} max={99} value={formData.family_size} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zone_id">Zone</Label>
          <Select value={formData.zone_id} onValueChange={(v) => handleSelectChange("zone_id", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent>
              {zones.map(zone => (
                <SelectItem key={zone.zone_id} value={zone.zone_id.toString()}>
                  {zone.zone_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Vulnerability Checklist</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senior_citizen_count">Senior Citizens</Label>
            <Input id="senior_citizen_count" type="number" min={0} max={99} value={formData.senior_citizen_count} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fourPs_member_count">4Ps Members</Label>
            <Input id="fourPs_member_count" type="number" min={0} max={99} value={formData.fourPs_member_count} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="baby_count">Babies (0-2y)</Label>
            <Input id="baby_count" type="number" min={0} max={99} value={formData.baby_count} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="infant_count">Infants (3-5y)</Label>
            <Input id="infant_count" type="number" min={0} max={99} value={formData.infant_count} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pregnant_count">Pregnant</Label>
            <Input id="pregnant_count" type="number" min={0} max={99} value={formData.pregnant_count} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pwd_count">PWDs</Label>
            <Input id="pwd_count" type="number" min={0} max={99} value={formData.pwd_count} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Resident"}
        </Button>
      </div>
    </form>
  );
}
