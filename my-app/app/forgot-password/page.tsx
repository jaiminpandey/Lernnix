'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from '../../components/theme-toggle'
import Link from 'next/link'

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <ThemeToggle />
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">Reset Password</h1>
          <p className="text-muted-foreground">Enter your email to reset your password</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              type="email"
              className="bg-background border-input"
            />
          </div>
          
          <Button 
            className="w-full bg-background hover:bg-accent text-foreground border border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.5)] hover:shadow-[0_0_20px_rgba(20,184,166,0.7)] transition-all duration-300"
          >
            Send Reset Link
          </Button>
        </div>

        <div className="text-center text-sm">
          <Link href="/" className="text-teal-300 hover:text-teal-300">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

