"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomBadge } from "@/components/ui/custom-badge";
import { 
  BookOpen, 
  CheckCircle2, 
  Copy, 
  Users,
  Video as VideoIcon,
  PlayCircle, 
  Upload, 
  FileUp, 
  Download,
  FileText,
  BookOpen as BookOpenIcon,  
  Share2,
  Calendar,
  XCircle,
  BarChart2,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClass, getTeacherClasses, createLiveClass, getLiveClasses } from "@/lib/teacherApi";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { VideoRoom } from "@/components/VideoRoom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useToast } from "@/components/ui/use-toast";

interface Class {
  id: string;
  name: string;
  subject: string;
  description: string;
  code: string;
  students: number;
  status: 'active' | 'inactive';
}

interface LiveClass {
  id: number;
  title: string;
  class_code: string;
  teacher_id: string;
  status: 'scheduled' | 'live' | 'ended';
  description?: string;
  created_at: string;
}

interface Resource {
  id: number;
  title: string;
  category: 'notes' | 'syllabus' | 'other';
  url: string;
}

interface Student {
  id: number;
  name: string;
  classId: number;
  present: boolean;
}

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
}

export default function TeacherDashboardWrapper() {
  return (
    <ErrorBoundary>
      <TeacherDashboard />
    </ErrorBoundary>
  );
}

