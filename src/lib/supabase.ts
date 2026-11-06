import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  'https://goeaetvbyhglmrdssift.supabase.co'
).trim()

const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZWFldHZieWhnbG1yZHNzaWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5Nzg2NzQsImV4cCI6MjEwOTU1NDY3NH0.R9tYxU4jq7-cY6HWrB6kbtxnQRJRaFDh3z1Av3tSLVQ'
).trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
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


