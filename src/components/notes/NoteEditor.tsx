"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { Save, Loader2 } from "lucide-react";

interface NoteEditorProps {
  topicId: string;
  initialContent?: string;
  noteId?: string;
}

export function NoteEditor({
  topicId,
  initialContent = "",
  noteId,
}: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // If initialContent changes (e.g. data loaded), update state
  useEffect(() => {
    if (initialContent) setContent(initialContent);
  }, [initialContent]);

  async function handleSave() {
    setIsSaving(true);
    try {
      const url = "/api/notes";
      const method = "POST";

      // In a real app we'd determine if we're updating or creating specific note.
      // For this simple version, let's just create a new note or update if we had an ID.
      // Since our API structure for POST creates a new note, we might want to check if a note exists for this topic first?
      // For now, let's just push content.

      const body = {
        topicId,
        title: "Subject Notes", // Default title for topic notes
        content,
        isImportant: false,
      };

      // Check if we effectively already have a note for this topic?
      // Ideally the parent component handles fetching and passing noteId.

      let finalUrl = url;
      let finalMethod = method;

      if (noteId) {
        finalUrl = `/api/notes/${noteId}`;
        finalMethod = "PUT";
      }

      const res = await fetch(finalUrl, {
        method: finalMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save");

      setLastSaved(new Date());
      // Show toast or feedback
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
      <div className="flex flex-col gap-2 h-full">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-muted-foreground">
            Markdown Input
          </label>
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 font-mono text-sm resize-none p-4"
          placeholder="# Write your notes here...&#10;- Use markdown&#10;- Bullet points&#10;- Code blocks"
        />
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="self-end mt-2"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Notes
        </Button>
      </div>

      <div className="flex flex-col gap-2 h-full">
        <label className="text-sm font-medium text-muted-foreground">
          Preview
        </label>
        <div className="flex-1 bg-muted/30 rounded-md border p-6 overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
          {content ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">
              Preview will appear here...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
