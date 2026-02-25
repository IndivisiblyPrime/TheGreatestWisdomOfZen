import { NextRequest, NextResponse } from "next/server"

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
      subject: subject ? `[Contact] ${subject}` : "[Contact] New message",
      html: `
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return NextResponse.json({ error: body }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
