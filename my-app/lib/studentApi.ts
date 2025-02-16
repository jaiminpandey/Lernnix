import { supabase } from './supabase';
import type { ClassEnrollment } from '@/types/database';

export const joinClass = async (studentId: string, classCode: string) => {
  // First find the class with the given code
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('id')
    .eq('code', classCode)
    .single();

  if (classError) throw new Error('Invalid class code');

  // Then create the enrollment
  const { data, error } = await supabase
    .from('class_enrollments')
    .insert([{
      class_id: classData.id,
      student_id: studentId,
      status: 'active'
    }])
    .select(`
      *,
      class:classes (
        name,
        subject,
        description,
        teacher_id
      )
    `);

  if (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('You are already enrolled in this class');
    }
    throw error;
  }

  return data[0];
};

export const getStudentEnrollments = async (studentId: string) => {
  const { data, error } = await supabase
    .from('class_enrollments')
    .select(`
      *,
      class:classes (
        name,
        subject,
        description,
        code,
        teacher_id
      )
    `)
    .eq('student_id', studentId)
    .eq('status', 'active');

  if (error) throw error;
  return data;
};

export const leaveClass = async (studentId: string, classId: string) => {
  const { data, error } = await supabase
    .from('class_enrollments')
    .update({ status: 'inactive' })
    .eq('student_id', studentId)
    .eq('class_id', classId)
    .select();

  if (error) throw error;
  return data[0];
};