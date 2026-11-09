import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

export const isSupabaseConfigured = Boolean(
  /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supabaseUrl) &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('your-anon-key') &&
  !supabaseAnonKey.includes('******')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type SupabaseCertificate = {
  id: string
  title: string
  org: string
  date: string
  img_url: string
  created_at?: string
}

export type SupabaseProject = {
  id: string
  title: string
  description: string
  tech: string[]
  repo: string
  live?: string
  img_url?: string
  status?: string
  details: string[]
  created_at?: string
}
