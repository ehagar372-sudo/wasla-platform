import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getI18n } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeNext } from "@/lib/utils";
import { AuthForm } from "@/components/forms/auth-form";
import { AuthShell } from "@/components/forms/auth-shell";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.signUp.metaTitle };
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function SignUpPage({ searchParams }: Props) {
  const params = await searchParams;
  const { t } = await getI18n();
  const raw = Array.isArray(params.next) ? params.next[0] : params.next;
  const next = safeNext(raw, "/");

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect(next);
  }

  return (
    <AuthShell title={t.auth.signUp.title} text={t.auth.signUp.text}>
      <AuthForm mode="sign-up" next={next} />
    </AuthShell>
  );
}
