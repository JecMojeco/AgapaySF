import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  FileText, 
  ClipboardList, 
  Contact, 
  Building,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertTriangle,
  History,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

export function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, activityRes] = await Promise.all([
          api.get("/reports/summary"),
          api.get("/reports/activity")
        ]);
        setSummary(summaryRes.data);
        setActivity(activityRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Assessment': return <FileText className="w-4 h-4" />;
      case 'Evacuation': return <ClipboardList className="w-4 h-4" />;
      case 'User': return <User className="w-4 h-4" />;
      case 'Resident': return <Contact className="w-4 h-4" />;
      default: return <History className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Welcome, {firstName}!</h1>
          <p className="text-muted-foreground">Here's what's happening in Barangay San Francisco today.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">{user?.role} Portal</span>
            <span className="text-[10px] text-muted-foreground italic">Session Active</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            {firstName[0]}
          </div>
        </div>
      </div>

      {summary?.activeEvent && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600 w-6 h-6" />
            <div>
              <h3 className="font-bold text-red-900">ACTIVE EVENT: {summary.activeEvent.name}</h3>
              <p className="text-sm text-red-700">Status: {summary.activeEvent.status}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-white border-red-200 text-red-700 hover:bg-red-50" asChild>
            <Link to="/events">Manage Event</Link>
          </Button>
        </div>
      )}

      <StatsGrid stats={summary} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-outline-variant/30 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest actions performed in the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Loading activity...</p>
              ) : activity.length > 0 ? (
                activity.slice(0, 10).map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-outline-variant/20 last:border-0">
                    <div className="p-2 rounded-full bg-surface-container-low border border-outline-variant/30">
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.detail}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.user} • {item.timestamp ? formatDistanceToNow(new Date(item.timestamp), { addSuffix: true }) : 'just now'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-outline-variant/30 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Operational tasks.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {(user?.role === 'Admin' || user?.role === 'Kagawad') && (
                <Link to="/assessment/new" className="group">
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center h-full">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant">Assessment</span>
                  </div>
                </Link>
              )}
              <Link to="/evacuation" className="group">
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center h-full">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant">Evacuation</span>
                </div>
              </Link>
              <Link to="/residents" className="group">
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center h-full">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                    <Contact className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant">Lookup</span>
                </div>
              </Link>
              <Link to="/structures" className="group">
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center h-full">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                    <Building className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant">Map</span>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-outline-variant/30 shadow-sm bg-primary/5 border-primary/10 flex flex-col justify-between">
            <CardHeader>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white mb-2">
                <Shield className="w-6 h-6" />
              </div>
              <CardTitle className="text-base">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>All systems operational</span>
              </div>
            </CardContent>
            <CardContent className="pt-0">
              <Button className="w-full bg-white text-primary border-primary/20 hover:bg-primary/5 hover:text-primary shadow-sm text-xs" variant="outline" asChild>
                <Link to="/reports" className="flex items-center gap-2">
                  View Reports
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
