import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

declare global {
  namespace NodeJS {
    interface Global {
      supabaseClient?: ReturnType<typeof createClient<Database>>
    }
  }
}

const globalSupabaseClient = global.supabaseClient

const supabaseClient = globalSupabaseClient || createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

if (process.env.NODE_ENV !== 'production') {
  global.supabaseClient = supabaseClient
}

export { supabaseClient as supabase }