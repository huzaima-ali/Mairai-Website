import { z } from "zod";

export const CAREERS_INBOX = "careers@miraistudios.co";
export const MAX_CV_BYTES = 5 * 1024 * 1024;
export const ALLOWED_CV_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

const cvTypeByExt: Record<string, (typeof ALLOWED_CV_MIME)[number]> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function isAllowedCvFile(file: { name: string; type: string; size: number }) {
  if (file.size > MAX_CV_BYTES) return { ok: false as const, error: "CV must be 5MB or smaller." };
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const mime = (file.type as (typeof ALLOWED_CV_MIME)[number]) || cvTypeByExt[ext];
  if (!mime || !ALLOWED_CV_MIME.includes(mime) || !["pdf", "doc", "docx"].includes(ext)) {
    return { ok: false as const, error: "Please upload a PDF, DOC, or DOCX file." };
  }
  return { ok: true as const, mime };
}

export const jobApplicationFieldsSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name.").max(80, "That name is a little long."),
  email: z.string().email("Enter a valid email address."),
  message: z
    .string()
    .min(20, "Tell us a little more, at least 20 characters.")
    .max(2000, "Please keep it under 2000 characters."),
  links: z.string().max(500, "Please keep links under 500 characters.").optional().default(""),
  jobId: z.string().min(1, "Missing job."),
  jobTitle: z.string().min(1, "Missing job title."),
  honeypot: z.string().max(0, "Please leave this field blank.").optional(),
  startedAt: z.coerce.number().optional(),
});

export type JobApplicationFields = z.infer<typeof jobApplicationFieldsSchema>;

export function applicationEmailSubject(jobTitle: string, applicantName: string) {
  return `Job Application: ${jobTitle} - ${applicantName}`;
}

export function applicationEmailHtml(data: {
  fullName: string;
  email: string;
  jobTitle: string;
  jobId: string;
  message: string;
  links?: string;
  cvFileName?: string;
}) {
  const escape = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const rows: Array<[string, string]> = [
    ["Job title", data.jobTitle],
    ["Job ID", data.jobId],
    ["Applicant name", data.fullName],
    ["Applicant email", data.email],
    ["Relevant links", data.links?.trim() || "Not provided"],
    ["CV file", data.cvFileName || "Not provided"],
  ];
  return `
    <div style="font-family:Inter,Arial,sans-serif;color:#111;line-height:1.6">
      <h1 style="font-size:24px;line-height:1.2;margin:0 0 16px">New Mirai Studios job application</h1>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th style="width:180px;text-align:left;vertical-align:top;padding:12px;border-top:1px solid #eee;color:#666;font-weight:600">${escape(label)}</th>
                <td style="padding:12px;border-top:1px solid #eee;white-space:pre-wrap">${escape(value)}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
      <p style="margin:24px 0 8px;font-weight:600">Cover message</p>
      <p style="white-space:pre-wrap">${escape(data.message)}</p>
    </div>
  `;
}

export function careersInbox() {
  return process.env.CAREERS_TO_EMAIL?.trim() || CAREERS_INBOX;
}

export const MIN_APPLY_MS = 1500;
export const DUPLICATE_WINDOW_MS = 60_000;

export function applicationEmailText(data: {
  fullName: string;
  email: string;
  jobTitle: string;
  jobId: string;
  message: string;
  links?: string;
  cvFileName?: string;
}) {
  return [
    "New Mirai Studios job application",
    "",
    `Job title: ${data.jobTitle}`,
    `Job ID: ${data.jobId}`,
    `Applicant name: ${data.fullName}`,
    `Applicant email: ${data.email}`,
    `Relevant links: ${data.links?.trim() || "Not provided"}`,
    `CV file: ${data.cvFileName || "Not provided"}`,
    "",
    "Cover message:",
    data.message,
  ].join("\n");
}

export function duplicateSubmissionKey(fields: { jobId: string; email: string; fullName: string }) {
  return `${fields.jobId}:${fields.email.trim().toLowerCase()}:${fields.fullName.trim().toLowerCase()}`;
}

const recentSubmissions = new Map<string, number>();

export function rememberApplicationAttempt(key: string, now = Date.now()) {
  const last = recentSubmissions.get(key);
  if (last && now - last < DUPLICATE_WINDOW_MS) {
    return { duplicate: true as const };
  }
  recentSubmissions.set(key, now);
  return { duplicate: false as const };
}

export function forgetApplicationAttempt(key: string) {
  recentSubmissions.delete(key);
}

/** Test helper — not used in production request handling. */
export function resetApplicationAttempts() {
  recentSubmissions.clear();
}

export function buildCareerApplicationEmail(data: {
  fullName: string;
  email: string;
  jobTitle: string;
  jobId: string;
  message: string;
  links?: string;
  cvFileName?: string;
}) {
  return {
    to: careersInbox(),
    replyTo: data.email,
    subject: applicationEmailSubject(data.jobTitle, data.fullName),
    html: applicationEmailHtml(data),
    text: applicationEmailText(data),
  };
}
