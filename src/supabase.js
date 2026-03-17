import { createClient } from "@supabase/supabase-js";

const url  = "https://hagdzpwaeodzodosfhng.supabase.co";
const key  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZ2R6cHdhZW9kem9kb3NmaG5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Mzg5NTUsImV4cCI6MjA4OTMxNDk1NX0.7cP9XxPrGSObgzYwUfIAsVGASY_clI2PP2x6Anvkq_Q";

export const supabase = url && key ? createClient(url, key) : null;
