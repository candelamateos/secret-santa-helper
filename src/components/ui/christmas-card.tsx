import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ChristmasCardProps {
  children: ReactNode;
  className?: string;
}

export const ChristmasCard = ({ children, className }: ChristmasCardProps) => {
  return (
    <div 
      className={cn(
        "bg-card rounded-xl shadow-lg border-2 border-border p-8",
        className
      )}
    >
      {children}
    </div>
  );
};
