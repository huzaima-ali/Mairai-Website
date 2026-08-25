"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import {
  partnerCompanyTypeOptions,
  partnerSchema,
  partnerStepFields,
  partnerTypeOptions,
  type PartnerFormValues,
} from "@/lib/validations";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/motion";

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
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="text-sm text-accent">{error}</span> : null}
    </label>
  );
}

export function PartnerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(() => Date.now());

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    mode: "onBlur",
    shouldUnregister: false,
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      website: "",
      country: "",
      partnershipType: undefined,
      companyType: undefined,
      projectSize: "",
      message: "",
      honeypot: "",
      startedAt,
      leadType: "partnership",
    },
  });

  const onSubmit = async (values: PartnerFormValues) => {
    setSubmitError(null);

    const response = await fetch("/api/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, startedAt, leadType: "partnership" }),
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      setSubmitError(result?.error ?? "Something went wrong while sending your message. Please try again.");
      return;
    }

    const nextStartedAt = Date.now();
    setSubmitted(true);
    setStep(0);
    setStartedAt(nextStartedAt);
    reset({
      fullName: "",
      email: "",
      company: "",
      website: "",
      country: "",
      partnershipType: undefined,
      companyType: undefined,
      projectSize: "",
      message: "",
      honeypot: "",
      startedAt: nextStartedAt,
      leadType: "partnership",
    });
  };

  const progress = ((step + 1) / 2) * 100;

  const goNext = async () => {
    const fields = partnerStepFields[step];
    if (!fields) return;
    const valid = await trigger([...fields]);
    if (valid) setStep((current) => Math.min(current + 1, 1));
  };

  if (submitted) {
    return (
      <div className="rounded-[24px] border border-border bg-surface p-6 sm:p-8">
        <CheckCircle2 className="h-8 w-8 text-foreground" aria-hidden />
        <h3 className="mt-4 display text-2xl leading-tight">Thanks for reaching out</h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Your partnership enquiry is in. The Mirai team will review it and follow up.
        </p>
        <button
          type="button"
          className="mt-6 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          onClick={() => setSubmitted(false)}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[24px] border border-border bg-surface p-6 sm:p-8"
      noValidate
    >
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>
            Step {step + 1} of 2: {step === 0 ? "About the company" : "Partnership"}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-border">
          <div className="h-full bg-ink transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
          className="flex flex-col gap-5"
        >
          {step === 0 ? (
            <>
              <Field label="Name" error={errors.fullName?.message}>
                <input className={cn(inputCls(Boolean(errors.fullName)), "h-12")} {...register("fullName")} />
              </Field>
              <Field label="Work email" error={errors.email?.message}>
                <input
                  type="email"
                  className={cn(inputCls(Boolean(errors.email)), "h-12")}
                  {...register("email")}
                />
              </Field>
              <Field label="Company" error={errors.company?.message}>
                <input className={cn(inputCls(Boolean(errors.company)), "h-12")} {...register("company")} />
              </Field>
              <Field label="Website" error={errors.website?.message}>
                <input
                  className={cn(inputCls(Boolean(errors.website)), "h-12")}
                  placeholder="https://"
                  {...register("website")}
                />
              </Field>
              <Field label="Country" error={errors.country?.message}>
                <input className={cn(inputCls(Boolean(errors.country)), "h-12")} {...register("country")} />
              </Field>
            </>
          ) : (
            <>
              <Field label="How would you like to partner?" error={errors.partnershipType?.message}>
                <select className={cn(inputCls(Boolean(errors.partnershipType)), "h-12")} {...register("partnershipType")}>
                  <option value="">Select an option</option>
                  {partnerTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="What does your company primarily do?" error={errors.companyType?.message}>
                <select className={cn(inputCls(Boolean(errors.companyType)), "h-12")} {...register("companyType")}>
                  <option value="">Select an option</option>
                  {partnerCompanyTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Typical project or client size (optional)" error={errors.projectSize?.message}>
                <input className={cn(inputCls(Boolean(errors.projectSize)), "h-12")} {...register("projectSize")} />
              </Field>
              <Field label="What are you looking for in a technology partner?" error={errors.message?.message}>
                <textarea
                  rows={5}
                  className={cn(inputCls(Boolean(errors.message)), "resize-y py-4")}
                  {...register("message")}
                />
              </Field>
            </>
          )}
        </m.div>
      </AnimatePresence>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        {...register("honeypot")}
      />

      {submitError ? <p className="mt-4 text-sm text-accent">{submitError}</p> : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        ) : null}

        {step < 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Explore a Partnership
          </button>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Looking to hire Mirai directly for a project instead? Use the{" "}
        <a href="/#contact" className="underline underline-offset-2 hover:text-foreground">
          client enquiry form
        </a>
        .
      </p>
    </form>
  );
}
