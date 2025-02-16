"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, UserCircle, Clock, MapPin } from "lucide-react";

interface ClassDetails {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  room: string;
  previousClasses: {
    date: string;
    topic: string;
    description: string;
  }[];
}

interface ClassCardProps {
  classDetails: ClassDetails;
}

export function ClassCard({ classDetails }: ClassCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className="bg-white cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-black">
          {classDetails.subject}
        </CardTitle>
        <BookOpen className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold text-black">{classDetails.teacher}</div>
        <div className="flex items-center space-x-2 mt-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <p className="text-sm text-gray-600">{classDetails.time}</p>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <p className="text-sm text-gray-600">{classDetails.room}</p>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <h3 className="text-sm font-medium text-black">Previous Classes</h3>
            {classDetails.previousClasses.map((prevClass, index) => (
              <div key={index} className="space-y-1">
                <p className="text-sm font-medium text-black">{prevClass.topic}</p>
                <p className="text-xs text-gray-600">{prevClass.description}</p>
                <p className="text-xs text-gray-500">{prevClass.date}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
