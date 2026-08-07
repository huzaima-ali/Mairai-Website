import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations";

export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatHtml(data: {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  requiredService: string;
  budgetRange: string;
  message: string;
}) {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Name", value: data.fullName },
    { label: "Email", value: data.email },
    { label: "Phone", value: `${data.countryCode} ${data.phone}` },
    { label: "Required service", value: data.requiredService },
    { label: "Budget", value: data.budgetRange },
    { label: "Project details", value: data.message },
  ];

  return `
    <div style="font-family:Inter,Arial,sans-serif;color:#111;line-height:1.6">
      <h1 style="font-size:24px;line-height:1.2;margin:0 0 16px">New Mirai Studios inquiry</h1>
      <p style="margin:0 0 24px;color:#555">A website visitor submitted the contact form.</p>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            ({ label, value }) => `
              <tr>
                <th style="width:160px;text-align:left;vertical-align:top;padding:12px;border-top:1px solid #eee;color:#666;font-weight:600">${escapeHtml(label)}</th>
                <td style="padding:12px;border-top:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
    </div>
  `;
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const data = parsed.data;

  if (data.website) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  if (data.startedAt && Date.now() - data.startedAt < 1500) {
    return NextResponse.json({ error: "Please wait a moment before submitting." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return NextResponse.json({ error: "Contact email is not configured yet." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `New Mirai Studios inquiry from ${data.fullName}`,
    html: formatHtml(data),
    text: [
      "New Mirai Studios inquiry",
      "",
      `Name: ${data.fullName}`,
      `Email: ${data.email}`,
      `Phone: ${data.countryCode} ${data.phone}`,
      `Required service: ${data.requiredService}`,
      `Budget: ${data.budgetRange}`,
      "",
      "Project details:",
      data.message,
    ].join("\n"),
  });

  if (result.error) {
    return NextResponse.json({ error: "We could not send your message yet. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
