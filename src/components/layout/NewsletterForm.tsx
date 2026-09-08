"use client";

import { useState } from "react";
import { t } from "@/lib/dictionary";
import { cn } from "@/lib/cn";
import { ArrowRightIcon } from "@/components/ui/icons";

type Status = "idle" | "error-empty" | "error-invalid" | "success";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter signup. Client-side validation only for Milestone 1.
 * SWAP POINT: POST to the real list provider / Medusa customer-group endpoint.
 */
export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");

  const message =
    status === "error-empty"
      ? t.newsletter.errorEmpty
      : status === "error-invalid"
        ? t.newsletter.errorInvalid
        : status === "success"
          ? t.newsletter.success
          : null;

  if (status === "success") {
    return (
      <div>
        <p className="label-lg">{t.newsletter.title}</p>
        <p className="label mt-4 max-w-xs text-ink" role="status">
          {t.newsletter.success}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="label-lg">{t.newsletter.title}</p>
      <p className="label mt-3 max-w-xs text-ink-muted">{t.newsletter.prompt}</p>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const value = new FormData(e.currentTarget).get("email")?.toString().trim() ?? "";
          if (!value) return setStatus("error-empty");
          if (!EMAIL_RE.test(value)) return setStatus("error-invalid");
          setStatus("success");
        }}
        className="mt-5 max-w-xs"
      >
        <div className="flex items-center gap-3 border-b border-ink pb-2">
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t.newsletter.placeholder}
            aria-invalid={status.startsWith("error")}
            aria-describedby="newsletter-msg"
            onChange={() => status !== "idle" && setStatus("idle")}
            className="label w-full bg-transparent tracking-label placeholder:text-ink-muted focus:outline-none"
          />
          <button type="submit" aria-label={t.newsletter.submit} className="-m-1 p-1">
            <ArrowRightIcon size={18} />
          </button>
        </div>

        <p
          id="newsletter-msg"
          role={status.startsWith("error") ? "alert" : undefined}
          className={cn(
            "label mt-3 min-h-[1.2em]",
            status.startsWith("error") ? "text-ink" : "text-ink-muted",
          )}
        >
          {message}
        </p>

        <p className="label mt-1 max-w-xs leading-relaxed text-ink-muted">
          {t.newsletter.consent}
        </p>
      </form>
    </div>
  );
}
