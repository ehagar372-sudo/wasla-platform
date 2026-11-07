"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Send, TriangleAlert } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { submitContact } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";

type Banner = { kind: "success" | "error" | "unconfigured"; text: string } | null;

export function ContactForm() {
  const { t } = useI18n();
  const c = t.contact;
  const [banner, setBanner] = useState<Banner>(null);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, c.validation.name).max(100, c.validation.name),
        email: z.string().trim().email(c.validation.email).max(200, c.validation.email),
        subject: z.string().trim().min(3, c.validation.subject).max(150, c.validation.subject),
        message: z.string().trim().min(10, c.validation.message).max(2000, c.validation.message),
      }),
    [c.validation],
  );
  type Values = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", subject: "", message: "" } });

  async function onSubmit(values: Values) {
    setBanner(null);
    const result = await submitContact(values);
    if (result === "success") {
      reset();
      setBanner({ kind: "success", text: c.success });
    } else if (result === "unconfigured") {
      setBanner({ kind: "unconfigured", text: c.unconfigured });
    } else {
      setBanner({ kind: "error", text: c.error });
    }
  }

  const field = (id: keyof Values, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={errors[id] ? true : undefined}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        className="field"
        {...props}
        {...register(id)}
      />
      {errors[id] && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-semibold text-danger">
          {errors[id]?.message}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-5 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", c.name, { autoComplete: "name" })}
        {field("email", c.email, { type: "email", autoComplete: "email", dir: "ltr", className: "field text-start" })}
      </div>
      {field("subject", c.subject)}
      <div>
        <label htmlFor="message" className="field-label">
          {c.message}
        </label>
        <textarea
          id="message"
          rows={6}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="field resize-y"
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1.5 text-sm font-semibold text-danger">
            {errors.message.message}
          </p>
        )}
      </div>

      {banner && (
        <p
          role={banner.kind === "success" ? "status" : "alert"}
          className={
            banner.kind === "success"
              ? "flex items-start gap-3 rounded-2xl bg-success/15 p-4 leading-7"
              : "flex items-start gap-3 rounded-2xl bg-warning/15 p-4 leading-7"
          }
        >
          {banner.kind === "success" ? (
            <CheckCircle2 className="mt-1 size-5 shrink-0 text-success" aria-hidden="true" />
          ) : (
            <TriangleAlert className="mt-1 size-5 shrink-0 text-warning" aria-hidden="true" />
          )}
          {banner.text}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {isSubmitting ? c.sending : c.send}
      </Button>
    </form>
  );
}
