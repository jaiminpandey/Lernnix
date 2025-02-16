import { supabase } from '@/lib/supabase';

// Generate unique 6-digit class code
const generateClassCode = () => {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
};

// Teacher Functions
export const teacherApi = {
  createClass: async (teacherId: string, { title, subject, description }: { title: string; subject: string; description?: string }) => {
    const classCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    
    const { data, error } = await supabase
      .from('live_classes')
      .insert([{
        title,
        subject,
        description,
        teacher_id: teacherId,
        class_code: classCode,
        status: 'scheduled'
      }])
      .select()
      .single();

    return { data, error };
  },

  getTeacherClasses: async (teacherId: string) => {
    return await supabase
      .from('live_classes')
      .select(`
        *,
        class_enrollments (
          count
        )
      `)
      .eq('teacher_id', teacherId);
  },

  updateClassStatus: async (classId: string, status: LiveClass['status']) => {
    return await supabase
      .from('live_classes')
      .update({ status })
      .eq('id', classId)
      .select()
      .single();
  }
};

// Student Functions
export const studentApi = {
  joinClass: async (studentId, classCode) => {
    // Get class ID from code
    const { data: classData, error: classError } = await supabase
      .from('live_classes')
      .select('id')
      .eq('class_code', classCode)
      .single()

    if (classError) return { error: 'Invalid class code' }

    // Create enrollment
    const { data, error } = await supabase
      .from('class_enrollments')
      .insert([{
        class_id: classData.id,
        student_id: studentId
      }])

    return { data, error }
  },

  getStudentClasses: async (studentId) => {
    return await supabase
      .from('class_enrollments')
      .select(`
        class_id,
        live_classes!inner(
          id,
          title,
          class_code,
          status,
          created_at
        )
      `)
      .eq('student_id', studentId)
  }
};

export type { LiveClass, ClassEnrollment };