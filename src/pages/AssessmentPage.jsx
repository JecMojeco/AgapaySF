import { AssessmentStepper } from "@/components/assessment/AssessmentStepper";
import { ClipboardList } from "lucide-react";

export function AssessmentPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">New Damage Assessment</h1>
        </div>
        <p className="text-muted-foreground">Follow the steps below to record damage to a structure.</p>
      </div>

      <AssessmentStepper />
    </div>
  );
}
