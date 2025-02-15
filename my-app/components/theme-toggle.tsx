'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '../providers/theme-provider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="absolute top-4 right-4"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-[#14b8a5]" />
      ) : (
        <Moon className="h-5 w-5 text-[#14b8a5]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}