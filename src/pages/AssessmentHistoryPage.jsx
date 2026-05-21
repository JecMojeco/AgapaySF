import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
} from "@/components/ui/dialog";
import { Search, Filter, ImageIcon, Plus, MapPin, Calendar, User, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";

export default function AssessmentHistoryPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [zones, setZones] = useState([]);
  const [events, setEvents] = useState([]);
  const { toast } = useToast();

  const isKagawad = user?.role === 'Kagawad';

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
      
      // Handle Event Filter
      if (eventFilter && eventFilter !== 'all') {
        params.append('event_id', eventFilter);
      }
      
      // Handle Zone Filter (Kagawad is forced to their zone, Admin/Staff uses state)
      const effectiveZone = isKagawad ? user?.zone_id?.toString() : zoneFilter;
      if (effectiveZone && effectiveZone !== 'all') {
        params.append('zone_id', effectiveZone);
      }

      const assessmentsRes = await api(`/assessments?${params.toString()}`);
      setAssessments(assessmentsRes);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Filter Error",
        description: "Could not apply filters. Please try again.",
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

  const getDamageBadge = (level) => {
    switch (level) {
      case 'Total':
        return <Badge variant="destructive" className="font-bold">Total</Badge>;
      case 'Partial':
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold border-none">Partial</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const serverBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

  const currentZoneName = useMemo(() => {
    if (!isKagawad) return "All Zones";
    const zone = zones.find(z => z.zone_id.toString() === zoneFilter);
    return zone ? zone.zone_name : "Your Zone";
  }, [isKagawad, zones, zoneFilter]);

  return (
    <div className="p-6 animate-in fade-in duration-700 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Assessment History</h1>
          <p className="text-muted-foreground">
            View and manage damage assessment reports from disaster events.
          </p>
        </div>
        <Button asChild>
          <Link to="/assessment/new">
            <Plus className="mr-2 h-4 w-4" />
            New Assessment
          </Link>
        </Button>
      </div>

      <Card className="border-outline-variant/30 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Directory Filters
            </CardTitle>
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search address or reporter..."
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
                    {events.map(event => (
                      <SelectItem key={event.event_id} value={event.event_id.toString()}>
                        {event.event_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!isKagawad ? (
                  <Select 
                    value={zoneFilter} 
                    onValueChange={setZoneFilter}
                  >
                    <SelectTrigger className="w-[130px] h-9">
                      <SelectValue placeholder="All Zones" />
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
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span>Loading assessments...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : assessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No assessments found for the selected criteria.
                  </TableCell>
                </TableRow>
              ) : (
                assessments.map((a) => (
                  <TableRow key={a.report_id}>
                    <TableCell className="whitespace-nowrap text-xs">
                      <div className="flex flex-col">
                        <span>{format(new Date(a.timestamp), 'MMM d, yyyy')}</span>
                        <span className="text-muted-foreground">{format(new Date(a.timestamp), 'h:mm a')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{a.event_name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">{a.disaster_type}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {a.zone_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{a.structure_address}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Owner: {a.owner_name}
                      </div>
                    </TableCell>
                    <TableCell>{getDamageBadge(a.damage_level)}</TableCell>
                    <TableCell>
                      {a.photo_url ? (
                        <Dialog>
                          <Button variant="ghost" size="sm" asChild className="p-0 h-10 w-10 overflow-hidden rounded-md border group">
                            <button>
                              <img 
                                src={`${serverBaseUrl}${a.photo_url}`} 
                                alt="Damage preview" 
                                className="object-cover h-full w-full group-hover:scale-110 transition-transform"
                              />
                            </button>
                          </Button>
                          <DialogContent className="max-w-3xl">
                            <div className="mt-4 overflow-hidden rounded-lg border">
                              <img 
                                src={`${serverBaseUrl}${a.photo_url}`} 
                                alt="Full size damage" 
                                className="w-full h-auto"
                              />
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground flex justify-between">
                              <span>Reported by {a.reporter_name}</span>
                              <span>{format(new Date(a.timestamp), 'PPP p')}</span>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className="h-10 w-10 bg-muted flex items-center justify-center rounded-md border text-muted-foreground">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                          {a.reporter_name?.charAt(0)}
                        </div>
                        {a.reporter_name}
                      </div>
                    </TableCell>
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
