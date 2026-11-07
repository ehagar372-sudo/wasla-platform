export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True only when real (non-placeholder) Supabase credentials are present. */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("YOUR-PROJECT-REF") &&
    !supabaseAnonKey.startsWith("YOUR-"),
);
