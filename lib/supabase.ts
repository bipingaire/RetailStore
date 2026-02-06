import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_INTERNAL_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or anon key is missing. Update your environment variables to enable data access."
  );
}

// Singleton instance
let supabaseInstance: SupabaseClient | null = null;

// Create and export a singleton Supabase client
function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      supabaseUrl ?? "http://localhost:54321",
      supabaseAnonKey ?? "public-anon-key",
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    );
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();

