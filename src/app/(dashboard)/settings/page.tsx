"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bell, BookOpen, Sparkles, User, LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Study Preferences
  const [dailyGoal, setDailyGoal] = useState("5");
  const [defaultDifficulty, setDefaultDifficulty] = useState("medium");
  const [quizTimeLimit, setQuizTimeLimit] = useState("enabled");

  // Notifications (client-side only for now)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [revisionReminders, setRevisionReminders] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  // AI Preferences
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiQuestionRatio, setAiQuestionRatio] = useState("40");

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and customize your learning experience
        </p>
      </div>

      <Separator />

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your personal details and account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <p className="text-sm text-muted-foreground">
              {session?.user?.name || "Not set"}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email || "Not set"}
            </p>
          </div>
          <Separator />
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-medium">Sign Out</p>
              <p className="text-sm text-muted-foreground">
                Sign out from your account
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Study Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Study Preferences
          </CardTitle>
          <CardDescription>Customize your learning experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Quiz Goal</Label>
              <p className="text-sm text-muted-foreground">
                Number of quizzes you aim to complete daily
              </p>
            </div>
            <Select value={dailyGoal} onValueChange={setDailyGoal}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 quizzes</SelectItem>
                <SelectItem value="5">5 quizzes</SelectItem>
                <SelectItem value="10">10 quizzes</SelectItem>
                <SelectItem value="15">15 quizzes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Default Quiz Difficulty</Label>
              <p className="text-sm text-muted-foreground">
                Preferred difficulty for new quizzes
              </p>
            </div>
            <Select
              value={defaultDifficulty}
              onValueChange={setDefaultDifficulty}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">🟢 Easy</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="hard">🔴 Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Quiz Time Limit</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable time limits during quizzes
              </p>
            </div>
            <Select value={quizTimeLimit} onValueChange={setQuizTimeLimit}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Preferences
          </CardTitle>
          <CardDescription>Configure AI-powered features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable AI Question Generation</Label>
              <p className="text-sm text-muted-foreground">
                Use AI to generate personalized quiz questions
              </p>
            </div>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>

          {aiEnabled && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>AI Question Ratio</Label>
                  <p className="text-sm text-muted-foreground">
                    Percentage of AI-generated questions in quizzes
                  </p>
                </div>
                <Select
                  value={aiQuestionRatio}
                  onValueChange={setAiQuestionRatio}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20%</SelectItem>
                    <SelectItem value="40">40%</SelectItem>
                    <SelectItem value="60">60%</SelectItem>
                    <SelectItem value="80">80%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Revision Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when topics need revision
              </p>
            </div>
            <Switch
              checked={revisionReminders}
              onCheckedChange={setRevisionReminders}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Progress Report</Label>
              <p className="text-sm text-muted-foreground">
                Receive weekly summaries of your learning
              </p>
            </div>
            <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete All Progress Data</p>
              <p className="text-sm text-muted-foreground">
                Clear all quiz attempts and revision history
              </p>
            </div>
            <Button
              variant="outline"
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Clear Data
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
