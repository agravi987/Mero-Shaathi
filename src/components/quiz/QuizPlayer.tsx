"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Timer, ArrowRight, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  _id: string;
  type: "mcq" | "trueFalse" | "fillBlank";
  question: string;
  options?: string[];
  correctAnswer: string;
  marks: number;
}

interface QuizPlayerProps {
  quizId: string;
  topicId: string;
  questions: Question[];
  timeLimit: number; // Seconds
  onComplete: (results: any) => void;
}

export function QuizPlayer({
  quizId,
  topicId,
  questions,
  timeLimit,
  onComplete,
}: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); // Immediate feedback mode logic (optional)

  // Timer logic
  useEffect(() => {
    if (timeLimit <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: value,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Transform answers to expected format
    const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
      questionId: qId,
      userAnswer: val,
      timeTaken: 0, // We could track per-question time in future
    }));

    onComplete({
      answers: formattedAnswers,
      timeTaken: timeLimit > 0 ? timeLimit - timeLeft : 0, // Approx total time
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <Progress value={progress} className="w-64 h-2" />
        </div>
        {timeLimit > 0 && (
          <div
            className={cn(
              "flex items-center gap-2 font-mono text-xl font-bold",
              timeLeft < 60 ? "text-destructive" : "text-primary"
            )}
          >
            <Timer className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Question Card */}
      <Card className="min-h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          {currentQuestion.type === "mcq" && currentQuestion.options && (
            <RadioGroup
              value={answers[currentQuestion._id] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQuestion.options.map((opt, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors",
                    answers[currentQuestion._id] === opt &&
                      "border-primary bg-primary/5"
                  )}
                >
                  <RadioGroupItem value={opt} id={`opt-${i}`} />
                  <Label
                    htmlFor={`opt-${i}`}
                    className="flex-1 cursor-pointer font-normal text-base"
                  >
                    {opt}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === "trueFalse" && (
            <RadioGroup
              value={answers[currentQuestion._id] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {["True", "False"].map((opt) => (
                <div
                  key={opt}
                  className={cn(
                    "flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors",
                    answers[currentQuestion._id] === opt &&
                      "border-primary bg-primary/5"
                  )}
                >
                  <RadioGroupItem value={opt} id={`opt-${opt}`} />
                  <Label
                    htmlFor={`opt-${opt}`}
                    className="flex-1 cursor-pointer font-normal text-base"
                  >
                    {opt}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === "fillBlank" && (
            <div className="pt-4">
              <Input
                value={answers[currentQuestion._id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="text-lg p-6"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion._id]} // Force answer? Optional.
          >
            {currentIndex === questions.length - 1 ? (
              <>
                Submit Quiz <Save className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next Question <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
