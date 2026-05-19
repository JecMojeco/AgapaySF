import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { StructureLookup } from "@/components/structures/StructureLookup";
import { StructureForm } from "@/components/structures/StructureForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Building2, 
  MapPin, 
  AlertCircle, 
  Camera, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  LayoutDashboard,
  FileText
} from "lucide-react";

export function AssessmentStepper() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [events, setEvents] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isAddStructureOpen, setIsAddStructureOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    event_id: "",
    zone_id: "",
    structure_id: "",
    selectedStructure: null,
    damage_level: "",
    photo: null,
    photoPreview: null
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsData, zonesData] = await Promise.all([
          api("/events"),
          api("/zones")
        ]);
        setEvents(eventsData);
        setZones(zonesData);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load initial data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.event_id || !formData.zone_id) {
        toast({ title: "Validation Error", description: "Please select an event and zone", variant: "destructive" });
        return;
      }
    } else if (step === 2) {
      if (!formData.structure_id) {
        toast({ title: "Validation Error", description: "Please select a structure", variant: "destructive" });
        return;
      }
    } else if (step === 3) {
      if (!formData.damage_level) {
        toast({ title: "Validation Error", description: "Please select a damage level", variant: "destructive" });
        return;
      }
    } else if (step === 4) {
      handleSubmit();
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('event_id', formData.event_id);
      data.append('zone_id', formData.zone_id);
      data.append('structure_id', formData.structure_id);
      data.append('damage_level', formData.damage_level);
      if (formData.photo) {
        data.append('photo', formData.photo);
      }

      await api("/assessments", {
        method: "POST",
        body: data
      });

      setSubmitted(true);
      toast({ title: "Success", description: "Assessment submitted successfully." });
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to submit assessment", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      structure_id: "",
      selectedStructure: null,
      damage_level: "",
      photo: null,
      photoPreview: null
    });
    setStep(2); // Start from structure selection for the same event/zone
    setSubmitted(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="event">Disaster Event</Label>
        <Select
          value={formData.event_id}
          onValueChange={(value) => setFormData({ ...formData, event_id: value })}
        >
          <SelectTrigger id="event">
            <SelectValue placeholder="Select active event" />
          </SelectTrigger>
          <SelectContent>
            {events.map(e => (
              <SelectItem key={e.event_id} value={e.event_id.toString()}>{e.event_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Select the event this assessment is for.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zone">Barangay Zone</Label>
        <Select
          value={formData.zone_id}
          onValueChange={(value) => setFormData({ ...formData, zone_id: value })}
        >
          <SelectTrigger id="zone">
            <SelectValue placeholder="Select zone" />
          </SelectTrigger>
          <SelectContent>
            {zones.map(z => (
              <SelectItem key={z.zone_id} value={z.zone_id.toString()}>{z.zone_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Geographic area of the structure.</p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label>Select Structure</Label>
        <StructureLookup
          onSelect={(structure) => {
            setFormData({ 
              ...formData, 
              structure_id: structure.structure_id.toString(),
              selectedStructure: structure
            });
          }}
          initialValue={formData.selectedStructure?.address || ""}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">Search by address or owner name.</p>
          <Dialog open={isAddStructureOpen} onOpenChange={setIsAddStructureOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-3 h-3 mr-1" />
                Add New Structure
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Quick Add Structure</DialogTitle>
              </DialogHeader>
              <div className="py-2">
                <StructureForm
                  onSuccess={(newStructure) => {
                    setFormData({
                      ...formData,
                      structure_id: newStructure.structure_id.toString(),
                      selectedStructure: newStructure
                    });
                    setIsAddStructureOpen(false);
                    toast({ title: "Structure added", description: "The new structure has been selected." });
                  }}
                  onCancel={() => setIsAddStructureOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {formData.selectedStructure && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-background rounded-full border">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold leading-none">{formData.selectedStructure.address}</h4>
                <p className="text-sm text-muted-foreground">
                  {formData.selectedStructure.structure_type} • Owned by {formData.selectedStructure.owner_first_name} {formData.selectedStructure.owner_surname}
                </p>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  Barangay {formData.selectedStructure.barangay || 'Zone ' + formData.selectedStructure.zone_id}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, damage_level: "Partial" })}
          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all h-40 ${
            formData.damage_level === "Partial" 
              ? "border-[#F9A825] bg-[#F9A825]/10" 
              : "border-muted bg-card hover:border-muted-foreground"
          }`}
        >
          <div className={`p-3 rounded-full mb-3 ${formData.damage_level === "Partial" ? "bg-[#F9A825] text-white" : "bg-muted"}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <span className="font-bold text-[#F9A825]">Partially Damaged</span>
          <p className="text-[10px] text-muted-foreground mt-1 text-center">Structure is safe to enter but needs repair.</p>
        </button>

        <button
          type="button"
          onClick={() => setFormData({ ...formData, damage_level: "Total" })}
          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all h-40 ${
            formData.damage_level === "Total" 
              ? "border-[#E65100] bg-[#E65100]/10" 
              : "border-muted bg-card hover:border-muted-foreground"
          }`}
        >
          <div className={`p-3 rounded-full mb-3 ${formData.damage_level === "Total" ? "bg-[#E65100] text-white" : "bg-muted"}`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <span className="font-bold text-[#E65100]">Totally Damaged</span>
          <p className="text-[10px] text-muted-foreground mt-1 text-center">Inhabitable. Major structural failure.</p>
        </button>
      </div>

      <div className="space-y-2 pt-4">
        <Label htmlFor="photo">Photo Upload (Optional)</Label>
        <div className="flex items-center gap-4">
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex-1"
          />
          <Camera className="w-6 h-6 text-muted-foreground" />
        </div>
        {formData.photoPreview && (
          <div className="mt-4 relative w-full aspect-video rounded-lg overflow-hidden border">
            <img src={formData.photoPreview} alt="Preview" className="object-cover w-full h-full" />
            <Button 
              variant="destructive" 
              size="sm" 
              className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
              onClick={() => setFormData({ ...formData, photo: null, photoPreview: null })}
            >
              ×
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderReview = () => {
    const selectedEvent = events.find(e => e.event_id.toString() === formData.event_id);
    const selectedZone = zones.find(z => z.zone_id.toString() === formData.zone_id);

    return (
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Event</p>
            <p className="font-medium text-sm">{selectedEvent?.event_name}</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Zone</p>
            <p className="font-medium text-sm">{selectedZone?.zone_name}</p>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-4 h-4 text-primary" />
            <h4 className="font-semibold">{formData.selectedStructure?.address}</h4>
          </div>
          <p className="text-sm text-muted-foreground pl-7">
            {formData.selectedStructure?.structure_type} • Owned by {formData.selectedStructure?.owner_first_name} {formData.selectedStructure?.owner_surname}
          </p>
        </div>

        <div className="p-4 border rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${formData.damage_level === 'Total' ? 'bg-[#E65100]/10 text-[#E65100]' : 'bg-[#F9A825]/10 text-[#F9A825]'}`}>
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Damage Level</p>
              <p className={`font-bold ${formData.damage_level === 'Total' ? 'text-[#E65100]' : 'text-[#F9A825]'}`}>
                {formData.damage_level === 'Total' ? 'Totally Damaged' : formData.damage_level === 'Partial' ? 'Partially Damaged' : ''}
              </p>
            </div>
          </div>
          {formData.photo && <FileText className="w-5 h-5 text-muted-foreground" />}
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="py-12 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Assessment Submitted!</h2>
      <p className="text-muted-foreground mb-10 max-w-sm">
        The damage report has been successfully recorded in the system.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Button onClick={handleReset} variant="outline" className="h-12">
          <RotateCcw className="w-4 h-4 mr-2" />
          File Another Report
        </Button>
        <Button onClick={() => navigate("/dashboard")} className="h-12">
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading assessment tools...</div>;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="border-2 border-green-100 shadow-xl">
          <CardContent>
            {renderSuccess()}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step === s ? 'border-primary bg-primary text-primary-foreground' : 
                  step > s ? 'border-primary bg-primary/20 text-primary' : 'border-muted text-muted-foreground'
                }`}>
                  {s}
                </div>
                <span className="text-[10px] mt-2 font-medium uppercase tracking-tight">
                  {s === 1 ? 'Context' : s === 2 ? 'Structure' : s === 3 ? 'Assessment' : 'Review'}
                </span>
              </div>
              {s < 4 && <div className={`flex-1 h-0.5 mx-2 -mt-6 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Card className="shadow-lg border-2">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>
            {step === 1 ? 'Step 1: Assessment Context' : 
             step === 2 ? 'Step 2: Select Structure' : 
             step === 3 ? 'Step 3: Damage Assessment' : 'Final Review'}
          </CardTitle>
          <CardDescription>
            {step === 1 ? 'Identify the disaster event and the zone being assessed.' : 
             step === 2 ? 'Locate the specific building or structure to assess.' : 
             step === 3 ? 'Provide details on the extent of damage and upload proof.' : 'Confirm the details before submitting the report.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderReview()}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6 bg-muted/10">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1 || submitting}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={submitting}
            className={step === 4 ? "bg-green-600 hover:bg-green-700 text-white" : ""}
          >
            {submitting ? 'Submitting...' : step === 4 ? 'Confirm & Submit' : 'Next Step'}
            {!submitting && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
