import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  UserPlus, 
  LogOut, 
  Calendar, 
  MapPin, 
  ClipboardList,
  Filter,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

import { EvacuationStepper } from "@/components/evacuation/EvacuationStepper";

export function EvacuationLogPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [events, setEvents] = useState([]);
  const [zones, setZones] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const { toast } = useToast();

  const isKagawad = user?.role === 'Kagawad';

  // Form states
  const [departureDate, setDepartureDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch metadata once on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [eventsRes, zonesRes] = await Promise.all([
          api('/events'),
          api('/zones')
        ]);
        setEvents(eventsRes);
        setZones(zonesRes);
      } catch (error) {
        console.error('Metadata fetch failed:', error);
      }
    };
    fetchMetadata();
  }, []);

  // 2. Sync zoneFilter for Kagawad
  useEffect(() => {
    if (isKagawad && user?.zone_id) {
      setZoneFilter(user.zone_id.toString());
    }
  }, [user, isKagawad]);

  // 3. Fetch operational data on filter change
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (eventFilter && eventFilter !== 'all') {
        params.append('event_id', eventFilter);
      }
      
      const effectiveZone = isKagawad ? user?.zone_id?.toString() : zoneFilter;
      if (effectiveZone && effectiveZone !== 'all') {
        params.append('zone_id', effectiveZone);
      }

      const logsData = await api(`/evacuations?${params.toString()}`);
      setLogs(logsData);
    } catch {
      toast({
        title: "Filter Error",
        description: "Failed to apply filters to evacuation data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [search, eventFilter, zoneFilter, isKagawad, user?.zone_id, toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleLogDeparture = async () => {
    if (!selectedLog || !departureDate) return;

    setIsSubmitting(true);
    try {
      await api(`/evacuations/${selectedLog.evacuation_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          departure_date: departureDate,
          status: "Returned"
        })
      });
      toast({
        title: "Success",
        description: "Departure logged successfully.",
      });
      setIsDepartureOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Evacuated':
        return <Badge className="bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white border-none">Evacuated</Badge>;
      case 'Returned':
        return <Badge className="bg-[#1565C0] hover:bg-[#1565C0]/90 text-white border-none">Returned</Badge>;
      case 'Transferred':
        return <Badge className="bg-[#9E9E9E] hover:bg-[#9E9E9E]/90 text-white border-none">Transferred</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const currentZoneName = useMemo(() => {
    if (!isKagawad) return "All Zones";
    const zone = zones.find(z => z.zone_id.toString() === zoneFilter);
    return zone ? zone.zone_name : "Your Zone";
  }, [isKagawad, zones, zoneFilter]);

  return (
    <div className="p-6 animate-in fade-in duration-700 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Evacuation Log</h1>
          <p className="text-muted-foreground">Track resident arrivals and departures during disaster events.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Log Arrival
        </Button>
      </div>

      <Card className="border-outline-variant/30 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Logs
            </CardTitle>
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resident..."
                  className="pl-9 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="All Events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {events.map(e => (
                      <SelectItem key={e.event_id} value={e.event_id.toString()}>{e.event_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!isKagawad ? (
                  <Select 
                    value={zoneFilter} 
                    onValueChange={setZoneFilter}
                  >
                    <SelectTrigger className="w-[120px] h-9">
                      <SelectValue placeholder="All Zones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      {zones.map(z => (
                        <SelectItem key={z.zone_id} value={z.zone_id.toString()}>{z.zone_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 h-9 px-3 rounded-md bg-primary/10 border border-primary/20 text-primary">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-tight leading-none pt-0.5">
                      {currentZoneName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resident</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span>Loading logs...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No evacuation logs found for the selected criteria.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.evacuation_id}>
                    <TableCell className="font-medium">{log.resident_name}</TableCell>
                    <TableCell>{log.event_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {log.zone_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        {format(new Date(log.arrival_date), "MMM d, yyyy p")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.departure_date ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          {format(new Date(log.departure_date), "MMM d, yyyy p")}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Still in shelter</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell className="text-right">
                      {!log.departure_date && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => {
                            setSelectedLog(log);
                            setIsDepartureOpen(true);
                          }}
                        >
                          <LogOut className="w-3.5 h-3.5 mr-1" />
                          Departure
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Arrival Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Log New Arrival</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <EvacuationStepper 
              onSuccess={() => {
                fetchData();
                setTimeout(() => setIsAddOpen(false), 2000);
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Log Departure Dialog */}
      <Dialog open={isDepartureOpen} onOpenChange={setIsDepartureOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log Departure</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Logging departure for <span className="font-bold text-on-surface">{selectedLog?.resident_name}</span> from the <span className="font-bold text-on-surface">{selectedLog?.event_name}</span> evacuation.
            </p>
            <div className="grid gap-2">
              <Label htmlFor="departure_date">Departure Date & Time</Label>
              <Input
                id="departure_date"
                type="datetime-local"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDepartureOpen(false)}>Cancel</Button>
            <Button onClick={handleLogDeparture} disabled={isSubmitting}>
              {isSubmitting ? "Logging..." : "Log Departure"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
