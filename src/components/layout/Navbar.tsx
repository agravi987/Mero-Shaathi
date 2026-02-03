import { MobileSidebar } from "./Sidebar";
import { GraduationCap } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <div className="flex items-center gap-2 lg:hidden">
        <MobileSidebar />
        <span className="font-bold text-primary flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Mero Shaathi
        </span>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        {/* Add user menu or theme toggle here later */}
        <div className="text-sm font-medium text-muted-foreground mr-2">
          Welcome back, Student! 👋
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
