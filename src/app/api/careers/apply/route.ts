import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getPublicJobById } from "@/lib/cms/jobs";
import {
  buildCareerApplicationEmail,
  duplicateSubmissionKey,
  forgetApplicationAttempt,
  isAllowedCvFile,
  jobApplicationFieldsSchema,
  MIN_APPLY_MS,
  rememberApplicationAttempt,
} from "@/lib/job-application";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const parsed = jobApplicationFieldsSchema.safeParse({
    fullName: form.get("fullName"),
    email: form.get("email"),
    message: form.get("message"),
    links: form.get("links") || "",
    jobId: form.get("jobId"),
    jobTitle: form.get("jobTitle"),
    honeypot: form.get("honeypot") || "",
    startedAt: form.get("startedAt"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return NextResponse.json({ error: first || "Please check the form and try again." }, { status: 400 });
  }

  const data = parsed.data;

  if (data.honeypot) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  if (data.startedAt && Date.now() - data.startedAt < MIN_APPLY_MS) {
    return NextResponse.json({ error: "Please wait a moment before submitting." }, { status: 400 });
  }

  const job = await getPublicJobById(data.jobId);
  if (!job || job.status !== "published") {
    return NextResponse.json({ error: "This role is not accepting applications." }, { status: 400 });
  }

  const cv = form.get("cv");
  if (!(cv instanceof File) || cv.size === 0) {
    return NextResponse.json({ error: "Please attach your CV as a PDF, DOC, or DOCX file." }, { status: 400 });
  }

  const cvCheck = isAllowedCvFile({ name: cv.name, type: cv.type, size: cv.size });
  if (!cvCheck.ok) {
    return NextResponse.json({ error: cvCheck.error }, { status: 400 });
  }

  const dupKey = duplicateSubmissionKey(data);
  const dup = rememberApplicationAttempt(dupKey);
  if (dup.duplicate) {
    return NextResponse.json(
      { error: "This application was already submitted. Please wait before trying again." },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    forgetApplicationAttempt(dupKey);
    return NextResponse.json(
      { error: "Careers email is not configured yet. Please email careers@miraistudios.co directly." },
      { status: 500 },
    );
  }

  const email = buildCareerApplicationEmail({
    fullName: data.fullName,
    email: data.email,
    jobTitle: job.title,
    jobId: job.id,
    message: data.message,
    links: data.links,
    cvFileName: cv.name,
  });

  const buffer = Buffer.from(await cv.arrayBuffer());
  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to: email.to,
    replyTo: email.replyTo,
    subject: email.subject,
    html: email.html,
    text: email.text,
    attachments: [
      {
        filename: cv.name,
        content: buffer,
      },
    ],
  });

  if (result.error) {
    forgetApplicationAttempt(dupKey);
    return NextResponse.json(
      { error: "We could not send your application yet. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
