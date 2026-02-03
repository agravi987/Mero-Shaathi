"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";
import { GridSkeleton } from "@/components/ui/skeletons";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="p-8">
        <GridSkeleton />
      </div>
    );
  }

  if (!session?.user) {
    return <div className="p-8">Please sign in</div>;
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ST";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          My Profile
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Stats Placeholder (Real stats on Progress page) */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Learning Environment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Isolated Workspace</p>
                <p className="text-sm text-muted-foreground">
                  All your subjects, notes, and progress are private and secure.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              Your account ID:{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                {user.id}
              </code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
