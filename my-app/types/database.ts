export interface Class {
  id: string;
  name: string;
  subject: string;
  description: string;
  teacher_id: string;
  code: string;
  students: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface ClassEnrollment {
  id: string;
  class_id: string;
  student_id: string;
  status: 'active' | 'inactive';
  created_at: string;
  class?: {
    name: string;
    subject: string;
    description: string;
    code: string;
    teacher_id: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LiveClass {
  id: number;
  title: string;
  class_code: string;
  teacher_id: string;
  status: 'scheduled' | 'live' | 'ended';
  description?: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'parent';
  created_at: string;
}