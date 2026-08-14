import { NextRequest, NextResponse } from "next/server"

/** The message goes out as HTML, so anything a stranger typed has to be inert. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev"

  if (!apiKey || !to) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    )
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      // Hitting reply in the inbox answers the reader, not Resend. Without this
      // a reply went to zen@breathebonsai.com, which is a send-only address —
      // nobody reads it, so a reader who wrote in could never be answered.
      reply_to: email,
      subject: subject ? `[Contact] ${subject}` : "[Contact] New message",
      // All three sites send from breathebonsai.com, so the address can't say
      // which one this came from — name the site in the body.
      html: `
        <p><strong>From:</strong> ${escapeHtml(name ?? "Anonymous")} &lt;${escapeHtml(email ?? "")}&gt;</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject ?? "")}</p>
        <p><strong>Sent from:</strong> thegreatestwisdomofzen.com</p>
        <hr />
        <p>${escapeHtml(message ?? "").replace(/\n/g, "<br>")}</p>
      `,
      text: `From: ${name ?? "Anonymous"} <${email ?? ""}>\nSubject: ${subject ?? ""}\nSent from: thegreatestwisdomofzen.com\n\n${message ?? ""}`,
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return NextResponse.json({ error: body }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
