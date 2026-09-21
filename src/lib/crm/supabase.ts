import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rbugodtrfebgfprhseei.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJidWdvZHRyZmViZ2ZwcmhzZWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MjUxNzEsImV4cCI6MjEwNTUwMTE3MX0.LdxzSD71jzADk1P3k1e5Pwr4ZBNpj7kCW7e7RrNjx7o";

export const supabase = createClient(supabaseUrl, supabaseKey);
