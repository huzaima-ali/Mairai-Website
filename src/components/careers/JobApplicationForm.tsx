"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  isAllowedCvFile,
  jobApplicationFieldsSchema,
  type JobApplicationFields,
} from "@/lib/job-application";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-xl border bg-surface px-6 text-[15px] text-foreground transition-all duration-200 placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-offset-0";

function inputCls(hasError: boolean) {
  return cn(
    inputBase,
    hasError ? "border-accent/60 focus:ring-accent/20" : "border-border focus:border-foreground/30 focus:ring-foreground/10",
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && !error ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      {error ? <span className="text-sm text-accent">{error}</span> : null}
    </label>
  );
}

export function JobApplicationForm({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());
  const lock = useRef(false);
  const cvInput = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobApplicationFields>({
    resolver: zodResolver(jobApplicationFieldsSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
      links: "",
      jobId,
      jobTitle,
      honeypot: "",
      startedAt,
    },
  });

  const busy = isSubmitting;

  const onSubmit = async (values: JobApplicationFields) => {
    if (lock.current) return;
    setSubmitError(null);
    setCvError(null);

    const file = cvInput.current?.files?.[0];
    if (!file) {
      setCvError("Please attach your CV as a PDF, DOC, or DOCX file.");
      return;
    }
    const cvCheck = isAllowedCvFile(file);
    if (!cvCheck.ok) {
      setCvError(cvCheck.error);
      return;
    }

    lock.current = true;
    const body = new FormData();
    body.set("fullName", values.fullName);
    body.set("email", values.email);
    body.set("message", values.message);
    body.set("links", values.links || "");
    body.set("jobId", jobId);
    body.set("jobTitle", jobTitle);
    body.set("honeypot", values.honeypot || "");
    body.set("startedAt", String(startedAt));
    body.set("cv", file);

    try {
      const response = await fetch("/api/careers/apply", { method: "POST", body });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        setSubmitError(result?.error ?? "Something went wrong while sending your application. Please try again.");
        return;
      }
      setSubmitted(true);
    } finally {
      lock.current = false;
    }
  };

  if (submitted) {
    return (
      <div className="rounded-[24px] border border-border bg-surface p-6 sm:p-8" role="status">
        <CheckCircle2 className="h-8 w-8 text-foreground" aria-hidden />
        <h3 className="mt-4 display text-2xl leading-tight">Application received</h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Thanks for applying to {jobTitle}. We have your details and CV, and the Mirai team will be in touch if
          there is a fit.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[24px] border border-border bg-surface p-6 sm:p-8"
      noValidate
    >
      <h2 className="display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">Apply</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        Share your background, a cover note, and your CV. Applications go to the Mirai careers inbox.
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <Field label="Full name" error={errors.fullName?.message}>
          <input className={cn(inputCls(Boolean(errors.fullName)), "h-12")} autoComplete="name" {...register("fullName")} />
        </Field>
        <Field label="Email address" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            className={cn(inputCls(Boolean(errors.email)), "h-12")}
            {...register("email")}
          />
        </Field>
        <Field label="Job title">
          <input className={cn(inputCls(false), "h-12 bg-black/[0.02]")} value={jobTitle} readOnly />
        </Field>
        <Field label="Job ID">
          <input className={cn(inputCls(false), "h-12 bg-black/[0.02] font-mono text-sm")} value={jobId} readOnly />
        </Field>
        <Field
          label="CV / resume"
          error={cvError || undefined}
          hint="PDF, DOC, or DOCX · 5MB max"
        >
          <input
            ref={cvInput}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className={cn(inputCls(Boolean(cvError)), "h-12 py-2.5 file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white")}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                setCvError("Please attach your CV as a PDF, DOC, or DOCX file.");
                return;
              }
              const check = isAllowedCvFile(file);
              setCvError(check.ok ? null : check.error);
            }}
          />
        </Field>
        <Field
          label="Relevant links"
          error={errors.links?.message}
          hint="LinkedIn, portfolio, GitHub, or personal site"
        >
          <textarea rows={3} className={cn(inputCls(Boolean(errors.links)), "resize-y py-4")} {...register("links")} />
        </Field>
        <Field label="Cover message" error={errors.message?.message}>
          <textarea rows={6} className={cn(inputCls(Boolean(errors.message)), "resize-y py-4")} {...register("message")} />
        </Field>
      </div>

      <input type="hidden" {...register("jobId")} />
      <input type="hidden" {...register("jobTitle")} />
      <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        {...register("honeypot")}
      />

      {submitError ? (
        <p className="mt-4 text-sm text-accent" role="alert">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        aria-disabled={busy || undefined}
        title={busy ? "Please wait while we send your application" : undefined}
        className="mt-6 inline-flex h-12 min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden /> : null}
        {busy ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
