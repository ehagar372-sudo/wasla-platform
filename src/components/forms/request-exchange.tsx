"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, LogIn, Send, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";

type Status = "idle" | "sending" | "success" | "duplicate" | "error";

interface Props {
  listingId: string;
  /** `skills.id` of the requested catalogue skill (what exchange_requests.requested_skill_id references). */
  skillId: string;
  teacherId: string;
  /** Signed-in user's id, or null when signed out. */
  userId: string | null;
  isDemo: boolean;
  supabaseReady: boolean;
}

/**
 * Real exchange request: inserts a row into `exchange_requests` using the signed-in user's session.
 * Row Level Security guarantees only the sender and recipient can ever read it.
 */
export function RequestExchange({ listingId, skillId, teacherId, userId, isDemo, supabaseReady }: Props) {
  const { t } = useI18n();
  const x = t.skill.exchange;
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);

  if (isDemo) return <Note>{x.demo}</Note>;
  if (!supabaseReady) return <Note>{x.unconfigured}</Note>;

  if (!userId) {
    return (
      <div>
        <p className="mb-4 text-muted">{x.signInRequired}</p>
        <Link
          href={`/sign-in?next=${encodeURIComponent(`/skills/${listingId}`)}`}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-fg transition hover:bg-primary-hover"
        >
          <LogIn className="size-4" aria-hidden="true" />
          {x.signIn}
        </Link>
      </div>
    );
  }

  if (userId === teacherId) return <Note>{x.own}</Note>;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length < 10) return setFieldError(x.tooShort);
    if (trimmed.length > 1000) return setFieldError(x.tooLong);
    setFieldError(null);
    setStatus("sending");

    try {
      const supabase = createClient();
      // The live schema has no unique index on pending requests, so check for a duplicate here.
      const { data: existing, error: lookupError } = await supabase
        .from("exchange_requests")
        .select("id")
        .eq("sender_id", userId)
        .eq("recipient_id", teacherId)
        .eq("requested_skill_id", skillId)
        .eq("status", "pending")
        .limit(1);
      if (lookupError) {
        setStatus("error");
        return;
      }
      if (existing && existing.length > 0) {
        setStatus("duplicate");
        return;
      }
      const { error } = await supabase.from("exchange_requests").insert({
        sender_id: userId,
        recipient_id: teacherId,
        requested_skill_id: skillId,
        message: trimmed,
      });
      if (error) {
        setStatus(error.code === "23505" ? "duplicate" : "error");
        return;
      }
      setMessage("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="flex items-start gap-3 rounded-2xl bg-success/15 p-4 leading-7">
        <CheckCircle2 className="mt-1 size-5 shrink-0 text-success" aria-hidden="true" />
        {x.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="exchange-message" className="field-label">
        {x.messageLabel}
      </label>
      <textarea
        id="exchange-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        maxLength={1000}
        placeholder={x.messagePlaceholder}
        aria-invalid={fieldError ? true : undefined}
        aria-describedby={fieldError ? "exchange-error" : undefined}
        className="field resize-y"
      />
      {fieldError && (
        <p id="exchange-error" role="alert" className="mt-2 text-sm font-semibold text-danger">
          {fieldError}
        </p>
      )}
      {(status === "duplicate" || status === "error") && (
        <p role="alert" className="mt-3 flex items-start gap-2 text-sm font-semibold text-danger">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {status === "duplicate" ? x.duplicate : x.error}
        </p>
      )}
      <Button type="submit" disabled={status === "sending"} className="mt-4 w-full" size="lg">
        <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {status === "sending" ? x.sending : x.send}
      </Button>
    </form>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl bg-lavender p-4 leading-7 text-text">{children}</p>;
}
