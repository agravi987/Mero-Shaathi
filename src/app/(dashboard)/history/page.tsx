"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, FileText, Trophy, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/history");
        const json = await res.json();
        if (json.success) {
          setHistory(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group by date
  const groupedHistory = history.reduce((acc: any, item: any) => {
    const date = format(new Date(item.date), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const dates = Object.keys(groupedHistory).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground">
          Track your learning journey over time.
        </p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {dates.length === 0 ? (
          <p className="text-center text-muted-foreground pl-8">
            No activity recorded yet.
          </p>
        ) : (
          dates.map((date) => (
            <div
              key={date}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Calendar className="w-5 h-5" />
              </div>

              {/* Date Label (Desktop) */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {format(new Date(date), "MMMM do, yyyy")}
                  </div>
                </div>
                <div className="space-y-3">
                  {groupedHistory[date].map((item: any) => (
                    <div
                      key={item.id}
                      className="relative flex flex-col p-4 bg-background border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${item.type === "quiz" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                          >
                            {item.type === "quiz" ? (
                              <Trophy className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">
                              {item.title}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {item.subject}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline">{item.details}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
