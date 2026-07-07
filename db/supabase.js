import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
// console.log(url);
const key = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;

export const supabase = createClient(url, key);
