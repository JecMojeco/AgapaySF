import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { StructureLookup } from "@/components/structures/StructureLookup";
import { StructureForm } from "@/components/structures/StructureForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronRight, ChevronLeft, Plus, Building2, MapPin, AlertCircle } from "lucide-react";

export function AssessmentStepper() {
  const [step, setStep] = useState(1);
  const [events, setEvents] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddStructureOpen, setIsAddStructureOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    event_id: "",
    zone_id: "",
    structure_id: "",
    selectedStructure: null,
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
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

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

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading assessment tools...</div>;

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step === s ? 'border-primary bg-primary text-primary-foreground' : 
                  step > s ? 'border-primary bg-primary/20 text-primary' : 'border-muted text-muted-foreground'
                }`}>
                  {s}
                </div>
                <span className="text-xs mt-2 font-medium">
                  {s === 1 ? 'Context' : s === 2 ? 'Structure' : 'Assessment'}
                </span>
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 mx-2 -mt-6 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 ? 'Step 1: Assessment Context' : 
             step === 2 ? 'Step 2: Select Structure' : 'Step 3: Damage Assessment'}
          </CardTitle>
          <CardDescription>
            {step === 1 ? 'Identify the disaster event and the zone being assessed.' : 
             step === 2 ? 'Locate the specific building or structure to assess.' : 'Provide details on the extent of damage.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
              <p>Step 3 (Damage & Photo) will be implemented in the next task.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={step === 3}
          >
            {step === 3 ? 'Submit Report' : 'Next Step'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
