import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./config";

/** Supabase client for Client Components (uses the public anon key only). */
export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
