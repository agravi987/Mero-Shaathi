"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Trophy,
  Loader2,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (e) {
        console.error("Failed to fetch stats", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Namaste, Friend! 🙏
        </h1>
        <p className="text-muted-foreground">
          Ready to learn something new today? Here is your progress overview.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subjects
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalSubjects || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active subjects</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revisions Due</CardTitle>
            <BrainCircuit
              className={`h-4 w-4 ${stats?.revisionsDue > 0 ? "text-warning-600" : "text-primary"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${stats?.revisionsDue > 0 ? "text-warning-600" : ""}`}
            >
              {stats?.revisionsDue || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Topics need attention
            </p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Accuracy</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.quizAccuracy || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Average score</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.activity && stats.activity.length > 0 ? (
                stats.activity.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm">{item.action}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.subject}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.date
                        ? formatDistanceToNow(new Date(item.date), {
                            addSuffix: true,
                          })
                        : ""}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                  <Activity className="h-8 w-8 opacity-20" />
                  <p>No recent activity using Mero Shaathi yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button className="w-full justify-start" asChild>
              <Link href="/subjects">
                <BookOpen className="mr-2 h-4 w-4" /> Start Studying
              </Link>
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              asChild
            >
              <Link href="/revision">
                <BrainCircuit className="mr-2 h-4 w-4" /> Start Revision Session
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
