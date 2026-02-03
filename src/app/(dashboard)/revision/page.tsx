"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function RevisionPage() {
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRevisions() {
      try {
        const res = await fetch("/api/revision");
        const json = await res.json();
        if (json.success) {
          setRevisions(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchRevisions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Revision Center</h1>
        <p className="text-muted-foreground">
          Based on the forgetting curve, these are the topics you need to review
          today.
        </p>
      </div>

      {revisions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 bg-muted/20 border-dashed border rounded-xl p-8">
          <div className="bg-primary/10 p-4 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold">All Caught Up!</h3>
            <p className="text-muted-foreground max-w-sm">
              You have no pending revisions for today. Consider learning a new
              topic or taking a practice quiz.
            </p>
          </div>
          <Button asChild>
            <Link href="/subjects">Explore Subjects</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {revisions.map((rev) => (
            <Card
              key={rev.quizId}
              className="hover:border-primary/50 transition-colors"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold line-clamp-1">
                    {rev.quiz?.title || "Quiz Revision"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {rev.topic?.name}
                  </p>
                </div>
                <Badge
                  variant={rev.easeFactor < 2.5 ? "destructive" : "secondary"}
                >
                  {rev.easeFactor < 2.5 ? "Hard" : "Normal"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <BrainCircuit className="mr-1 h-3 w-3" />
                    Retention: {Math.round(rev.easeFactor * 20)}%
                  </div>
                  <Button size="sm" asChild>
                    <Link
                      href={`/subjects/${rev.topic?.subjectId}/${rev.topicId}/quiz`}
                    >
                      Revise Now <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
