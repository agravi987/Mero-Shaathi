import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Book } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubjectCardProps {
  subject: {
    _id: string;
    name: string;
    description?: string;
    icon?: string; // We might map string to Icon component
    color?: string;
    topicsCount?: number; // Optional if we populate it
  };
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Color strip */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: subject.color || "#3b82f6" }}
      />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-6">
        <CardTitle className="text-lg font-semibold truncate pr-2">
          {subject.name}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pl-6">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
          {subject.description || "No description provided."}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {subject.topicsCount || 0} Topics
          </Badge>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/subjects/${subject._id}`}>Open</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
