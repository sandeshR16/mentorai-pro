import { createClient } from "@supabase/supabase-js";

// Retrieve URL and Anon Key from env or standard defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzODQwMDAsImV4cCI6MjAzMzk2MDAwMH0.placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
