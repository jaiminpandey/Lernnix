import { supabase } from './supabase';
import type { Class, LiveClass, ClassEnrollment } from '@/types/database';

// API Functions
export const createClass = async (
  teacherId: string, 
  formData: { name: string; subject: string; description: string }
): Promise<Class> => {
  const classCode = Math.random().toString(36).slice(2, 8).toUpperCase();
  
  try {
    // Check for existing code using proper query
    const { data: existing } = await supabase
      .from('classes')
      .select('id')
      .eq('code', classCode)
      .maybeSingle();

    const finalCode = existing ? 
      `${classCode}${Math.floor(Math.random() * 100)}` : 
      classCode;

    console.log('Creating class with:', {
      teacherId,
      ...formData,
      code: finalCode
    });

    const { data, error } = await supabase
      .from('classes')
      .insert({
        ...formData,
        teacher_id: teacherId,
        code: finalCode,
        status: 'active',
        students: 0
      })
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from class creation');
    }

    return data;
  } catch (error) {
    console.error('Full error stack:', error);
    throw error;
  }
};

export const getTeacherClasses = async (teacherId: string): Promise<Class[]> => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching classes:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting teacher classes:', error);
    throw error;
  }
};

export const createLiveClass = async (teacherId: string, formData: { title: string; description?: string }): Promise<LiveClass> => {
  const classCode = Math.random().toString(36).slice(2, 8).toUpperCase();

  try {
    // Check for existing code
    const { data: existing } = await supabase
      .from('live_classes')
      .select('id')
      .eq('class_code', classCode)
      .maybeSingle();

    const finalCode = existing ? 
      `${classCode}${Math.floor(Math.random() * 100)}` : 
      classCode;

    const { data, error } = await supabase
      .from('live_classes')
      .insert([{
        title: formData.title,
        description: formData.description,
        teacher_id: teacherId,
        class_code: finalCode,
        status: 'scheduled'
      }])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating live class:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from live class creation');
    }

    return data;
  } catch (error) {
    console.error('Error creating live class:', error);
    throw error;
  }
};

export const getLiveClasses = async (teacherId: string): Promise<LiveClass[]> => {
  try {
    const { data, error } = await supabase
      .from('live_classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching live classes:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting live classes:', error);
    throw error;
  }
};

export const getClassEnrollments = async (classId: string): Promise<ClassEnrollment[]> => {
  try {
    const { data, error } = await supabase
      .from('class_enrollments')
      .select(`
        *,
        users:student_id (
          id,
          name,
          email
        )
      `)
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting class enrollments:', error);
    throw error;
  }
};

export const updateEnrollmentStatus = async (
  enrollmentId: string,
  status: 'active' | 'inactive'
): Promise<ClassEnrollment> => {
  try {
    const { data, error } = await supabase
      .from('class_enrollments')
      .update({ status })
      .eq('id', enrollmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    throw error;
  }
};

export const updateClassStatus = async (classId: string, status: 'active' | 'inactive'): Promise<Class> => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .update({ status })
      .eq('id', classId)
      .select()
      .single();

    if (error) {
      console.error('Error updating class status:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from status update');
    }

    return data;
  } catch (error) {
    console.error('Error updating class status:', error);
    throw error;
  }
};