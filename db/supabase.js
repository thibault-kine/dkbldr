import { createClient } from "@supabase/supabase-js";


const url = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
console.log(url);
const key = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);
