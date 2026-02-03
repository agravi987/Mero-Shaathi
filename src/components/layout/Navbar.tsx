"use client";

import { MobileSidebar } from "./Sidebar";
import { GraduationCap, User } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

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
        {user ? (
          <Link
            href="/profile"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="text-sm font-medium text-muted-foreground mr-2 hidden md:block">
              Welcome back, {user.name?.split(" ")[0]}! 👋
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <div className="text-sm font-medium text-muted-foreground mr-2">
            Welcome! 👋
          </div>
        )}
        <ModeToggle />
      </div>
    </header>
  );
}
