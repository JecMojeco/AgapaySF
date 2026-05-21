import { useState, useEffect, useCallback } from "react";
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
import { Label } from "@/components/ui/label";
import { 
  Search, 
  UserPlus, 
  LogOut, 
  Calendar, 
  MapPin, 
  ClipboardList 
} from "lucide-react";
import { format } from "date-fns";

import { EvacuationStepper } from "@/components/evacuation/EvacuationStepper";

export function EvacuationLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const { toast } = useToast();

  // Form states
  const [departureDate, setDepartureDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [logsData] = await Promise.all([
        api("/evacuations")
      ]);
      setLogs(logsData);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch evacuation data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
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

  const filteredLogs = logs.filter(log => 
    log.resident_name.toLowerCase().includes(search.toLowerCase()) ||
    log.event_name.toLowerCase().includes(search.toLowerCase()) ||
    log.zone_name.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Logs
            </CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resident, event, or zone..."
                className="pl-9 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
                    Loading logs...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No evacuation logs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
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
