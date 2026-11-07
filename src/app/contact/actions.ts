"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(2000),
});

export type ContactResult = "success" | "invalid" | "unconfigured" | "error";

/**
 * Stores the message in the `contact_messages` table. No email is sent: if Supabase isn't
 * connected this returns "unconfigured" so the UI never pretends the message was delivered.
 */
export async function submitContact(input: unknown): Promise<ContactResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return "invalid";
  if (!isSupabaseConfigured) return "unconfigured";

  try {
    const supabase = await createClient();
    // No .select(): the table has an insert-only policy (nobody can read messages through the public API).
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    return error ? "error" : "success";
  } catch {
    return "error";
  }
}
