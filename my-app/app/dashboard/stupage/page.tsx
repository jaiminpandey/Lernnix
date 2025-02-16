"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayCircle, Download, MessageCircle, Trophy, Users2, AlertCircle } from "lucide-react";
import { joinClass, getStudentEnrollments, leaveClass } from "@/lib/studentApi";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import type { ClassEnrollment } from "@/types/database";

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
  const { data: session } = useSession();
  const [classCode, setClassCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enrollments, setEnrollments] = useState<ClassEnrollment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [liveSessions] = useState<LiveSession[]>([
    { id: 1, title: "Math - Calculus Basics", startTime: "10:00 AM", isLive: true },
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

  // Fetch student's enrolled classes
  useEffect(() => {
    const loadEnrollments = async () => {
      if (session?.user?.id) {
        try {
          const data = await getStudentEnrollments(session.user.id);
          setEnrollments(data);
        } catch (error) {
          console.error('Error loading enrollments:', error);
          setError('Failed to load your classes');
        }
      }
    };
    
    loadEnrollments();
  }, [session]);

  const handleJoinClass = async () => {
    if (!classCode.trim() || !session?.user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const enrollment = await joinClass(session.user.id, classCode.trim());
      setEnrollments(prev => [...prev, enrollment]);
      setClassCode("");
      toast.success('Successfully joined the class!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to join class';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveClass = async (classId: string) => {
    if (!session?.user?.id) return;
    
    try {
      await leaveClass(session.user.id, classId);
      setEnrollments(prev => prev.filter(e => e.class_id !== classId));
      toast.success('Successfully left the class');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to leave class';
      toast.error(message);
    }
  };

  // ... rest of the existing state ...

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4 text-foreground">🎓 Student Dashboard</h1>

        {/* Join Class Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter class code"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="max-w-xs text-black"
              disabled={isLoading}
            />
            <Button 
              onClick={handleJoinClass} 
              className="bg-primary"
              disabled={isLoading || !classCode.trim()}
            >
              {isLoading ? 'Joining...' : 'Join Class'}
            </Button>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        <Tabs defaultValue="classes" className="space-y-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            <TabsTrigger value="sessions">Live & Recorded</TabsTrigger>
            <TabsTrigger value="interactive">Interactive Learning</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-4">
            {enrollments.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-black text-lg mb-4">You haven't joined any classes yet</p>
                  <p className="text-gray-500 text-sm">Use a class code to join your first class!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrollments.map((enrollment) => (
                  <Card key={enrollment.id} className="hover:shadow-lg transition-shadow bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-black">
                        {enrollment.class?.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-black">
                        {enrollment.class?.subject}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-black mb-4">{enrollment.class?.description}</p>
                      <div className="flex justify-between items-center">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleLeaveClass(enrollment.class_id)}
                        >
                          Leave Class
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
