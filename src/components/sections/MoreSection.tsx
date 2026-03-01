'use client'

import { useState } from "react"
import dynamic from "next/dynamic"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { urlFor } from "@/sanity/lib/image"

const PdfReader = dynamic(
  () => import('./PdfReader').then(mod => ({ default: mod.PdfReader })),
  { ssr: false }
)

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

// ─── More Section ─────────────────────────────────────────────────────────────

interface MoreSectionProps {
  bookDescription?: string
  bookCoverImage?: SanityImageSource
  buyButtonUrl?: string
  pdfUrl?: string
}

type ActivePanel = 'book' | 'read-online' | 'contact' | null

export function MoreSection({ bookDescription, bookCoverImage, buyButtonUrl, pdfUrl }: MoreSectionProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)

  const toggle = (panel: ActivePanel) => {
    setActivePanel(prev => prev === panel ? null : panel)
  }

  return (
    <>
      <nav className="flex items-center gap-6 px-8 py-4 md:px-16">
        <a href="/" className="text-sm text-black hover:opacity-60 transition-opacity">Back</a>
        <button
          onClick={() => toggle('book')}
          className="text-sm text-black hover:opacity-60 transition-opacity"
        >
          Book
        </button>
        <button
          onClick={() => toggle('read-online')}
          className="text-sm text-black hover:opacity-60 transition-opacity"
        >
          Read Online
        </button>
        <button
          onClick={() => toggle('contact')}
          className="text-sm text-black hover:opacity-60 transition-opacity"
        >
          Contact
        </button>
      </nav>

      <section className="w-full px-8 pb-16 md:px-16">
        {activePanel === 'book' && (
          <div>
            {bookCoverImage && (
              <img
                src={urlFor(bookCoverImage).width(1000).url()}
                alt="Book cover"
                className="max-h-[50vh] w-auto mx-auto block"
              />
            )}
            {bookDescription && (
              <p className="mt-6 whitespace-pre-wrap leading-relaxed text-neutral-700">
                {bookDescription}
              </p>
            )}
            {buyButtonUrl && (
              <a
                href={buyButtonUrl}
                className="mt-6 inline-block border border-black px-6 py-2 text-sm hover:bg-black hover:text-white transition-colors"
              >
                Buy
              </a>
            )}
          </div>
        )}

        {activePanel === 'read-online' && (
          <div>
            {pdfUrl ? (
              <PdfReader pdfUrl={pdfUrl} />
            ) : (
              <p className="text-sm text-neutral-400">PDF coming soon</p>
            )}
            {buyButtonUrl && (
              <a
                href={buyButtonUrl}
                className="mt-6 inline-block border border-black px-6 py-2 text-sm hover:bg-black hover:text-white transition-colors"
              >
                Buy
              </a>
            )}
          </div>
        )}

        {activePanel === 'contact' && (
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-xs uppercase tracking-wide text-neutral-500">Mailing list</p>
              <SubscribeForm />
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-wide text-neutral-500">Contact</p>
              <ContactForm />
            </div>
          </div>
        )}
      </section>
    </>
  )
}
