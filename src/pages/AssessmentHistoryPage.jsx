import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Filter, ImageIcon, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export default function AssessmentHistoryPage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [events, setEvents] = useState([]);
  const [zones, setZones] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assessmentsRes, eventsRes, zonesRes] = await Promise.all([
        api('/assessments'),
        api('/events'),
        api('/zones')
      ]);
      setAssessments(assessmentsRes);
      setEvents(eventsRes);
      setZones(zonesRes);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch assessments history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(a => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      (a.structure_address?.toLowerCase() || "").includes(searchLower) ||
      (a.owner_name?.toLowerCase() || "").includes(searchLower) ||
      (a.reporter_name?.toLowerCase() || "").includes(searchLower);
    
    const matchesEvent = eventFilter === "all" || (a.event_id?.toString() || "") === eventFilter;
    const matchesZone = zoneFilter === "all" || (a.zone_id?.toString() || "") === zoneFilter;

    return matchesSearch && matchesEvent && matchesZone;
  });

  const getDamageBadge = (level) => {
    switch (level) {
      case 'Total':
        return <Badge variant="destructive">Total</Badge>;
      case 'Partial':
        return <Badge variant="warning" className="bg-yellow-500 hover:bg-yellow-600 text-white">Partial</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const serverBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessment History</h1>
          <p className="text-muted-foreground">
            View and manage damage assessment reports.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/assessments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Assessment
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search address, owner, or reporter..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map(event => (
                  <SelectItem key={event.event_id} value={event.event_id.toString()}>
                    {event.event_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {zones.map(zone => (
                  <SelectItem key={zone.zone_id} value={zone.zone_id.toString()}>
                    {zone.zone_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Structure</TableHead>
                <TableHead>Damage</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Reporter</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">Loading assessments...</TableCell>
                </TableRow>
              ) : filteredAssessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">No assessments found.</TableCell>
                </TableRow>
              ) : (
                filteredAssessments.map((a) => (
                  <TableRow key={a.report_id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(a.timestamp), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{a.event_name}</div>
                      <div className="text-xs text-muted-foreground">{a.disaster_type}</div>
                    </TableCell>
                    <TableCell>{a.zone_name}</TableCell>
                    <TableCell>
                      <div className="font-medium">{a.structure_address}</div>
                      <div className="text-xs text-muted-foreground">Owner: {a.owner_name}</div>
                    </TableCell>
                    <TableCell>{getDamageBadge(a.damage_level)}</TableCell>
                    <TableCell>
                      {a.photo_url ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="relative h-10 w-10 rounded-md overflow-hidden hover:opacity-80 transition-opacity border">
                              <img 
                                src={`${serverBaseUrl}${a.photo_url}`} 
                                alt="Damage preview" 
                                className="object-cover h-full w-full"
                              />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Damage Photo - {a.structure_address}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 overflow-hidden rounded-lg border">
                              <img 
                                src={`${serverBaseUrl}${a.photo_url}`} 
                                alt="Full size damage" 
                                className="w-full h-auto"
                              />
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              Reported by {a.reporter_name} on {format(new Date(a.timestamp), 'PPP p')}
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className="h-10 w-10 bg-muted flex items-center justify-center rounded-md border text-muted-foreground">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{a.reporter_name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
