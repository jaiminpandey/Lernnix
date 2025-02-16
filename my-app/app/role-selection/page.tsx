'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"
import { ThemeToggle } from '@/components/theme-toggle'
import { supabase } from '@/lib/supabase'

export default function RoleSelection() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/')
    },
  })

  const handleRoleSelection = async (role: 'student' | 'teacher' | 'parent') => {
    if (!session?.user?.id) return;

    try {
      // Update user role in Supabase
      const { error } = await supabase
        .from('users')
        .update({ role: role })
        .eq('id', session.user.id);

      if (error) throw error;

      // Redirect based on role
      const routes = {
        student: "/dashboard/stupage",
        teacher: "/dashboard/teacherpage",
        parent: "/dashboard/parentpage"
      };

      router.push(routes[role]);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <ThemeToggle />
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Select Your Role</h2>
          <p className="text-muted-foreground">Choose how you want to use the platform</p>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full border-teal-400 hover:bg-teal-400 hover:text-white transition-all"
              onClick={() => handleRoleSelection("student")}
            >
              🎓 Student
            </Button>

            <Button 
              variant="outline" 
              className="w-full border-blue-400 hover:bg-blue-400 hover:text-white transition-all"
              onClick={() => handleRoleSelection("teacher")}
            >
              📚 Teacher
            </Button>

            <Button 
              variant="outline" 
              className="w-full border-purple-400 hover:bg-purple-400 hover:text-white transition-all"
              onClick={() => handleRoleSelection("parent")}
            >
              👨‍👩‍👦 Parent
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
