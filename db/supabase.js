import { createClient } from "@supabase/supabase-js";


const url = window.__ENV__?.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
console.log(url);
const key = window.__ENV__?.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);
