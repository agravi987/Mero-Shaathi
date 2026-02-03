"use client";

import { useEffect, useState, use } from "react";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { QuizGenerator } from "@/components/quiz/QuizGenerator";
import { AddCard } from "@/components/ui/add-card";
import { GridSkeleton } from "@/components/ui/skeletons";
import { LearningBreadcrumb } from "@/components/ui/learning-breadcrumb";
import { ArrowLeft, Loader2, Trophy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TopicQuizPage({
  params,
}: {
  params: Promise<{ subjectId: string; topicId: string }>;
}) {
  const { subjectId, topicId } = use(params);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [result, setResult] = useState<any>(null); // To show simple result after submit

  const router = useRouter();

  // Fetch quizzes for this topic
  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await fetch(`/api/quizzes?topicId=${topicId}`);
        const json = await res.json();
        if (json.success) {
          setQuizzes(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, [topicId]);

  // Fetch full details (questions) for a specific quiz
  async function startQuiz(quizId: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/quizzes/${quizId}`);
      const json = await res.json();
      if (json.success) {
        setActiveQuiz(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(attemptData: any) {
    // Submit attempt
    try {
      const res = await fetch(`/api/quizzes/${activeQuiz._id}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attemptData),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data); // Show result screen
        setActiveQuiz(null); // Exit player
      }
    } catch (e) {
      console.error("Submission failed", e);
      alert("Failed to submit quiz");
    }
  }

  if (result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="bg-primary/10 p-6 rounded-full">
          <Trophy className="h-16 w-16 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Quiz Completed!</h1>
          <p className="text-muted-foreground">You scored</p>
          <p className="text-5xl font-black text-primary">
            {Math.round(result.percentage)}%
          </p>
          <p className="text-sm text-muted-foreground">
            {result.score}/{result.totalMarks} Points
          </p>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setResult(null)}>
            Back to Quizzes
          </Button>
          <Button onClick={() => router.push(`/subjects/${subjectId}`)}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-8">
        <GridSkeleton count={2} />
      </div>
    );
  }

  if (activeQuiz) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => setActiveQuiz(null)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Quit Quiz
        </Button>
        <QuizPlayer
          quizId={activeQuiz._id}
          topicId={topicId}
          questions={activeQuiz.questions}
          timeLimit={activeQuiz.timeLimit}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <LearningBreadcrumb
          items={[
            { label: "Topic", href: `/subjects/${subjectId}` },
            { label: "Quizzes" },
          ]}
        />
        <h1 className="text-2xl font-bold tracking-tight">Quizzes</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <Card
            key={quiz._id}
            className="hover:border-primary transition-colors cursor-pointer"
            onClick={() => startQuiz(quiz._id)}
          >
            <CardContent className="p-6 flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {quiz.description}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <span className="bg-secondary px-2 py-1 rounded capitalize">
                  {quiz.difficulty}
                </span>
                <span>
                  {quiz.timeLimit
                    ? `${Math.floor(quiz.timeLimit / 60)} Mins`
                    : "No Time Limit"}
                </span>
                <span>{quiz.questions?.length || "N/A"} Questions</span>
              </div>
              <Button className="w-full mt-2">Start Quiz</Button>
            </CardContent>
          </Card>
        ))}
        <div className="h-full min-h-[220px]">
          {/* Wrap AddCard with QuizGenerator logic which currently is a button/dialog combo */}
          {/* We need to refactor QuizGenerator to accept a trigger or just use the card as trigger */}
          <QuizGenerator
            topicId={topicId}
            onQuizGenerated={(id) => startQuiz(id)}
            trigger={<AddCard label="Generate New Quiz" className="h-full" />}
          />
        </div>
      </div>
    </div>
  );
}
