"use client";

import { useState, useEffect } from "react";
import { NotebookSidebar } from "./NotebookSidebar";
import { TiptapEditor } from "./TiptapEditor";
import { Input } from "@/components/ui/input";
import { Loader2, Cloud, Check } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce"; // Assuming this exists or I'll implement a simple one

// Simple debounce hook implementation if not available
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

interface NotebookProps {
  topicId: string;
  initialNotes: any[];
}

export function Notebook({ topicId, initialNotes }: NotebookProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    initialNotes.length > 0 ? initialNotes[0]._id : null,
  );

  const activeNote = notes.find((n) => n._id === activeNoteId);

  // Local state for editing to avoid lag
  const [title, setTitle] = useState(activeNote?.title || "");
  const [content, setContent] = useState(activeNote?.content || "");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );

  // Sync local state when active note changes
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setSaveStatus("saved");
    }
  }, [activeNoteId]); // Only when ID changes, not when local state updates

  // Debounce values to trigger save
  const debouncedTitle = useDebounceValue(title, 1000);
  const debouncedContent = useDebounceValue(content, 1000);

  // Effect to save when debounced values change
  useEffect(() => {
    if (!activeNoteId) return;

    // Check if redundant save
    const currentNote = notes.find((n) => n._id === activeNoteId);
    if (
      currentNote &&
      currentNote.title === debouncedTitle &&
      currentNote.content === debouncedContent
    ) {
      return;
    }

    async function saveNote() {
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/notes/${activeNoteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: debouncedTitle,
            content: debouncedContent,
          }),
        });

        if (res.ok) {
          setSaveStatus("saved");
          // Update local list to reflect changes
          setNotes((prev) =>
            prev.map((n) =>
              n._id === activeNoteId
                ? {
                    ...n,
                    title: debouncedTitle,
                    content: debouncedContent,
                    updatedAt: new Date(),
                  }
                : n,
            ),
          );
        } else {
          setSaveStatus("unsaved");
        }
      } catch (e) {
        console.error(e);
        setSaveStatus("unsaved");
      }
    }

    // Only save if there was a change that isn't already saved
    saveNote();
  }, [debouncedTitle, debouncedContent, activeNoteId]);

  async function createNote() {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          title: "New Page",
          content: "<p>Start writing...</p>",
        }),
      });
      const json = await res.json();
      if (json.success) {
        const newNote = json.data;
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote._id);
        // State updates will follow via useEffect
      }
    } catch (e) {
      alert("Failed to create page");
    }
  }

  async function deleteNote(noteId: string) {
    try {
      await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
      setNotes(notes.filter((n) => n._id !== noteId));
      if (activeNoteId === noteId) {
        setActiveNoteId(null);
      }
    } catch (e) {
      alert("Failed to delete page");
    }
  }

  return (
    <div className="flex bg-background border rounded-lg h-[calc(100vh-10rem)] overflow-hidden shadow-sm">
      {/* Sidebar - 25% width */}
      <div className="w-1/4 min-w-[250px]">
        <NotebookSidebar
          notes={notes}
          activeNoteId={activeNoteId}
          onSelect={setActiveNoteId}
          onCreate={createNote}
          onDelete={deleteNote}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950">
        {activeNoteId ? (
          <div className="flex flex-col h-full">
            {/* Header / Title Input */}
            <div className="flex items-center gap-4 px-6 py-4 border-b">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto"
                placeholder="Page Title"
              />
              <div className="text-muted-foreground whitespace-nowrap">
                {saveStatus === "saving" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {saveStatus === "saved" && (
                  <Cloud className="h-4 w-4 text-green-500" />
                )}
                {saveStatus === "unsaved" && (
                  <span className="text-xs text-red-500">Error saving</span>
                )}
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden p-0">
              <TiptapEditor
                content={content}
                onChange={(html) => setContent(html)}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <p>No page selected</p>
            <p className="text-sm">
              Select a page or create a new one to start writing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
