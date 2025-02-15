"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { PlayCircle, Download, MessageCircle, Trophy, Users2 } from "lucide-react";

interface Class {
  id: number;
  name: string;3
  schedule: string;
  updates: string;
}

interface LiveSession {
  id: number;
  title: string;
  startTime: string;
  isLive: boolean;
}

interface RecordedSession {
  id: number;
  title: string;
  duration: string;
  date: string;
}

interface Discussion {
  id: number;
  title: string;
  author: string;
  replies: number;
  lastActive: string;
}

export default function StudentDashboard() {
  const [classCode, setClassCode] = useState("");
  const [classes, setClasses] = useState<Class[]>([
    { id: 1, name: "Math (harsh sir)", schedule: "Mon, tues, Wed - 10 AM To 12 PM", updates: "New assignment posted" },
    { id: 2, name: "History(jaimin sir)", schedule: "Tue, Wed, Thu - 12 PM to 2 PM", updates: "Exam next week!" },
    { id: 3, name: "Civics(Nirav sir)", schedule: "Tue, Wed, Thu - 3 PM to 5 PM", updates: "Exam next week!" },
    { id: 4, name: "English(Niishat sir)", schedule: "Thur, Fri, Sat - 1 PM to 2 PM", updates: "Exam next week!" },
    { id: 5, name: "P.T(Shiavm sir)", schedule: "Fri & Sat - 1 PM 2 PM", updates: "Exam next week!" },
    { id: 6, name: "Physics(Shiavm sir)", schedule: "Fri  & Sat - 4 PM to 5 PM", updates: "Exam next week!" },
  ]);

  const [liveSessions] = useState<LiveSession[]>([
    { id: 1, title: "Math  - Calculus Basics", startTime: "10:00 AM", isLive: true },
    { id: 2, title: "Physics - Quantum Mechanics", startTime: "2:00 PM", isLive: false }
  ]);

  const [recordedSessions] = useState<RecordedSession[]>([
    { id: 1, title: "Introduction to Algebra", duration: "45 min", date: "2024-03-20" },
    { id: 2, title: "Newton's Laws", duration: "60 min", date: "2024-03-19" }
  ]);

  const [discussions] = useState<Discussion[]>([
    { id: 1, title: "Help with Integration", author: "Alex", replies: 5, lastActive: "2 hours ago" },
    { id: 2, title: "Physics Project Group", author: "Sarah", replies: 12, lastActive: "30 min ago" }
  ]);

  const handleJoinClass = () => {
    if (!classCode.trim()) return;
    const newClass: Class = {
      id: classes.length + 1,
      name: `Class ${classCode}`,
      schedule: "TBA",
      updates: "No updates yet"
    };
    setClasses([...classes, newClass]);
    setClassCode("");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4 text-foreground">🎓 Student Dashboard</h1>

        {/* Join Class Section */}
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Enter class code"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={handleJoinClass} className="bg-primary">
            Join Class
          </Button>
        </div>

        <Tabs defaultValue="classes" className="space-y-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            <TabsTrigger value="sessions">Live & Recorded</TabsTrigger>
            <TabsTrigger value="interactive">Interactive Learning</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <Card key={cls.id} className="hover:shadow-lg transition-shadow bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-black">{cls.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-black">📅 Schedule: {cls.schedule}</p>
                    <p className="text-black mt-2">📝 Updates: {cls.updates}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <PlayCircle className="h-5 w-5 text-red-500" />
                    Live Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    {liveSessions.map((session) => (
                      <div key={session.id} className="mb-4 p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-black">{session.title}</h3>
                          {session.isLive ? (
                            <Badge className="bg-red-500">LIVE NOW</Badge>
                          ) : (
                            <span className="text-sm text-black">Starts at {session.startTime}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Download className="h-5 w-5 text-blue-500" />
                    Recorded Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    {recordedSessions.map((session) => (
                      <div key={session.id} className="mb-4 p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-black">{session.title}</h3>
                            <p className="text-sm text-black">{session.date}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interactive">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Your Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge className="mr-2 bg-yellow-500">Perfect Attendance</Badge>
                    <Badge className="mr-2 bg-blue-500">Quiz Master</Badge>
                    <Badge className="mr-2 bg-green-500">Team Player</Badge>
                  </div>
                  <p className="mt-4 text-sm text-black">
                    Keep participating to earn more badges!
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-black">Active Polls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-black">No active polls at the moment</p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-black">Quick Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-black">Next quiz starts in 2 hours</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discussions">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  Discussion Forums
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <div key={discussion.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-black">{discussion.title}</h3>
                          <p className="text-sm text-black">
                            Started by {discussion.author} • {discussion.lastActive}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-black">{discussion.replies} replies</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
