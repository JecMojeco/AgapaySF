import logoUrl from "@/assets/AgapaySF.svg";
import { cn } from "@/lib/utils";

export function Logo({ className }) {
  return (
    <img 
      src={logoUrl} 
      alt="AgapaySF Logo" 
      className={cn("h-8 w-auto", className)} 
    />
  );
}
