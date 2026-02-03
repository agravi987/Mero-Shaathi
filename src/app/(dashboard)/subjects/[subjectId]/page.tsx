"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { TopicCard } from "@/components/subjects/TopicCard";
import { AddCard } from "@/components/ui/add-card";
import { GridSkeleton } from "@/components/ui/skeletons";
import { LearningBreadcrumb } from "@/components/ui/learning-breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TopicForm } from "@/components/subjects/TopicForm";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Subject {
  _id: string;
  name: string;
  description: string;
  color: string;
}

interface Topic {
  _id: string;
  subjectId: string;
  name: string;
  description: string;
  tags: string[];
}

export default function SubjectDetailPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  // Use React.use() to unwrap params
  const { subjectId } = use(params);

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function fetchData() {
    try {
      // Parallel fetch
      const [subRes, topRes] = await Promise.all([
        fetch(`/api/subjects/${subjectId}`),
        fetch(`/api/topics?subjectId=${subjectId}`),
      ]);

      const subJson = await subRes.json();
      const topJson = await topRes.json();

      if (subJson.success) setSubject(subJson.data);
      if (topJson.success) setTopics(topJson.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [subjectId]);

  async function handleCreate(values: any) {
    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, subjectId }),
      });
      if (res.ok) {
        setOpen(false);
        fetchData(); // Refresh list
      }
    } catch (error) {
      console.error("Failed to create topic", error);
    }
  }

  if (loading)
    return (
      <div className="p-8">
        <GridSkeleton />
      </div>
    );
  if (!subject) return <div className="p-8">Subject not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <LearningBreadcrumb items={[{ label: subject.name }]} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-8 rounded-full"
              style={{ backgroundColor: subject.color }}
            ></div>
            <h1 className="text-3xl font-bold tracking-tight">
              {subject.name}
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground">{subject.description}</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Topic</DialogTitle>
            <DialogDescription>
              Create a topic under {subject.name}.
            </DialogDescription>
          </DialogHeader>
          <TopicForm onSubmit={handleCreate} />
        </DialogContent>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic._id} topic={topic} />
          ))}
          <DialogTrigger asChild>
            <div className="h-full">
              <AddCard label="Create New Topic" />
            </div>
          </DialogTrigger>
        </div>
      </Dialog>
    </div>
  );
}
