import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseSecret = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseSecret) {
  console.log(supabaseUrl, supabaseSecret);
  throw new Error("Supabase configuration missing – check .env.local");
}

export const supabaseClient = createClient(supabaseUrl, supabaseSecret);
