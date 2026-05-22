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
import { api } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

export function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchData() {
      try {
        const [summaryData, activityData] = await Promise.all([
          api("/reports/summary"),
          api("/reports/activity")
        ]);
        setSummary(summaryData);
        setActivity(activityData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, authLoading]);

  if (authLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Authenticating...</p>
      </div>
    );
  }

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
    <div className="space-y-section-gap animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">Welcome, {firstName}!</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Here's what's happening in Barangay San Francisco today.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider">{user?.role} Portal</span>
            <span className="text-[10px] text-muted-foreground italic">Session Active</span>
          </div>
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
            {firstName[0]}
          </div>
        </div>
      </div>

      <StatsGrid stats={summary} />

      {summary?.activeEvents?.length > 0 && (
        <div className="space-y-4">
          {summary.activeEvents.map((event) => (
            <div key={event.event_id} className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-red-900 text-sm sm:text-base uppercase tracking-tight">ACTIVE EVENT: {event.event_name}</h3>
                  <p className="text-xs sm:text-sm text-red-700 font-medium">Monitoring in progress</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-white border-red-200 text-red-700 hover:bg-red-50 font-bold" asChild>
                <Link to="/admin/events">Manage Event</Link>
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-outline-variant/30 shadow-sm bg-white overflow-hidden rounded-xl">
            <CardHeader className="pb-3 border-b border-outline-variant/10">
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
              <CardDescription className="text-xs">Latest actions performed in the system.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading activity...</p>
                </div>
              ) : activity.length > 0 ? (
                <div className="divide-y divide-outline-variant/20">
                  {activity.slice(0, 10).map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors">
                      <div className="p-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface-variant/70">
                        {getActivityIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">{item.detail}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium text-primary/70">{item.user_name}</span>
                          <span className="opacity-30">•</span>
                          <span>{item.action_time ? formatDistanceToNow(new Date(item.action_time), { addSuffix: true }) : 'just now'}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <History className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No recent activity found.</p>
                </div>
              )}
            </CardContent>
            {activity.length > 0 && (
              <div className="p-3 bg-muted/20 border-t border-outline-variant/10 text-center">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-primary h-8" asChild>
                  <Link to="/reports">View Full Audit Log</Link>
                </Button>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-outline-variant/30 shadow-sm bg-white overflow-hidden rounded-xl">
            <CardHeader className="pb-3 border-b border-outline-variant/10">
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              <CardDescription className="text-xs">Operational shortcuts.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 p-4">
              {(user?.role === 'Admin' || user?.role === 'Kagawad') && (
                <Link to="/assessments" className="group">
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center h-full min-h-[100px] active:scale-95">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform shadow-sm">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-tight">Assessment</span>
                  </div>
                </Link>
              )}
              <Link to="/evacuation" className="group">
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center h-full min-h-[100px] active:scale-95">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-2 group-hover:scale-110 transition-transform shadow-sm">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-tight">Evacuation</span>
                </div>
              </Link>
              <Link to="/residents" className="group">
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center h-full min-h-[100px] active:scale-95">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform shadow-sm">
                    <Contact className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-tight">Lookup</span>
                </div>
              </Link>
              <Link to="/structures" className="group">
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center h-full min-h-[100px] active:scale-95">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-2 group-hover:scale-110 transition-transform shadow-sm">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-tight">Map</span>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-outline-variant/30 shadow-sm bg-primary/5 border-primary/10 flex flex-col justify-between rounded-xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white mb-2 shadow-md shadow-primary/20">
                <Shield className="w-6 h-6" />
              </div>
              <CardTitle className="text-base font-bold">System Status</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm bg-white/50 w-fit px-3 py-1.5 rounded-full border border-primary/10">
                <CheckCircle className="w-4 h-4" />
                <span>Operational</span>
              </div>
            </CardContent>
            <CardContent className="pt-0 p-4 bg-primary/5 border-t border-primary/10">
              <Button className="w-full bg-white text-primary border-primary/20 hover:bg-primary/5 hover:text-primary shadow-sm text-xs font-bold h-10 active:scale-95" variant="outline" asChild>
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
