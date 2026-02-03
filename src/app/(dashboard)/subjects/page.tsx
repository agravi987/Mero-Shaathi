"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { AddCard } from "@/components/ui/add-card";
import { GridSkeleton } from "@/components/ui/skeletons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubjectForm } from "@/components/subjects/SubjectForm";

interface Subject {
  _id: string;
  name: string;
  description: string;
  color: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function fetchSubjects() {
    try {
      const res = await fetch("/api/subjects");
      const json = await res.json();
      if (json.success) {
        setSubjects(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function handleCreate(values: any) {
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setOpen(false);
        fetchSubjects(); // Refresh list
      }
    } catch (error) {
      console.error("Failed to create subject", error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Subjects
        </h1>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>
              Create a new subject to track your learning journey.
            </DialogDescription>
          </DialogHeader>
          <SubjectForm onSubmit={handleCreate} />
        </DialogContent>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Skeleton loading state could go here */}
            <div className="h-32 bg-muted rounded-xl animate-pulse"></div>
            <div className="h-32 bg-muted rounded-xl animate-pulse"></div>
            <div className="h-32 bg-muted rounded-xl animate-pulse"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard key={subject._id} subject={subject} />
            ))}
            <DialogTrigger asChild>
              <div className="h-full">
                <AddCard label="Add New Subject" />
              </div>
            </DialogTrigger>
          </div>
        )}
      </Dialog>
    </div>
  );
}
