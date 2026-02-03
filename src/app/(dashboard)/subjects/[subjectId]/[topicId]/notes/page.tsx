"use client";

import { useEffect, useState, use } from "react";
import { Notebook } from "@/components/notebook/Notebook";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TopicNotesPage({
  params,
}: {
  params: Promise<{ subjectId: string; topicId: string }>;
}) {
  const { subjectId, topicId } = use(params);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch(`/api/notes?topicId=${topicId}`);
        const json = await res.json();
        if (json.success) {
          setNotes(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [topicId]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-4">
        <Link
          href={`/subjects/${subjectId}`}
          className="text-sm text-muted-foreground flex items-center hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-1 h-3 w-3" /> Back to Topic
        </Link>
        <h1 className="text-lg font-semibold tracking-tight text-muted-foreground">
          Notebook
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Notebook topicId={topicId} initialNotes={notes} />
      )}
    </div>
  );
}
