'use client'

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Github } from 'lucide-react'
import GoogleIcon from '@mui/icons-material/Google'
import { ThemeToggle } from '../../components/theme-toggle'
import Link from 'next/link'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const router = useRouter()

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const result = await signIn("google", { callbackUrl: "/dashboard" })
    if (result?.error) {
      console.error("Google sign-in failed:", result.error)
    }
  }

  // Handle GitHub Sign-In
  const handleGitHubSignIn = async () => {
    const result = await signIn("github", { callbackUrl: "/dashboard" })
    if (result?.error) {
      console.error("GitHub sign-in failed:", result.error)
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
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              Sign up with Google
            </Button>
            
            {/* GitHub Sign-In */}
            <Button 
              variant="outline" 
              className="w-full hover:bg-accent text-foreground border-input hover:border-teal-400 hover:shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-all duration-300"
              onClick={handleGitHubSignIn} 
            >
              <Github className="w-5 h-5 mr-2" />
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
