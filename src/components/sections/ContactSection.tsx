'use client'

import { useState } from "react"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { NavBackground } from "./NavBackground"

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
            className="w-full border-0 bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
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
            className="w-full border-0 bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
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
          className="w-full border-0 bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
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
          className="w-full border-0 bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
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
          className="w-full resize-none border-0 bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
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
        className="flex-1 border-0 bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
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

// ─── Contact Section ───────────────────────────────────────────────────────────

interface ContactSectionProps {
  backgroundImage?: SanityImageSource
  brushStrokeImage?: SanityImageSource
}

export function ContactSection({ backgroundImage, brushStrokeImage }: ContactSectionProps) {
  return (
    <NavBackground backgroundImage={backgroundImage} brushStrokeImage={brushStrokeImage}>
      <section className="w-full px-8 py-12 md:px-16">
        <div className="space-y-8 max-w-lg">
          <div>
            <p className="mb-3 text-xs uppercase tracking-wide text-neutral-500">Mailing list</p>
            <SubscribeForm />
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-wide text-neutral-500">Contact</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </NavBackground>
  )
}
