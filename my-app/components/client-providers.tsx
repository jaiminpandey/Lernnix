'use client'

import { ThemeProvider } from '@/providers/theme-provider'
import { Providers } from "@/providers/providers"
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state listener once
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/');
        } else if (event === 'SIGNED_IN') {
          router.refresh();
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [router]);

  return (
    <Providers>
      <ThemeProvider defaultTheme="dark">
        {children}
        <Toaster />
      </ThemeProvider>
    </Providers>
  );
}