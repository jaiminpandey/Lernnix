'use client'

import { Button } from "@/components/ui/button"
import { Github } from 'lucide-react'
import GoogleIcon from '@mui/icons-material/Google'
import { ThemeToggle } from '../components/theme-toggle'
import Link from 'next/link'
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, {
        callbackUrl: '/role-selection'
      })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
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
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full bg-background hover:bg-accent text-foreground border border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.5)] hover:shadow-[0_0_20px_rgba(20,184,166,0.7)] transition-all duration-300"
              onClick={() => handleAuth('google')}
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full hover:bg-accent text-foreground border-input hover:border-teal-400 hover:shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-all duration-300"
              onClick={() => handleAuth('github')}
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-teal-400 hover:text-teal-300">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}