import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, Trash2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
  isLoading = false,
  icon: Icon,
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          button: "destructive",
          iconBg: "bg-destructive/10 text-destructive",
          defaultIcon: Trash2,
        };
      case "warning":
        return {
          button: "default", // Assuming default is blue/primary
          iconBg: "bg-amber-100 text-amber-600",
          defaultIcon: ShieldAlert,
          buttonClass: "bg-amber-600 hover:bg-amber-700",
        };
      case "danger":
        return {
          button: "destructive",
          iconBg: "bg-red-100 text-red-600",
          defaultIcon: AlertTriangle,
        };
      default:
        return {
          button: "default",
          iconBg: "bg-primary/10 text-primary",
          defaultIcon: ShieldAlert,
        };
    }
  };

  const styles = getVariantStyles();
  const DisplayIcon = Icon || styles.defaultIcon;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-2", styles.iconBg)}>
            <DisplayIcon className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="pt-2 text-balance text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:flex-col gap-2 mt-4">
          <Button
            variant={styles.button}
            onClick={onConfirm}
            disabled={isLoading}
            className={cn("w-full h-11 text-sm font-bold gap-2", styles.buttonClass)}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full h-11 text-xs text-muted-foreground"
          >
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
