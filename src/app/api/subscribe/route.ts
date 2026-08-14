import { NextRequest, NextResponse } from "next/server"

/** The signup goes out as HTML, so anything a stranger typed has to be inert. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

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
      // Hitting reply in the inbox answers the subscriber, not Resend.
      reply_to: email,
      // Every site uses this same `[Mailing]` prefix, so one inbox rule catches
      // all of them. Which site it came from is the sender name and the
      // "Sent from" line below — all three send from breathebonsai.com, so the
      // address alone can't tell them apart.
      subject: `[Mailing] New subscriber: ${email}`,
      html: `
        <p><strong>From:</strong> &lt;${escapeHtml(email)}&gt;</p>
        <p><strong>Sent from:</strong> thegreatestwisdomofzen.com</p>
        <hr />
        <p>Please add me to the mailing list.</p>
      `,
      text: `From: <${email}>\nSent from: thegreatestwisdomofzen.com\n\nPlease add me to the mailing list.`,
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return NextResponse.json({ error: body }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
