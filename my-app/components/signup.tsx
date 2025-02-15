'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Github, Chrome } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

export default function SignUp() {
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
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              type="text"
              className="bg-background border-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              type="email"
              className="bg-background border-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="bg-background border-input"
            />
          </div>
          
          <Button 
            className="w-full bg-background hover:bg-accent text-foreground border border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)] hover:shadow-[0_0_20px_rgba(20,184,166,0.7)] transition-all duration-300"
          >
            Sign Up
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-sm">OR</span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full hover:bg-accent text-foreground border-input hover:border-teal-500 hover:shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-all duration-300"
            >
              <Chrome className="w-5 h-5 mr-2" />
              Sign up with Google
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full hover:bg-accent text-foreground border-input hover:border-teal-500 hover:shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-all duration-300"
            >
              <Github className="w-5 h-5 mr-2" />
              Sign up with GitHub
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/" className="text-teal-500 hover:text-teal-400">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

