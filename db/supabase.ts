// src/services/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "../src/services/env";

let supabase: ReturnType<typeof createClient> | null = null;

export async function getSupabase() {
  if (!supabase) {
    const env = await loadEnv();
    supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
  }
  return supabase;
}
