import { createClient } from "@supabase/supabase-js";


const url = window._env_.VITE_SUPABASE_URL;
console.log(url);
const key = window._env_.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);
