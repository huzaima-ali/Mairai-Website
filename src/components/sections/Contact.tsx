"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { CONTACT, CONTACT_STEPS } from "@/lib/content";
import { budgetRangeOptions, contactSchema, contactStepFields, serviceOptions, type ContactFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const inputBase =
  "w-full rounded-xl border bg-surface px-6 text-[15px] text-foreground transition-all duration-200 placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-offset-0";

const COUNTRY_CODES = [
  { label: "US/CA +1", value: "+1" },
  { label: "UK +44", value: "+44" },
  { label: "UAE +971", value: "+971" },
  { label: "Saudi +966", value: "+966" },
  { label: "Pakistan +92", value: "+92" },
  { label: "India +91", value: "+91" },
  { label: "Germany +49", value: "+49" },
  { label: "France +33", value: "+33" },
  { label: "Spain +34", value: "+34" },
  { label: "Italy +39", value: "+39" },
  { label: "Netherlands +31", value: "+31" },
  { label: "Australia +61", value: "+61" },
  { label: "Singapore +65", value: "+65" },
  { label: "Turkey +90", value: "+90" },
  { label: "Qatar +974", value: "+974" },
  { label: "Kuwait +965", value: "+965" },
  { label: "Bahrain +973", value: "+973" },
  { label: "Oman +968", value: "+968" },
  { label: "Egypt +20", value: "+20" },
  { label: "South Africa +27", value: "+27" },
  { label: "Brazil +55", value: "+55" },
  { label: "Mexico +52", value: "+52" },
  { label: "Japan +81", value: "+81" },
  { label: "China +86", value: "+86" },
  { label: "South Korea +82", value: "+82" },
] as const;

function inputCls(hasError: boolean) {
  return cn(
    inputBase,
    hasError ? "border-accent/60 focus:ring-accent/20" : "border-border focus:border-foreground/30 focus:ring-foreground/10",
  );
}

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    shouldUnregister: false,
    defaultValues: {
      fullName: "",
      countryCode: "+1",
      phone: "",
      email: "",
      requiredService: undefined,
      budgetRange: undefined,
      message: "",
      website: "",
      startedAt,
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, startedAt }),
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
      countryCode: "+1",
      phone: "",
      email: "",
      requiredService: undefined,
      budgetRange: undefined,
      message: "",
      website: "",
      startedAt: nextStartedAt,
    });
  };

  const values = watch();
  const currentStep = CONTACT_STEPS[step];
  const progress = ((step + 1) / CONTACT_STEPS.length) * 100;

  const goNext = async () => {
    const fields = contactStepFields[step];
    const valid = fields ? await trigger(fields) : true;

    if (valid) {
      setSubmitError(null);
      setStep((current) => Math.min(current + 1, CONTACT_STEPS.length - 1));
    }
  };

  const goBack = () => {
    setSubmitError(null);
    setStep((current) => Math.max(current - 1, 0));
  };

  return (
    <Section id="contact">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div>
            <h2 className="display text-[clamp(2rem,4vw,3rem)] leading-tight">{CONTACT.title}</h2>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground sm:text-lg">{CONTACT.body}</p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <m.div
                  key="ok"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                  className="mt-10 flex min-h-[42rem] flex-col items-start justify-center"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-2xl font-medium text-foreground">Message sent</h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    Thanks for reaching out — we&apos;ll be in touch to schedule your strategy session within 48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setStartedAt(Date.now());
                    }}
                    className="mt-5 text-sm font-medium text-accent hover:underline"
                  >
                    Send another message
                  </button>
                </m.div>
              ) : (
                <m.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="mt-10 flex min-h-[42rem] flex-col gap-5"
                >
                  <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />
                  <input type="hidden" value={startedAt} {...register("startedAt", { valueAsNumber: true })} />

                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{currentStep?.eyebrow}</p>
                        <h3 className="mt-1 text-2xl font-medium tracking-snug text-foreground">{currentStep?.title}</h3>
                        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                          {currentStep?.description}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-ink transition-all duration-500 ease-out-expo"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 0 ? (
                      <m.div
                        key="step-contact"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                        className="grid gap-5"
                      >
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field label="Full Name" htmlFor="fullName" error={errors.fullName?.message}>
                            <input
                              id="fullName"
                              autoComplete="name"
                              placeholder={CONTACT.fullNamePlaceholder}
                              className={cn(inputCls(!!errors.fullName), "h-16")}
                              {...register("fullName")}
                            />
                          </Field>
                          <Field label="Phone Number" htmlFor="phone" error={errors.countryCode?.message ?? errors.phone?.message}>
                            <div
                              className={cn(
                                "flex h-16 items-center rounded-xl border bg-surface pl-3 pr-2 transition-all duration-200 focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-foreground/10",
                                errors.countryCode || errors.phone ? "border-accent/60 focus-within:ring-accent/20" : "border-border",
                              )}
                            >
                              <select
                                aria-label="Country code"
                                className="h-full w-32 bg-transparent text-[15px] text-foreground focus:outline-none"
                                {...register("countryCode")}
                              >
                                {COUNTRY_CODES.map((code) => (
                                  <option key={code.value} value={code.value}>
                                    {code.label}
                                  </option>
                                ))}
                              </select>
                              <span className="mx-4 h-6 w-px bg-border" />
                              <input
                                id="phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder={CONTACT.phonePlaceholder}
                                className="h-full w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                                {...register("phone")}
                              />
                            </div>
                          </Field>
                        </div>

                        <Field label="Email Address" htmlFor="email" error={errors.email?.message}>
                          <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder={CONTACT.emailPlaceholder}
                            className={cn(inputCls(!!errors.email), "h-16")}
                            {...register("email")}
                          />
                        </Field>
                      </m.div>
                    ) : null}

                    {step === 1 ? (
                      <m.div
                        key="step-project"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                        className="grid gap-5"
                      >
                        <Field label="Required service" htmlFor="requiredService" error={errors.requiredService?.message}>
                          <select
                            id="requiredService"
                            className={cn(inputCls(!!errors.requiredService), "h-16")}
                            defaultValue=""
                            {...register("requiredService")}
                          >
                            <option value="" disabled>
                              Select a service
                            </option>
                            {serviceOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field label="Budget range" htmlFor="budgetRange" error={errors.budgetRange?.message}>
                          <select
                            id="budgetRange"
                            className={cn(inputCls(!!errors.budgetRange), "h-16")}
                            defaultValue=""
                            {...register("budgetRange")}
                          >
                            <option value="" disabled>
                              Select your budget range
                            </option>
                            {budgetRangeOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field label={CONTACT.messageLabel} htmlFor="message" error={errors.message?.message}>
                          <textarea
                            id="message"
                            rows={8}
                            placeholder={CONTACT.messagePlaceholder}
                            className={cn(inputCls(!!errors.message), "resize-none py-4")}
                            {...register("message")}
                          />
                        </Field>
                      </m.div>
                    ) : null}

                    {step === 2 ? (
                      <m.div
                        key="step-review"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                        className="rounded-[24px] border border-black/[0.08] bg-[#f5f3f1] p-6"
                      >
                        <h4 className="text-lg font-medium text-foreground">Submission summary</h4>
                        <dl className="mt-5 grid gap-4 text-sm">
                          <ReviewItem label="Name" value={values.fullName} />
                          <ReviewItem label="Email" value={values.email} />
                          <ReviewItem label="Phone" value={`${values.countryCode} ${values.phone}`.trim()} />
                          <ReviewItem label="Required service" value={values.requiredService} />
                          <ReviewItem label="Budget" value={values.budgetRange} />
                          <ReviewItem label="Project" value={values.message} />
                        </dl>
                      </m.div>
                    ) : null}
                  </AnimatePresence>

                  {submitError ? (
                    <m.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-accent/20 bg-accent-soft px-4 py-3 text-sm font-medium text-accent"
                      role="alert"
                    >
                      {submitError}
                    </m.p>
                  ) : null}

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={step === 0 || isSubmitting}
                      className="pill h-14 border border-border bg-background text-foreground transition-all duration-300 hover:border-foreground/40 disabled:opacity-50"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>

                    {step < CONTACT_STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        className="pill h-14 bg-ink text-white transition-all duration-300 hover:shadow-pill"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="pill h-14 bg-ink text-white transition-all duration-300 hover:shadow-pill disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                          </>
                        ) : (
                          CONTACT.submit
                        )}
                      </button>
                    )}
                  </div>
                </m.form>
              )}
            </AnimatePresence>
          </div>

          <div className="relative hidden h-[520px] overflow-hidden rounded-2xl bg-[#f5f3f1] p-4 lg:block lg:h-[680px]">
            <Image
              src="/images/contact-us.png"
              alt="Mirai Studios contact illustration"
              fill
              sizes="50vw"
              className="object-contain"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function ReviewItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border-t border-black/[0.08] pt-4 first:border-t-0 first:pt-0">
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap break-words text-foreground">{value || "Not provided"}</dd>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <m.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs font-medium text-accent"
            role="alert"
          >
            {error}
          </m.span>
        )}
      </AnimatePresence>
    </div>
  );
}
