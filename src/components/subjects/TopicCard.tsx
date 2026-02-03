import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, BrainCircuit } from "lucide-react";
import Link from "next/link";

interface TopicCardProps {
  topic: {
    _id: string;
    subjectId: string;
    name: string;
    description: string;
    tags: string[];
    // We could add counts of notes/quizzes if available
  };
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{topic.name}</CardTitle>
          <div className="flex gap-1 flex-wrap justify-end">
            {topic.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] px-1 py-0 h-5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {topic.description || "No description."}
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" className="flex-1" asChild>
            <Link href={`/subjects/${topic.subjectId}/${topic._id}/notes`}>
              <FileText className="mr-2 h-3 w-3" /> Notes
            </Link>
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/subjects/${topic.subjectId}/${topic._id}/quiz`}>
              <BrainCircuit className="mr-2 h-3 w-3" /> Quiz
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
