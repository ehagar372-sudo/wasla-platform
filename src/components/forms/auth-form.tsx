"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Eye, EyeOff, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useI18n } from "@/lib/i18n/provider";
import { safeNext } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Mode = "sign-in" | "sign-up";
type Notice = { kind: "error" | "success"; text: string } | null;

export function AuthForm({ mode, next }: { mode: Mode; next: string }) {
  const { t } = useI18n();
  const a = t.auth;
  const copy = mode === "sign-in" ? a.signIn : a.signUp;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const target = safeNext(next, "/");

  const schema = useMemo(
    () =>
      z.object({
        fullName:
          mode === "sign-up"
            ? z.string().trim().min(2, a.validation.name).max(100, a.validation.name)
            : z.string().optional(),
        email: z.string().trim().email(a.validation.email),
        password: z.string().min(8, a.validation.password),
      }),
    [mode, a.validation],
  );
  type Values = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { fullName: "", email: "", password: "" } });

  async function onSubmit(values: Values) {
    setNotice(null);
    if (!isSupabaseConfigured) {
      setNotice({ kind: "error", text: a.unconfigured });
      return;
    }
    try {
      const supabase = createClient();

      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
        if (error) {
          setNotice({ kind: "error", text: a.signIn.invalid });
          return;
        }
        router.replace(target);
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { display_name: values.fullName?.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(target)}`,
        },
      });
      if (error) {
        setNotice({ kind: "error", text: a.signUp.error });
        return;
      }
      // Supabase returns an empty identities list when the email already exists (anti-enumeration behaviour).
      if (data.user && data.user.identities?.length === 0) {
        setNotice({ kind: "error", text: a.signUp.exists });
        return;
      }
      if (data.session) {
        router.replace(target);
        router.refresh();
        return;
      }
      setNotice({ kind: "success", text: a.signUp.checkEmail });
    } catch {
      setNotice({ kind: "error", text: a.genericError });
    }
  }

  const switchHref = `${mode === "sign-in" ? "/sign-up" : "/sign-in"}${target !== "/" ? `?next=${encodeURIComponent(target)}` : ""}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {!isSupabaseConfigured && (
        <p role="alert" className="flex items-start gap-3 rounded-2xl bg-warning/15 p-4 text-sm leading-7">
          <TriangleAlert className="mt-1 size-4 shrink-0 text-warning" aria-hidden="true" />
          {a.unconfigured}
        </p>
      )}

      {mode === "sign-up" && (
        <div>
          <label htmlFor="fullName" className="field-label">
            {a.fullName}
          </label>
          <input
            id="fullName"
            autoComplete="name"
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className="field"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="mt-1.5 text-sm font-semibold text-danger">
              {errors.fullName.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="email" className="field-label">
          {a.email}
        </label>
        <input
          id="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="field text-start"
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1.5 text-sm font-semibold text-danger">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          {a.password}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "password-error" : "password-hint"}
            className="field pe-12 text-start"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? a.hidePassword : a.showPassword}
            aria-pressed={showPassword}
            className="absolute end-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-lavender hover:text-text"
          >
            {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
          </button>
        </div>
        {errors.password ? (
          <p id="password-error" role="alert" className="mt-1.5 text-sm font-semibold text-danger">
            {errors.password.message}
          </p>
        ) : (
          mode === "sign-up" && (
            <p id="password-hint" className="mt-1.5 text-sm text-muted">
              {a.passwordHint}
            </p>
          )
        )}
      </div>

      {notice && (
        <p
          role={notice.kind === "success" ? "status" : "alert"}
          className={
            notice.kind === "success"
              ? "flex items-start gap-3 rounded-2xl bg-success/15 p-4 leading-7"
              : "flex items-start gap-3 rounded-2xl bg-danger/15 p-4 leading-7"
          }
        >
          {notice.kind === "success" ? (
            <CheckCircle2 className="mt-1 size-5 shrink-0 text-success" aria-hidden="true" />
          ) : (
            <TriangleAlert className="mt-1 size-5 shrink-0 text-danger" aria-hidden="true" />
          )}
          {notice.text}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? copy.submitting : copy.submit}
      </Button>

      <p className="text-center text-muted">
        {mode === "sign-in" ? a.signIn.noAccount : a.signUp.haveAccount}{" "}
        <Link href={switchHref} className="font-bold text-accent hover:underline">
          {mode === "sign-in" ? a.signIn.toSignUp : a.signUp.toSignIn}
        </Link>
      </p>
    </form>
  );
}
