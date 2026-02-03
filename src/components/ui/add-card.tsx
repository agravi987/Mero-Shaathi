"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddCardProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export function AddCard({ label, onClick, className }: AddCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center justify-center gap-3 p-6 h-full min-h-[160px] cursor-pointer rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 hover:border-primary/50 transition-all duration-300",
        className,
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border shadow-sm group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
        <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">
        {label}
      </span>
    </div>
  );
}
