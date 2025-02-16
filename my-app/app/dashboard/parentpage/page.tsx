"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MessageCircle, BookOpen, Bell } from "lucide-react"
import { ClassCard } from '@/components/ClassCard'

const classesData = [
  {
    id: "1",
    subject: "Mathematics",
    teacher: "Dr. Sarah Johnson",
    time: "9:00 AM - 10:30 AM",
    room: "Room 101",
    previousClasses: [
      {
        date: "March 15, 2024",
        topic: "Calculus: Derivatives",
        description: "Covered the basics of derivatives, chain rule, and their applications in real-world problems."
      },
      {
        date: "March 13, 2024",
        topic: "Limits and Continuity",
        description: "Discussed the concept of limits and their role in defining continuous functions."
      }
    ]
  },
  {
    id: "2",
    subject: "Physics",
    teacher: "Prof. Michael Chen",
    time: "11:00 AM - 12:30 PM",
    room: "Lab 203",
    previousClasses: [
      {
        date: "March 14, 2024",
        topic: "Quantum Mechanics",
        description: "Introduction to wave-particle duality and Schrödinger's equation."
      },
      {
        date: "March 12, 2024",
        topic: "Special Relativity",
        description: "Explored Einstein's theory of special relativity and time dilation."
      }
    ]
  },
  {
    id: "3",
    subject: "Computer Science",
    teacher: "Dr. Emily Wright",
    time: "2:00 PM - 3:30 PM",
    room: "Lab 305",
    previousClasses: [
      {
        date: "March 15, 2024",
        topic: "Data Structures",
        description: "Implementation of binary trees and their traversal algorithms."
      },
      {
        date: "March 13, 2024",
        topic: "Algorithm Analysis",
        description: "Big O notation and complexity analysis of common algorithms."
      }
    ]
  }
]

export default function ParentDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gray-900">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Parent Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black">Overview</TabsTrigger>
          <TabsTrigger value="communications" className="data-[state=active]:bg-white data-[state=active]:text-black">Communications</TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:text-black">Reports</TabsTrigger>
          <TabsTrigger value="classes" className="data-[state=active]:bg-white data-[state=active]:text-black">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">
                  Student Attendance
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">95%</div>
                <p className="text-xs text-gray-600">
                  Current Month Attendance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">
                  Academic Performance
                </CardTitle>
                <BookOpen className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">A-</div>
                <p className="text-xs text-gray-600">
                  Average Grade
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">
                  Pending Notifications
                </CardTitle>
                <Bell className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">3</div>
                <p className="text-xs text-gray-600">
                  Unread Messages
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2 bg-white">
              <CardHeader>
                <CardTitle className="text-black">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Math Assignment Submitted",
                      description: "Grade: A | Teacher's Comment: Excellent work!",
                      date: "2 hours ago"
                    },
                    {
                      title: "Science Project Due",
                      description: "Upcoming deadline on Friday",
                      date: "1 day ago"
                    },
                    {
                      title: "Parent-Teacher Meeting",
                      description: "Scheduled for next Tuesday at 3 PM",
                      date: "2 days ago"
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-black">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-black">Teacher Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    teacher: "Ms. Johnson",
                    subject: "Mathematics",
                    message: "Your child has shown great improvement in calculus.",
                    time: "Today at 2:30 PM"
                  },
                  {
                    teacher: "Mr. Smith",
                    subject: "Physics",
                    message: "Please review the upcoming project requirements.",
                    time: "Yesterday at 4:15 PM"
                  }
                ].map((comm, index) => (
                  <div key={index} className="flex items-center space-x-4 rounded-md border p-4">
                    <MessageCircle className="h-5 w-5 text-gray-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-black">{comm.teacher} ({comm.subject})</p>
                      <p className="text-sm text-gray-600">{comm.message}</p>
                      <p className="text-xs text-gray-500">{comm.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-black">Academic Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    subject: "Mathematics",
                    grade: "A",
                    progress: "Excellent",
                    details: "Strong understanding of advanced concepts"
                  },
                  {
                    subject: "Science",
                    grade: "B+",
                    progress: "Good",
                    details: "Consistent performance in experiments"
                  },
                  {
                    subject: "English",
                    grade: "A-",
                    progress: "Very Good",
                    details: "Strong writing skills, could improve vocabulary"
                  }
                ].map((report, index) => (
                  <div key={index} className="flex items-center space-x-4 rounded-md border p-4">
                    <BookOpen className="h-5 w-5 text-gray-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-black">{report.subject}</p>
                      <p className="text-sm text-gray-600">Grade: {report.grade} | Progress: {report.progress}</p>
                      <p className="text-sm text-gray-600">{report.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classesData.map((classDetails) => (
              <ClassCard key={classDetails.id} classDetails={classDetails} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
