import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ResidentLookup } from "@/components/residents/ResidentLookup";
import { ResidentForm } from "@/components/residents/ResidentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  User, 
  CheckCircle2, 
  Users,
  RotateCcw
} from "lucide-react";
import { format } from "date-fns";

export function EvacuationStepper({ onSuccess }) {
  const [step, setStep] = useState(1);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    resident_id: "",
    selectedResident: null,
    event_id: "",
    arrival_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    status: "Evacuated"
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await api("/events");
        setEvents(eventsData.filter(e => !e.date_ended));
      } catch {
        toast({ title: "Error", description: "Failed to load events", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [toast]);

  const validateVulnerabilities = (data) => {
    const sum = (data.senior_citizen_count || 0) + 
                (data.fourPs_member_count || 0) + 
                (data.baby_count || 0) + 
                (data.infant_count || 0) + 
                (data.pregnant_count || 0) + 
                (data.pwd_count || 0);
    return sum <= (data.family_size || 0);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.resident_id) {
        toast({ title: "Validation Error", description: "Please select or add a resident", variant: "destructive" });
        return;
      }
    } else if (step === 2) {
      if (!formData.event_id) {
        toast({ title: "Validation Error", description: "Please select an event", variant: "destructive" });
        return;
      }
      handleSubmit();
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await api("/evacuations", {
        method: "POST",
        body: JSON.stringify({
          resident_id: formData.resident_id,
          event_id: formData.event_id,
          arrival_date: formData.arrival_date,
          status: formData.status
        })
      });

      setSubmitted(true);
      toast({ title: "Success", description: "Evacuation logged successfully." });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to log evacuation", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      resident_id: "",
      selectedResident: null,
      event_id: "",
      arrival_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      status: "Evacuated"
    });
    setStep(1);
    setSubmitted(false);
  };

  const renderStep1 = () => (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label>Select Resident</Label>
        <ResidentLookup
          onSelect={(resident) => {
            setFormData({ 
              ...formData, 
              resident_id: resident.resident_id.toString(),
              selectedResident: resident
            });
          }}
          initialValue={formData.selectedResident ? `${formData.selectedResident.first_name} ${formData.selectedResident.surname}` : ""}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">Search by name.</p>
          <Dialog open={isAddResidentOpen} onOpenChange={setIsAddResidentOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-3 h-3 mr-1" />
                Add New Resident
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Quick Add Resident</DialogTitle>
              </DialogHeader>
              <div className="py-2">
                <ResidentForm
                  onSubmit={async (data) => {
                    if (!validateVulnerabilities(data)) {
                      toast({ 
                        title: "Validation Error", 
                        description: "Total vulnerable count cannot exceed family size.", 
                        variant: "destructive" 
                      });
                      return;
                    }
                    try {
                      const newResident = await api("/residents", {
                        method: "POST",
                        body: JSON.stringify(data)
                      });
                      setFormData({
                        ...formData,
                        resident_id: newResident.resident_id.toString(),
                        selectedResident: newResident
                      });
                      setIsAddResidentOpen(false);
                      toast({ title: "Resident added", description: "The new resident has been selected." });
                    } catch (err) {
                      toast({ title: "Error", description: err.message, variant: "destructive" });
                    }
                  }}
                  isLoading={false}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {formData.selectedResident && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-background rounded-full border">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold leading-none">
                  {formData.selectedResident.first_name} {formData.selectedResident.surname}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formData.selectedResident.gender === 'M' ? 'Male' : 'Female'} • Family of {formData.selectedResident.family_size}
                </p>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  <Users className="w-3.5 h-3.5 mr-1" />
                  {formData.selectedResident.zone_name || `Zone ${formData.selectedResident.zone_id}`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderStep2 = () => (
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="arrival_date">Arrival Date & Time</Label>
        <Input
          id="arrival_date"
          type="datetime-local"
          value={formData.arrival_date}
          onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
        />
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium">Status will be set to <span className="text-primary font-bold">Evacuated</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSuccess = () => (
    <div className="py-12 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Arrival Logged!</h2>
      <p className="text-muted-foreground mb-10 max-w-sm">
        The resident's arrival has been successfully recorded.
      </p>
      
      <Button onClick={handleReset} variant="outline" className="h-12 w-full">
        <RotateCcw className="w-4 h-4 mr-2" />
        Log Another Arrival
      </Button>
    </div>
  );

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading evacuation tools...</div>;

  if (submitted) {
    return (
      <div className="py-4 px-4">
        {renderSuccess()}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex justify-center items-center mb-4">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step === s ? 'border-primary bg-primary text-primary-foreground' : 
                  step > s ? 'border-primary bg-primary/20 text-primary' : 'border-muted text-muted-foreground'
                }`}>
                  {s}
                </div>
                <span className="text-[10px] mt-2 font-medium uppercase tracking-tight">
                  {s === 1 ? 'Resident' : 'Event'}
                </span>
              </div>
              {s < 2 && <div className={`w-20 h-0.5 mx-2 -mt-6 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="min-h-[300px]">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
      </div>

      <div className="flex justify-between border-t pt-6 mt-6">
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
          className={step === 2 ? "bg-green-600 hover:bg-green-700 text-white" : ""}
        >
          {submitting ? 'Logging...' : step === 2 ? 'Log Arrival' : 'Next Step'}
          {!submitting && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