function TeacherDashboard() {
  const { data: session, status } = useSession();
  const [classes, setClasses] = useState<Class[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateClassForm, setShowCreateClassForm] = useState(false);
  const [showNewClassCard, setShowNewClassCard] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("");
  const [newClassDescription, setNewClassDescription] = useState("");
  const [formErrors, setFormErrors] = useState({
    name: '',
    subject: '',
    description: ''
  });
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedClass, setSelectedClass] = useState<number>(0);
  const [attendance, setAttendance] = useState({
    date: new Date().toISOString().split('T')[0],
    students: [
      { id: 1, name: "John Doe", classId: 1, present: false },
      { id: 2, name: "Jane Smith", classId: 1, present: false },
    ]
  });
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: "Midterm Assignment",
      dueDate: "2024-03-25",
      submissions: 15,
      totalStudents: 30
    },
    {
      id: 2,
      title: "Final Project",
      dueDate: "2024-04-15",
      submissions: 5,
      totalStudents: 30
    }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [newLiveClass, setNewLiveClass] = useState({
    title: "",
    description: ""
  });

  // Add loading state for initial data fetch
  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.id) {
        if (status !== 'loading') {
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const [classesData, liveClassesData] = await Promise.all([
          getTeacherClasses(session.user.id),
          getLiveClasses(session.user.id)
        ]);

        if (classesData) setClasses(classesData);
        if (liveClassesData) setLiveClasses(liveClassesData);
      } catch (error) {
        console.error('Error loading teacher data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try refreshing the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session, status, toast]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
    .channel('classes-changes')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'classes',
      filter: `teacher_id=eq.${session.user.id}`
    }, (payload: { new: Class }) => {
      console.log('New class payload:', payload); // Log the payload
      const newClass = payload.new as Class; // Type assertion
      setClasses(prev => [...prev, newClass]);
    })
    .subscribe();

    const enrollmentChannel = supabase
    .channel('enrollment-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'class_enrollments'
    }, async () => {
      console.log('Enrollment change detected'); // Log the change
      const classesData = await getTeacherClasses(session.user.id);
      setClasses(classesData);
    })
    .subscribe();

  return () => {
    channel.unsubscribe();
    enrollmentChannel.unsubscribe();
  };
}, [session]);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      subject: '',
      description: ''
    };

    if (!newClassName.trim()) {
      errors.name = 'Class name is required';
      isValid = false;
    } else if (newClassName.length < 3) {
      errors.name = 'Class name must be at least 3 characters';
      isValid = false;
    }

    if (!newClassSubject.trim()) {
      errors.subject = 'Subject is required';
      isValid = false;
    }

    if (!newClassDescription.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    } else if (newClassDescription.length < 10) {
      errors.description = 'Description must be at least 10 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCreateClass = async () => {
    if (!validateForm() || !session?.user?.id) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }
  
    try {
      setIsLoading(true);
      console.log('Attempting to create class with:', {
        teacherId: session.user.id,
        formData: {
          name: newClassName,
          subject: newClassSubject,
          description: newClassDescription,
        }
      });
  
      const newClass = await createClass(session.user.id, {
        name: newClassName,
        subject: newClassSubject,
        description: newClassDescription,
      });
  
      if (newClass) {
        console.log('New class created:', newClass); // Log the new class
        setClasses(prevClasses => [...prevClasses, newClass]);
        toast({
          title: "Success",
          description: `Class "${newClass.name}" created with code: ${newClass.code}`,
        });
        setNewClassName("");
        setNewClassSubject("");
        setNewClassDescription("");
        setFormErrors({ name: '', subject: '', description: '' });
        setShowCreateClassForm(false);
        setShowNewClassCard(true);
  
        setTimeout(() => {
          setShowNewClassCard(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to create class. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyClassCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert('Class code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const startLiveClass = async (classId: string) => {
    try {
      const roomId = `class-${classId}`;
      setActiveRoom(roomId);
      // Update class status to live in Supabase
      await supabase
        .from('live_classes')
        .update({ status: 'live' })
        .eq('id', classId);
    } catch (error) {
      console.error('Error starting live class:', error);
    }
  };

  const endLiveClass = async (classId: string) => {
    try {
      setActiveRoom(null);
      // Update class status to ended in Supabase
      await supabase
        .from('live_classes')
        .update({ status: 'ended' })
        .eq('id', classId);
    } catch (error) {
      console.error('Error ending live class:', error);
    }
  };

  const handleResourceUpload = async (category: 'notes' | 'syllabus' | 'other') => {
    // This would typically open a file picker and handle the upload
    console.log('Uploading resource for category:', category);
  };

  const toggleAttendance = (studentId: number) => {
    setAttendance(prev => ({
      ...prev,
      students: prev.students.map(student =>
        student.id === studentId
          ? { ...student, present: !student.present }
          : student
      )
    }));
  };

  const handleFileUpload = async (category: 'notes' | 'syllabus' | 'other', file: File) => {
    if (!file || !session?.user?.id) return;

    setIsUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
      
      if (!fileExt || !allowedTypes.includes(fileExt)) {
        throw new Error('Invalid file type. Please upload PDF, DOC, or image files.');
      }

      const filePath = `${session.user.id}/${category}/${Math.random().toString(36).slice(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-materials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: resourceData, error: resourceError } = await supabase
        .from('resources')
        .insert([{
          title: file.name,
          category,
          url: filePath,
          teacher_id: session.user.id,
          file_type: fileExt
        }])
        .select()
        .single();

      if (resourceError) throw resourceError;

      setResources(prev => [...prev, resourceData]);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleCreateLiveClass = async () => {
    if (!session?.user?.id || !newLiveClass.title) return;

    try {
      const newClass = await createLiveClass(session.user.id, {
        title: newLiveClass.title
      });
      
      setLiveClasses(prev => [...prev, newClass]);
      setNewLiveClass({ title: "", description: "" });
      toast({
        title: "Success",
        description: "Live class created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create live class",
        variant: "destructive"
      });
    }
  };

  // Update loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
          <p className="text-foreground">Please sign in to access the teacher dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">👨‍🏫 Teacher Dashboard</h1>
          <Button onClick={() => setShowCreateClassForm(true)} className="bg-primary">
            <BookOpen className="h-4 w-4 mr-2" />
            Create New Class
          </Button>
        </div>

        <Tabs defaultValue="classes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            <TabsTrigger value="live">Live & Recordings</TabsTrigger>
            <TabsTrigger value="materials">Course Materials</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            {showNewClassCard && (
              <Card className="mb-6 bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    New Class Created Successfully!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700">Your new class has been created and is now available in the list below.</p>
                </CardContent>
              </Card>
            )}

            {showCreateClassForm && (
              <Card className="mb-6 bg-white" id="createClassForm">
                <CardHeader>
                  <CardTitle className="text-black">Create New Class</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Class Name"
                        value={newClassName}
                        onChange={(e) => {
                          setNewClassName(e.target.value);
                          if (formErrors.name) {
                            setFormErrors(prev => ({ ...prev, name: '' }));
                          }
                        }}
                        className={cn(
                          "text-black placeholder:text-gray-500",
                          formErrors.name && "border-red-500"
                        )}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-500">{formErrors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        placeholder="Subject"
                        value={newClassSubject}
                        onChange={(e) => {
                          setNewClassSubject(e.target.value);
                          if (formErrors.subject) {
                            setFormErrors(prev => ({ ...prev, subject: '' }));
                          }
                        }}
                        className={cn(
                          "text-black placeholder:text-gray-500",
                          formErrors.subject && "border-red-500"
                        )}
                      />
                      {formErrors.subject && (
                        <p className="text-xs text-red-500">{formErrors.subject}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        placeholder="Description"
                        value={newClassDescription}
                        onChange={(e) => {
                          setNewClassDescription(e.target.value);
                          if (formErrors.description) {
                            setFormErrors(prev => ({ ...prev, description: '' }));
                          }
                        }}
                        className={cn(
                          "text-black placeholder:text-gray-500",
                          formErrors.description && "border-red-500"
                        )}
                      />
                      {formErrors.description && (
                        <p className="text-xs text-red-500">{formErrors.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={handleCreateClass} 
                      className="bg-primary"
                      disabled={!newClassName || !newClassSubject || !newClassDescription}
                    >
                      Create Class
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowCreateClassForm(false);
                        setFormErrors({ name: '', subject: '', description: '' });
                        setNewClassName('');
                        setNewClassSubject('');
                        setNewClassDescription('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <Card key={cls.id} className={cn(
                  "hover:shadow-lg transition-shadow bg-white",
                  classes[classes.length - 1]?.id === cls.id && showNewClassCard && "border-green-400 shadow-lg"
                )}>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-black">{cls.name}</CardTitle>
                    <CustomBadge variant="secondary">{cls.subject}</CustomBadge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-black mb-2">{cls.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-black">{cls.students} students</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyClassCode(cls.code)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {cls.code}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="live">
            <div className="grid grid-cols-1 gap-6">
              {activeRoom ? (
                <VideoRoom
                  roomId={activeRoom}
                  onLeave={() => {
                    const classId = activeRoom.replace('class-', '');
                    endLiveClass(classId);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-2 text-black">
                        <div className="flex items-center">
                          <VideoIcon className="h-5 w-5 text-red-500 mr-2" />
                          Live Classes
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowCreateClassForm(true)}
                        >
                          Create Live Class
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {showCreateClassForm && (
                        <div className="mb-4 p-4 border rounded-lg">
                          <Input
                            placeholder="Class Title"
                            value={newLiveClass.title}
                            onChange={(e) => setNewLiveClass(prev => ({ ...prev, title: e.target.value }))}
                            className="mb-2 text-black"
                          />
                          <Input
                            placeholder="Description (optional)"
                            value={newLiveClass.description}
                            onChange={(e) => setNewLiveClass(prev => ({ ...prev, description: e.target.value }))}
                            className="mb-4 text-black"
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleCreateLiveClass}
                              disabled={!newLiveClass.title}
                            >
                              Create
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowCreateClassForm(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                      <ScrollArea className="h-[300px] pr-4">
                        {liveClasses.map((session) => (
                          <div key={session.id} className="mb-4 p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium text-black">{session.title}</h3>
                                <p className="text-sm text-black">Code: {session.class_code}</p>
                              </div>
                              {session.status === 'live' ? (
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => endLiveClass(session.id.toString())}
                                >
                                  End Live
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => startLiveClass(session.id.toString())}
                                >
                                  Start Class
                                </Button>
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
                        <Upload className="h-5 w-5 text-blue-500" />
                        Recording Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-black">
                            Upload recorded lecture videos
                          </p>
                          <Button variant="outline" size="sm" className="mt-4">
                            Choose File
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-black">Recent Recordings</h4>
                          <div className="space-y-2">
                            {/* Recordings list will go here */}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="materials">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Class Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload('notes', file);
                          }
                        }}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingFile}
                      >
                        <FileUp className="h-4 w-4 mr-2" />
                        {isUploadingFile ? 'Uploading...' : 'Upload Notes'}
                      </Button>
                    </div>
                    <ScrollArea className="h-[200px]">
                      {resources
                        .filter(r => r.category === 'notes')
                        .map(resource => (
                          <div key={resource.id} className="p-3 border rounded-lg mb-2">
                            <div className="flex justify-between items-center">
                              <span className="text-black">{resource.title}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.open(resource.url)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      }
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <BookOpenIcon className="h-5 w-5 text-green-500" />
                    Syllabus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload('syllabus', file);
                          }
                        }}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingFile}
                      >
                        <FileUp className="h-4 w-4 mr-2" />
                        {isUploadingFile ? 'Uploading...' : 'Upload Syllabus'}
                      </Button>
                    </div>
                    <ScrollArea className="h-[200px]">
                      {resources
                        .filter(r => r.category === 'syllabus')
                        .map(resource => (
                          <div key={resource.id} className="p-3 border rounded-lg mb-2">
                            <div className="flex justify-between items-center">
                              <span className="text-black">{resource.title}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.open(resource.url)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Share2 className="h-5 w-5 text-orange-500" />
                    Additional Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload('other', file);
                          }
                        }}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingFile}
                      >
                        <FileUp className="h-4 w-4 mr-2" />
                        {isUploadingFile ? 'Uploading...' : 'Upload Resource'}
                      </Button>
                    </div>
                    <ScrollArea className="h-[200px]">
                      {resources
                        .filter(r => r.category === 'other')
                        .map(resource => (
                          <div key={resource.id} className="p-3 border rounded-lg mb-2">
                            <div className="flex justify-between items-center">
                              <span className="text-black">{resource.title}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.open(resource.url)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Take Attendance
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <select 
                      className="border rounded-md px-3 py-1"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(Number(e.target.value))}
                    >
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="date"
                      value={attendance.date}
                      onChange={(e) => setAttendance(prev => ({ ...prev, date: e.target.value }))}
                      className="w-40"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendance.students
                    .filter(student => student.classId === selectedClass)
                    .map(student => (
                      <div 
                        key={student.id} 
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span className="font-medium text-black">{student.name}</span>
                        <Button
                          variant={student.present ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleAttendance(student.id)}
                        >
                          {student.present ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          {student.present ? "Present" : "Absent"}
                        </Button>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Active Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="mb-4 p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-black">{assignment.title}</h3>
                            <p className="text-sm text-black">Due: {assignment.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-black">
                              {assignment.submissions}/{assignment.totalStudents}
                            </p>
                            <p className="text-xs text-black">submissions</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <BarChart2 className="h-5 w-5 text-green-500" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-black">Performance charts will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-black">Class Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-black">Attendance chart will be displayed here</p>
                  </div>a
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-black">Student Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-black">Engagement metrics will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-black">Assignment Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-black">Completion rates will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
