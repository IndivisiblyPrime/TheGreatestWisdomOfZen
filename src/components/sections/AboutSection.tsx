"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Mail,
  Globe,
} from "lucide-react"
import { AccordionItem as AccordionItemType, SocialLink } from "@/lib/types"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"
import { urlFor } from "@/sanity/lib/image"

interface AboutSectionProps {
  accordionItems?: AccordionItemType[]
  socialLinks?: SocialLink[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  youtube: Youtube,
  email: Mail,
  website: Globe,
}

// Default accordion items if none provided from Sanity
const defaultAccordionItems: AccordionItemType[] = [
  {
    _key: "1",
    title: "About Me",
    content: "Welcome to my personal website. Add your bio in Sanity Studio.",
    showSocialLinks: false,
  },
  {
    _key: "2",
    title: "Career Highlights",
    content: "Add your career highlights in Sanity Studio.",
    showSocialLinks: false,
  },
  {
    _key: "3",
    title: "Meditation & Hobbies",
    content: "Add your hobbies and interests in Sanity Studio.",
    showSocialLinks: false,
  },
  {
    _key: "4",
    title: "Contact Me",
    content: "Get in touch with me through the social links below.",
    showSocialLinks: true,
  },
]

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      setForm({ name: "", email: "", subject: "", message: "" })
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <p className="text-green-400">Message sent! I&apos;ll get back to you soon.</p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-neutral-400">Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-400">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-neutral-400">Subject</label>
        <input
          type="text"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
          placeholder="Subject"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-neutral-400">Message</label>
        <textarea
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
          placeholder="Your message..."
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  )
}

export function AboutSection({ accordionItems, socialLinks }: AboutSectionProps) {
  const items = accordionItems && accordionItems.length > 0
    ? accordionItems
    : defaultAccordionItems

  return (
    <section
      id="about"
      className="relative min-h-screen overflow-hidden bg-neutral-900 px-4 py-20"
    >
      <ShootingStars className="absolute inset-0 z-0" />
      <StarsBackground className="absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <h2 className="mb-12 text-center text-5xl font-bold tracking-tight text-white md:text-6xl">
          About Me
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {items.map((item, index) => (
            <AccordionItem
              key={item._key}
              value={item._key}
              className="rounded-lg border border-neutral-700 bg-neutral-800/50 px-6"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-lg font-semibold text-white">
                    {item.title}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2 text-neutral-300">
                {(!item.itemType || item.itemType === "text") && (
                  <>
                    <p className="whitespace-pre-wrap leading-relaxed">{item.content}</p>
                    {item.showSocialLinks && socialLinks && socialLinks.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-4">
                        {socialLinks.map((link) => {
                          const Icon = iconMap[link.platform] || Globe
                          return (
                            <a
                              key={link._key}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex h-12 w-12 items-center justify-center rounded-full bg-neutral-700 transition-all hover:scale-110 hover:bg-blue-600"
                              aria-label={link.platform}
                            >
                              <Icon className="h-5 w-5 text-neutral-300 transition-colors group-hover:text-white" />
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}

                {item.itemType === "experience" && item.experienceEntries && (
                  <div className="space-y-6">
                    {item.experienceEntries.map((entry) => (
                      <div key={entry._key} className="flex gap-4">
                        {entry.logo && (
                          <div className="shrink-0">
                            <img
                              src={urlFor(entry.logo).width(80).height(80).url()}
                              alt={entry.company ?? ""}
                              className="h-20 w-20 rounded-lg object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-xl font-bold text-white">{entry.jobTitle}</p>
                          {entry.company && (
                            <p className="font-semibold text-neutral-200">{entry.company}</p>
                          )}
                          {entry.dateRange && (
                            <p className="text-sm text-neutral-400">{entry.dateRange}</p>
                          )}
                          {entry.description && (
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                              {entry.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {item.itemType === "contact" && <ContactForm />}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
