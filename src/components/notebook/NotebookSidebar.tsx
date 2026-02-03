"use client";

import { cn } from "@/lib/utils";
import { FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface NotebookSidebarProps {
  notes: any[];
  activeNoteId: string | null;
  onSelect: (noteId: string) => void;
  onCreate: () => void;
  onDelete: (noteId: string) => void;
  className?: string;
}

export function NotebookSidebar({
  notes,
  activeNoteId,
  onSelect,
  onCreate,
  onDelete,
  className,
}: NotebookSidebarProps) {
  const [search, setSearch] = useState("");

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={cn("flex flex-col h-full bg-muted/20 border-r", className)}>
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Pages</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onCreate}
            title="Add Page"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <Input
          placeholder="Search pages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No pages found. <br /> Click + to create one.
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note._id}
                role="button"
                onClick={() => onSelect(note._id)}
                className={cn(
                  "group flex flex-col gap-1 p-3 rounded-md transition-colors hover:bg-muted/50 text-left border border-transparent",
                  activeNoteId === note._id &&
                    "bg-background border-border shadow-sm",
                )}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "font-medium text-sm line-clamp-1",
                      !note.title && "text-muted-foreground italic",
                    )}
                  >
                    {note.title || "Untitled Page"}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Confirm delete?")) onDelete(note._id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="line-clamp-1 w-2/3">
                    {note.content
                      ? note.content.replace(/<[^>]*>/g, "").substring(0, 20) +
                        "..."
                      : "No preview"}
                  </span>
                  <span>
                    {formatDistanceToNow(new Date(note.updatedAt), {
                      addSuffix: false,
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
