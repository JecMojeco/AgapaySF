import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  Users, 
  Home, 
  AlertTriangle, 
  TrendingUp, 
  FileText,
  Activity,
  Calendar,
  Printer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [damageData, setDamageData] = useState([]);
  const [evacuationData, setEvacuationData] = useState([]);
  const [damageDetails, setDamageDetails] = useState([]);
  const [evacuationDetails, setEvacuationDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEventReports = useCallback(async (eventId) => {
    try {
      setReportLoading(true);
      const [damage, evacuation, dDetails, eDetails] = await Promise.all([
        api(`/reports/damage/${eventId}`),
        api(`/reports/evacuation/${eventId}`),
        api(`/reports/damage/${eventId}/details`),
        api(`/reports/evacuation/${eventId}/details`)
      ]);
      setDamageData(damage);
      setEvacuationData(evacuation);
      setDamageDetails(dDetails);
      setEvacuationDetails(eDetails);
    } catch (err) {
      console.error("Failed to fetch event reports:", err);
    } finally {
      setReportLoading(false);
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryData, eventsData] = await Promise.all([
        api("/reports/summary"),
        api("/events")
      ]);
      setSummary(summaryData);
      setEvents(eventsData);
      if (eventsData.length > 0) {
        const activeEvent = eventsData.find(e => e.status === 'Active' || e.status === 'Ongoing') || eventsData[0];
        setSelectedEvent(activeEvent.event_id.toString());
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch summary data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (selectedEvent && user?.role === 'Admin') {
      fetchEventReports(selectedEvent);
    }
  }, [selectedEvent, user, fetchEventReports]);

  const getPercentage = (count, total) => {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const totalDamageReports = damageData.reduce((acc, curr) => acc + parseInt(curr.count), 0);
  const totalEvacuationLogs = evacuationData.reduce((acc, curr) => acc + parseInt(curr.count), 0);

  const handleExportCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast({
        title: "No data",
        description: "There is no data to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header] === null || row[header] === undefined ? '' : row[header];
        const escaped = ('' + value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(','))
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Activity className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Generating reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-in fade-in duration-700 space-y-8 print-area">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">System Reports</h1>
          <p className="text-muted-foreground">Comprehensive overview of disaster response operations.</p>
        </div>
        <Button onClick={() => window.print()} variant="outline" className="print:hidden">
          <Printer className="h-4 w-4 mr-2" />
          Print PDF Summary
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-outline-variant/30 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">Total Residents</p>
              <h3 className="text-2xl font-bold text-on-surface">{summary?.totalResidents || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-outline-variant/30 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/5 rounded-xl flex items-center justify-center text-orange-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">Active Evacuations</p>
              <h3 className="text-2xl font-bold text-on-surface">{summary?.activeEvacuations || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-outline-variant/30 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/5 rounded-xl flex items-center justify-center text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">Damage Reports</p>
              <h3 className="text-2xl font-bold text-on-surface">{summary?.totalAssessments || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-outline-variant/30 shadow-sm bg-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/5 rounded-xl flex items-center justify-center text-purple-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">Total Events</p>
              <h3 className="text-2xl font-bold text-on-surface">{summary?.totalEvents || 0}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant/70">Event-Specific Insights</h2>
          <div className="w-64 print:hidden">
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                {events.map(event => (
                  <SelectItem key={event.event_id} value={event.event_id.toString()}>
                    {event.event_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="hidden print:block font-bold">
            Event: {events.find(e => e.event_id.toString() === selectedEvent)?.event_name}
          </div>
        </div>

        {user?.role !== 'Admin' ? (
          <Card className="border-dashed border-outline-variant/50 bg-surface-container-low/30">
            <CardContent className="p-10 flex flex-col items-center text-center gap-3">
              <AlertTriangle className="h-10 w-10 text-muted-foreground/40" />
              <div>
                <h3 className="font-bold text-on-surface">Restricted Access</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto"> Detailed event analytics are restricted to Admin users only.</p>
              </div>
            </CardContent>
          </Card>
        ) : reportLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
            <div className="h-64 bg-muted animate-pulse rounded-xl" />
            <div className="h-64 bg-muted animate-pulse rounded-xl" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Damage Distribution */}
              <Card className="border-outline-variant/30 shadow-sm overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    Damage Assessment Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of reported structure damage levels.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 pt-2">
                    {damageData.length === 0 ? (
                      <p className="text-sm text-center py-10 text-muted-foreground">No damage reports for this event.</p>
                    ) : (
                      damageData.map((item, idx) => {
                        const percentage = getPercentage(item.count, totalDamageReports);
                        return (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-on-surface-variant">{item.damage_level} Damage</span>
                              <span className="text-on-surface">{item.count} reports ({percentage}%)</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  item.damage_level === 'Total' ? 'bg-destructive' : 
                                  item.damage_level === 'Partial' ? 'bg-orange-500' : 'bg-primary'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Evacuation Status */}
              <Card className="border-outline-variant/30 shadow-sm overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Evacuation Status Summary
                  </CardTitle>
                  <CardDescription>Overview of resident statuses in evacuation centers.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 pt-2">
                    {evacuationData.length === 0 ? (
                      <p className="text-sm text-center py-10 text-muted-foreground">No evacuation logs for this event.</p>
                    ) : (
                      evacuationData.map((item, idx) => {
                        const percentage = getPercentage(item.count, totalEvacuationLogs);
                        return (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-on-surface-variant">{item.status}</span>
                              <span className="text-on-surface">{item.count} persons ({percentage}%)</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  item.status === 'Evacuated' ? 'bg-orange-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Damage Assessment */}
            <Card className="border-outline-variant/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Detailed Damage Assessment</CardTitle>
                <CardDescription>Full log of structure damage reports.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Damage Level</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {damageDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No detailed records found.</TableCell>
                      </TableRow>
                    ) : (
                      damageDetails.map((detail, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{detail.address}</TableCell>
                          <TableCell>{detail.structure_type}</TableCell>
                          <TableCell>
                            <Badge variant={detail.damage_level === 'Total' ? 'destructive' : 'outline'}>
                              {detail.damage_level}
                            </Badge>
                          </TableCell>
                          <TableCell>{detail.reporter_name}</TableCell>
                          <TableCell>{detail.zone_name}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(detail.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Detailed Evacuation Log */}
            <Card className="border-outline-variant/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Detailed Evacuation Log</CardTitle>
                <CardDescription>Full log of resident evacuation statuses.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resident Name</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Family Size</TableHead>
                      <TableHead>Vulnerables</TableHead>
                      <TableHead>Arrival</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evacuationDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No detailed records found.</TableCell>
                      </TableRow>
                    ) : (
                      evacuationDetails.map((detail, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{detail.resident_name}</TableCell>
                          <TableCell>{detail.zone_name}</TableCell>
                          <TableCell>{detail.family_size}</TableCell>
                          <TableCell>{detail.vulnerable_count}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {detail.arrival_date ? new Date(detail.arrival_date).toLocaleString() : '-'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {detail.departure_date ? new Date(detail.departure_date).toLocaleString() : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={detail.status === 'Evacuated' ? 'secondary' : 'default'}>
                              {detail.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Card className="border-none bg-surface-container-low shadow-sm rounded-xl overflow-hidden print:hidden">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface leading-none">Need detailed datasets?</h3>
              <p className="text-xs text-on-surface-variant/60 mt-1">Export full reports as CSV or PDF for external processing.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-[10px] font-bold uppercase"
              onClick={() => handleExportCSV(damageDetails, 'damage_report')}
            >
              Damage CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-[10px] font-bold uppercase"
              onClick={() => handleExportCSV(evacuationDetails, 'evacuation_log')}
            >
              Evacuation CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-[10px] font-bold uppercase"
              onClick={() => window.print()}
            >
              PDF Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
