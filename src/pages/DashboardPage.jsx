import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, 
  FileText, 
  ClipboardList, 
  Users, 
  Contact, 
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <div className="space-y-stack-gap animate-in fade-in duration-700">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">Welcome, {firstName}</h1>
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
          Brgy. San Francisco • Disaster Response
        </p>
      </div>

      <StatsGrid />

      <div className="space-y-element-gap">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant/70">Critical Actions</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {(user?.role === 'Admin' || user?.role === 'Kagawad') && (
            <Link to="/dashboard/assessments/new" className="group">
              <Card className="h-full border-outline-variant/30 hover:border-primary/50 transition-all active:scale-[0.98] shadow-sm bg-white overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <span className="text-sm font-bold text-on-surface leading-tight">New Damage<br/>Assessment</span>
                </CardContent>
              </Card>
            </Link>
          )}
          
          <Link to="/dashboard/evacuations" className="group">
            <Card className="h-full border-outline-variant/30 hover:border-primary/50 transition-all active:scale-[0.98] shadow-sm bg-white overflow-hidden">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  <ClipboardList className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <span className="text-sm font-bold text-on-surface leading-tight">Log Resident<br/>Arrival</span>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/residents" className="group">
            <Card className="h-full border-outline-variant/30 hover:border-primary/50 transition-all active:scale-[0.98] shadow-sm bg-white overflow-hidden">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Contact className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <span className="text-sm font-bold text-on-surface leading-tight">Resident<br/>Directory</span>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/structures" className="group">
            <Card className="h-full border-outline-variant/30 hover:border-primary/50 transition-all active:scale-[0.98] shadow-sm bg-white overflow-hidden">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Building className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <span className="text-sm font-bold text-on-surface leading-tight">Structure<br/>Database</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <Card className="border-none bg-surface-container-low shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface leading-none">Institutional Security</h3>
              <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider mt-1">Data Privacy RA 10173</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>Encrypted Data Sync</span>
              </div>
              <span className="text-primary">Verified</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>Local Government Node</span>
              </div>
              <span>CamSur</span>
            </div>
          </div>

          <Button variant="ghost" className="w-full justify-between mt-4 h-10 rounded-lg text-primary font-bold hover:bg-white" asChild>
            <Link to="/dashboard/reports">
              System Reports
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
