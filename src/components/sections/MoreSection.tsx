"use client"

import { useState } from "react"

// ─── Contact Form ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed")
      setStatus("sent")
      setForm({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-green-700">
        Message sent! I&apos;ll get back to you soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border-b border-black bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border-b border-black bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">
          Phone <span className="normal-case text-neutral-400">(optional)</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border-b border-black bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
          placeholder="+1 (555) 000-0000"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">
          Subject
        </label>
        <input
          type="text"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="w-full border-b border-black bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
          placeholder="Subject"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="w-full resize-none border-b border-black bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
          placeholder="Your message..."
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="border border-black px-8 py-3 text-base transition-colors hover:bg-black hover:text-white disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  )
}

// ─── Subscribe Form ────────────────────────────────────────────────────────────

function SubscribeForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error("Failed")
      setStatus("sent")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return <p className="text-sm text-green-700">You&apos;re subscribed!</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 border-b border-black bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
        placeholder="your@email.com"
      />
      {status === "error" && (
        <p className="text-sm text-red-600">Error. Try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="border border-black px-6 py-2 text-sm transition-colors hover:bg-black hover:text-white disabled:opacity-50"
      >
        {status === "sending" ? "…" : "Subscribe"}
      </button>
    </form>
  )
}

// ─── More Section ─────────────────────────────────────────────────────────────

interface MoreSectionProps {
  exploreHeading?: string
  bookDescription?: string
}

const PANELS = [
  { id: "description", title: "Description" },
  { id: "contact", title: "Contact" },
]

export function MoreSection({ exploreHeading, bookDescription }: MoreSectionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const isOpen = (id: string) => open.has(id)

  return (
    <>
      {/* Minimal top nav */}
      <nav className="flex justify-end px-8 py-4 md:px-16">
        <a href="/" className="text-sm text-black hover:opacity-60 transition-opacity">
          Home
        </a>
      </nav>

      <section className="w-full bg-white px-8 pb-16 md:px-16">
        <h2 className="mb-4 text-[80px] font-bold leading-none tracking-tight md:text-[120px]">
          {exploreHeading || "Explore"}
        </h2>
        <hr className="border-black/20" />

        {PANELS.map((panel) => (
          <div key={panel.id}>
            <hr className="border-black" />
            <button
              onClick={() => toggle(panel.id)}
              className="flex w-full items-center gap-3 py-5 text-left"
            >
              <span
                className="shrink-0 transition-transform duration-300"
                style={{
                  display: "inline-block",
                  transform: isOpen(panel.id) ? "rotate(90deg)" : "rotate(0deg)",
                  width: 0,
                  height: 0,
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderLeft: "12px solid black",
                }}
              />
              <span className="text-3xl font-medium">{panel.title}</span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isOpen(panel.id) ? "max-h-[500vh] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-10">
                {panel.id === "description" && (
                  <p className="whitespace-pre-wrap leading-relaxed text-neutral-700">
                    {bookDescription || ""}
                  </p>
                )}
                {panel.id === "contact" && (
                  <div>
                    {/* Subscribe first */}
                    <p className="mb-3 text-xs uppercase tracking-wide text-neutral-500">
                      Join the mailing list
                    </p>
                    <SubscribeForm />

                    {/* Divider + label */}
                    <hr className="my-8 border-neutral-200" />
                    <p className="mb-6 text-sm text-black">Or contact directly</p>

                    {/* Contact form */}
                    <ContactForm />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <hr className="border-black" />
      </section>
    </>
  )
}
