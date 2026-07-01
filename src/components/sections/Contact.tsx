"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { CONTACT, STATS } from "@/lib/content";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { StatValue } from "@/components/ui/StatValue";

const inputBase =
  "w-full rounded-xl border bg-surface px-6 text-[15px] text-foreground transition-all duration-200 placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-offset-0";

function inputCls(hasError: boolean) {
  return cn(
    inputBase,
    hasError ? "border-accent/60 focus:ring-accent/20" : "border-border focus:border-foreground/30 focus:ring-foreground/10",
  );
}

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: { fullName: "", phone: "", email: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    await new Promise((r) => setTimeout(r, 1200));
    // eslint-disable-next-line no-console
    console.info("Contact submission:", values);
    setSubmitted(true);
    reset();
  };

  return (
    <Section id="contact">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left: copy + form */}
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
                  className="mt-10 flex min-h-[20rem] flex-col items-start justify-center"
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
                    onClick={() => setSubmitted(false)}
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
                  className="mt-10 flex flex-col gap-5"
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
                    <Field label="Phone Number" htmlFor="phone" error={errors.phone?.message}>
                      <div
                        className={cn(
                          "flex h-16 items-center rounded-xl border bg-surface pl-6 pr-2",
                          errors.phone ? "border-accent/60" : "border-border",
                        )}
                      >
                        <span className="text-[15px] text-muted-foreground/70">Code</span>
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

                  <Field label={CONTACT.messageLabel} htmlFor="message" error={errors.message?.message}>
                    <textarea
                      id="message"
                      rows={6}
                      placeholder={CONTACT.messagePlaceholder}
                      className={cn(inputCls(!!errors.message), "resize-none py-4")}
                      {...register("message")}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="pill h-14 w-full bg-ink text-white transition-all duration-300 hover:shadow-pill disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      CONTACT.submit
                    )}
                  </button>
                </m.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right: red stats panel */}
          <div
            className="relative min-h-[420px] overflow-hidden rounded-2xl lg:min-h-full"
            style={{
              background:
                "radial-gradient(130% 120% at 30% 20%, #8a121d 0%, #520a12 42%, #1c0407 72%, #0a0203 100%)",
            }}
          >
            <div aria-hidden className="dot-grid absolute inset-0 text-white/[0.12]" />
            <div className="relative grid h-full grid-cols-2 grid-rows-2">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={cn(
                    "flex flex-col justify-center p-8 sm:p-10",
                    i % 2 === 0 && "border-r border-white/15",
                    i < 2 && "border-b border-white/15",
                  )}
                >
                  <StatValue stat={stat} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
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
