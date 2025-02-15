'use client'

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Github } from 'lucide-react'
import GoogleIcon from '@mui/icons-material/Google'
import { ThemeToggle } from '../../components/theme-toggle'
import Link from 'next/link'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn("google", { callbackUrl: "/dashboard" })
      if (result?.error) {
        console.warn("Google sign-in failed:", {
          error: result.error,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google authentication failed';
      console.warn('Sign in error:', {
        provider: 'google',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false)
    }
  }

  // Handle GitHub Sign-In
  const handleGitHubSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn("github", { callbackUrl: "/dashboard" })
      if (result?.error) {
        console.warn("GitHub sign-in failed:", {
          error: result.error,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'GitHub authentication failed';
      console.warn('Sign in error:', {
        provider: 'github',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <ThemeToggle />
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">Create Account</h1>
          <p className="text-muted-foreground">Enter your details to get started</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            {/* Google Sign-In */}
            <Button 
              variant="outline" 
              className="w-full bg-background hover:bg-accent text-foreground border border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.5)] hover:shadow-[0_0_20px_rgba(20,184,166,0.7)] transition-all duration-300"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-teal-400 mr-2" />
              ) : (
                <GoogleIcon className="w-5 h-5 mr-2" />
              )}
              Sign up with Google
            </Button>
            
            {/* GitHub Sign-In */}
            <Button 
              variant="outline" 
              className="w-full hover:bg-accent text-foreground border-input hover:border-teal-400 hover:shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-all duration-300"
              onClick={handleGitHubSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-teal-400 mr-2" />
              ) : (
                <Github className="w-5 h-5 mr-2" />
              )}
              Sign up with GitHub
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/" className="text-teal-300 hover:text-teal-300">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
