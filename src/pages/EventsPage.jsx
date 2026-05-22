import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Plus, Calendar } from "lucide-react";

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    event_name: "",
    disaster_type: "",
    date_started: "",
    date_ended: ""
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api('/events');
      setEvents(data);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditingEvent(event);
      
      const formatDataDate = (dateStr) => {
        if (!dateStr) return "";
        return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
      };

      setFormData({
        event_name: event.event_name,
        disaster_type: event.disaster_type,
        date_started: formatDataDate(event.date_started),
        date_ended: formatDataDate(event.date_ended)
      });
    } else {
      setEditingEvent(null);
      setFormData({
        event_name: "",
        disaster_type: "",
        date_started: "",
        date_ended: ""
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingEvent ? 'PUT' : 'POST';
      const endpoint = editingEvent ? `/events/${editingEvent.event_id}` : '/events';
      
      const payload = { 
        ...formData,
        date_ended: formData.date_ended || null // Send null instead of deleting
      };

      await api(endpoint, {
        method,
        body: JSON.stringify(payload)
      });

      toast({ 
        title: "Success", 
        description: `Event ${editingEvent ? 'updated' : 'created'} successfully` 
      });
      setIsOpen(false);
      fetchEvents();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6 animate-in fade-in duration-700 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Disaster Events</h1>
          <p className="text-muted-foreground">Track and manage disaster occurrences in the barangay.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Card className="border-outline-variant/30 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Events
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    Loading events...
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No events recorded.
                  </TableCell>
                </TableRow>
              ) : (
                events.map(event => (
                  <TableRow key={event.event_id}>
                    <TableCell className="font-medium">{event.event_name}</TableCell>
                    <TableCell>{event.disaster_type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        {new Date(event.date_started).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        {event.date_ended ? new Date(event.date_ended).toLocaleDateString() : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {!event.date_ended ? (
                        <Badge className="bg-[#2E7D32] hover:bg-[#2E7D32]/90">Ongoing</Badge>
                      ) : (
                        <Badge variant="secondary">Completed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(event)}>Edit</Button>
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
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="event_name">Event Name</Label>
                <Input 
                  id="event_name" 
                  value={formData.event_name}
                  onChange={e => setFormData({...formData, event_name: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="disaster_type">Disaster Type</Label>
                <Input 
                  id="disaster_type" 
                  placeholder="e.g. Typhoon, Flood, Fire"
                  value={formData.disaster_type}
                  onChange={e => setFormData({...formData, disaster_type: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date_started">Start Date</Label>
                <Input 
                  id="date_started" 
                  type="date"
                  value={formData.date_started}
                  onChange={e => setFormData({...formData, date_started: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date_ended">End Date (Optional)</Label>
                <Input 
                  id="date_ended" 
                  type="date"
                  value={formData.date_ended}
                  onChange={e => setFormData({...formData, date_ended: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{editingEvent ? 'Update' : 'Create'} Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
