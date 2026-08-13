'use client'

import { useState } from "react"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { NavBackground } from "./NavBackground"
import { garamond } from "@/lib/fonts"
import { inkCard, inkBody, inkLabel, inkEyebrow, inkButton, inkInput, inkSuccess, inkError } from "@/lib/theme"

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
      <p className={`${garamond.className} text-[17px] ${inkSuccess}`}>
        Message sent! I&apos;ll get back to you soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={`mb-1 block ${inkLabel}`}>
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className={`${inkInput} text-[15px]`}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className={`mb-1 block ${inkLabel}`}>
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className={`${inkInput} text-[15px]`}
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div>
        <label className={`mb-1 block ${inkLabel}`}>
          Phone <span className="normal-case text-neutral-400">(optional)</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className={`${inkInput} text-[15px]`}
          placeholder="+1 (555) 000-0000"
        />
      </div>
      <div>
        <label className={`mb-1 block ${inkLabel}`}>
          Subject
        </label>
        <input
          type="text"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className={`${inkInput} text-[15px]`}
          placeholder="Subject"
        />
      </div>
      <div>
        <label className={`mb-1 block ${inkLabel}`}>
          Message
        </label>
        <textarea
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          className={`${inkInput} resize-none text-[15px]`}
          placeholder="Your message..."
        />
      </div>
      {status === "error" && (
        <p className={`${garamond.className} text-[17px] ${inkError}`}>
          Something went wrong. Please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className={`${inkButton} px-8 py-3 text-[12.5px]`}
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
    return <p className={`${garamond.className} text-[17px] ${inkSuccess}`}>You&apos;re subscribed!</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`${inkInput} text-[15px] sm:flex-1`}
        placeholder="your@email.com"
      />
      {status === "error" && (
        <p className={`${garamond.className} text-[17px] ${inkError}`}>Error. Try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className={`${inkButton} w-full px-6 py-3 text-[12.5px] sm:w-auto`}
      >
        {status === "sending" ? "…" : "Subscribe"}
      </button>
    </form>
  )
}

// ─── Contact Section ───────────────────────────────────────────────────────────

interface ContactSectionProps {
  backgroundImage?: SanityImageSource
  backgroundImageMobile?: SanityImageSource
  brushStrokeImage?: SanityImageSource
}

export function ContactSection({ backgroundImage, backgroundImageMobile, brushStrokeImage }: ContactSectionProps) {
  return (
    <NavBackground backgroundImage={backgroundImage} backgroundImageMobile={backgroundImageMobile} brushStrokeImage={brushStrokeImage}>
      <section className="w-full px-8 py-12 md:px-16 flex flex-col items-center">
        <p className={`${garamond.className} mb-8 text-[18px] ${inkBody} text-center`}>Fill out the forms below to get in contact</p>
        <div className="space-y-8 max-w-lg w-full">
          <div className={`${inkCard} p-6`}>
            <p className={`mb-3 ${inkEyebrow}`}>Join the mailing list <span className="normal-case tracking-normal text-[#8b8172]">(zero spam or marketing emails)</span></p>
            <SubscribeForm />
          </div>
          <div className={`${inkCard} p-6`}>
            <p className={`mb-3 ${inkEyebrow}`}>Contact</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </NavBackground>
  )
}
