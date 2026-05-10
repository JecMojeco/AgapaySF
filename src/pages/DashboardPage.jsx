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
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

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

      <StatsGrid />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-outline-variant/30 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Commonly used operational tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {(user?.role === 'Admin' || user?.role === 'Kagawad') && (
              <Link to="/dashboard/assessments/new" className="group">
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center h-full">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant">New Assessment</span>
                </div>
              </Link>
            )}
            <Link to="/dashboard/evacuations" className="group">
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center h-full">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Log Arrival</span>
              </div>
            </Link>
            <Link to="/dashboard/residents" className="group">
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center h-full">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                  <Contact className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Lookup Resident</span>
              </div>
            </Link>
            <Link to="/dashboard/structures" className="group">
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center h-full">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform">
                  <Building className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Map Structures</span>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-outline-variant/30 shadow-sm bg-primary/5 border-primary/10 flex flex-col justify-between">
          <CardHeader>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white mb-2">
              <Shield className="w-6 h-6" />
            </div>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Everything is running smoothly.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-primary font-bold">
              <CheckCircle className="w-5 h-5" />
              <span>All systems operational</span>
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <Button className="w-full bg-white text-primary border-primary/20 hover:bg-primary/5 hover:text-primary shadow-sm" variant="outline" asChild>
              <Link to="/dashboard/reports" className="flex items-center gap-2">
                View System Reports
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
