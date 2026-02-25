"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight, Linkedin, Instagram } from "lucide-react"
import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { EncryptedText } from "@/components/ui/encrypted-text"
import {
  AccordionItem as AccordionItemType,
  SocialLink,
  NFTItem,
  LogoFreeformEntry,
} from "@/lib/types"

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

// ─── Book Panel ────────────────────────────────────────────────────────────────

interface BookPanelProps {
  title?: string
  description?: string
  image?: SanityImageSource
  buttonText?: string
  buttonUrl?: string
  animKey: number
  isOpen: boolean
}

function BookPanel({
  title,
  description,
  image,
  buttonText,
  buttonUrl,
  animKey,
  isOpen,
}: BookPanelProps) {
  const displayTitle = title || "Book"
  const displayButtonText = buttonText || "Buy / View More Details"
  const titleRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!titleRef.current || !lineRef.current) return
    if (isOpen) {
      titleRef.current.classList.remove("animate-title-draw")
      lineRef.current.classList.remove("animate-line-draw")
      void titleRef.current.offsetWidth // force reflow to restart animation
      titleRef.current.classList.add("animate-title-draw")
      lineRef.current.classList.add("animate-line-draw")
    } else {
      titleRef.current.classList.remove("animate-title-draw")
      lineRef.current.classList.remove("animate-line-draw")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, animKey])

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1fr]">
      {/* Left column — title, description, button stacked top-to-bottom */}
      <div className="flex flex-col">
        <h3
          ref={titleRef}
          className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          {displayTitle}
        </h3>
        <div
          ref={lineRef}
          className="mt-2 h-px bg-black"
          style={{ transform: "scaleX(0)", transformOrigin: "left" }}
        />
        {description && (
          <p className="mt-6 text-sm leading-relaxed text-neutral-600 md:text-base">
            {description}
          </p>
        )}
        <div className="mt-8">
          {buttonUrl ? (
            <a
              href={buttonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-black px-8 py-3 text-base transition-colors hover:bg-black hover:text-white"
            >
              {displayButtonText}
            </a>
          ) : (
            <button className="border border-black px-8 py-3 text-base transition-colors hover:bg-black hover:text-white">
              {displayButtonText}
            </button>
          )}
        </div>
      </div>

      {/* Right column — full image, natural aspect ratio */}
      <div className="flex items-start justify-center">
        {image ? (
          <img
            src={urlFor(image).width(1200).url()}
            alt={displayTitle}
            className="h-auto max-h-[55vh] w-auto max-w-full object-contain"
          />
        ) : (
          <div className="flex h-64 w-48 items-center justify-center bg-neutral-100">
            <span className="text-neutral-400">Book cover</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── NFT Panel ────────────────────────────────────────────────────────────────

interface NFTPanelProps {
  subtitle?: string
  nftGallery?: NFTItem[]
  landscapeGallery?: NFTItem[]
  ctaButtonText?: string
  ctaButtonUrl?: string
  encryptedText?: string
}

function NFTPanel({
  subtitle,
  nftGallery,
  landscapeGallery,
  ctaButtonText,
  ctaButtonUrl,
  encryptedText,
}: NFTPanelProps) {
  const portrait1 = nftGallery?.[0]
  const landscape1 = landscapeGallery?.[0]
  const portrait2 = nftGallery?.[1]
  const displayCtaText = ctaButtonText || "View Collection"
  const displayEncryptedText = encryptedText || "Welcome to the Matrix, Neo."

  // Renders one image at its natural aspect ratio (no cropping).
  // On desktop: constrained by max-h-[50vh], bottom-aligned via grid items-end.
  // On mobile: full width, stacked.
  const renderImage = (item: NFTItem | undefined, fallback: string) => {
    const inner = !item?.image ? (
      <div className="flex h-48 w-full items-center justify-center bg-neutral-100">
        <span className="text-xs text-neutral-400">{fallback}</span>
      </div>
    ) : (
      <div className="relative inline-block">
        <img
          src={urlFor(item.image).width(900).url()}
          alt={item.alt || item.title || ""}
          className="block h-auto w-auto max-h-[50vh] max-w-full object-contain transition-transform duration-500 hover:scale-105"
        />
        {(item.title || item.year) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-3">
            {item.title && (
              <p className="text-sm font-medium leading-tight text-white drop-shadow">
                {item.title}
              </p>
            )}
            {item.year && (
              <p className="text-xs text-white/70 drop-shadow">{item.year}</p>
            )}
          </div>
        )}
      </div>
    )

    if (ctaButtonUrl && item?.image) {
      return (
        <a
          href={ctaButtonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {inner}
        </a>
      )
    }

    return <div>{inner}</div>
  }

  return (
    <div>
      {subtitle && (
        <p className="mb-6 text-lg italic text-neutral-500">{subtitle}</p>
      )}

      {/* Mobile: single column stack. Desktop: 3-col, bottom-aligned natural ratios */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_1.5fr_1fr] sm:items-end sm:gap-4">
        {renderImage(portrait1, "Portrait 1")}
        {renderImage(landscape1, "Landscape")}
        {renderImage(portrait2, "Portrait 2")}
      </div>

      {/* CTA row */}
      <div className="mt-8">
        {ctaButtonUrl ? (
          <a
            href={ctaButtonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-black px-8 py-3 text-base transition-colors hover:bg-black hover:text-white"
          >
            {displayCtaText}
          </a>
        ) : (
          <button className="border border-black px-8 py-3 text-base transition-colors hover:bg-black hover:text-white">
            {displayCtaText}
          </button>
        )}
        <p className="mt-4">
          <EncryptedText
            text={displayEncryptedText}
            encryptedClassName="text-neutral-400"
            revealedClassName="text-black"
            revealDelayMs={50}
            triggerOnHover
            className="text-xs"
          />
        </p>
      </div>
    </div>
  )
}

// ─── About Panel ──────────────────────────────────────────────────────────────

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
    title: "Contact Me",
    content: "Get in touch.",
    showSocialLinks: false,
  },
]

interface AboutPanelProps {
  accordionItems?: AccordionItemType[]
  socialLinks?: SocialLink[]
  linkedinUrl?: string
  instagramUrl?: string
  aboutIntroText?: string
}

function AboutPanel({
  accordionItems,
  socialLinks,
  linkedinUrl,
  instagramUrl,
  aboutIntroText,
}: AboutPanelProps) {
  const items =
    accordionItems && accordionItems.length > 0
      ? accordionItems
      : defaultAccordionItems

  // Custom multi-open accordion state — same pattern as outer panels
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  return (
    <div>
      {/* Social icons row */}
      {(linkedinUrl || instagramUrl) && (
        <div className="mb-4 flex items-center gap-3">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-md bg-black text-white transition-opacity hover:opacity-70"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-md bg-black text-white transition-opacity hover:opacity-70"
            >
              <Instagram className="h-5 w-5" />
            </a>
          )}
        </div>
      )}

      {/* Intro text below social icons */}
      {aboutIntroText && (
        <p className="mb-6 max-w-xl text-sm leading-relaxed text-neutral-600">
          {aboutIntroText}
        </p>
      )}

      {/* Custom multi-open accordion with left-side arrows */}
      <div className="w-full">
        {items.map((item) => {
          const isItemOpen = openItems.has(item._key)
          return (
            <div key={item._key} className="border-b border-neutral-200 last:border-b-0">
              <button
                onClick={() => toggleItem(item._key)}
                className="flex w-full items-center gap-3 py-4 text-left"
              >
                <ChevronRight
                  className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200 ${
                    isItemOpen ? "rotate-90" : ""
                  }`}
                />
                <span className="text-base font-medium text-black">{item.title}</span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isItemOpen ? "max-h-[300vh] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="pb-5 pl-7 text-sm text-neutral-700">
                  {(!item.itemType || item.itemType === "text") && (
                    <p className="whitespace-pre-wrap leading-relaxed">{item.content}</p>
                  )}

                  {item.itemType === "experience" && item.experienceEntries && (
                    <div>
                      {item.experienceEntries.map((entry, idx) => {
                        const isLast = idx === item.experienceEntries!.length - 1
                        return (
                          <div key={entry._key} className="flex gap-5">
                            {/* Left: logo + connecting line */}
                            <div className="flex flex-col items-center">
                              {entry.logo ? (
                                <img
                                  src={urlFor(entry.logo).width(80).height(80).url()}
                                  alt={entry.company ?? ""}
                                  className="h-16 w-16 shrink-0 rounded-md object-cover"
                                />
                              ) : (
                                <div className="h-16 w-16 shrink-0 rounded-md bg-neutral-200" />
                              )}
                              {!isLast && (
                                <div className="mt-1 w-px flex-1 bg-black/20 mb-1" />
                              )}
                            </div>

                            {/* Right: content */}
                            <div className={`flex-1 ${isLast ? "pb-0" : "pb-8"}`}>
                              <p className="text-base font-semibold text-black">
                                {entry.jobTitle}
                              </p>
                              {entry.company && (
                                <p className="text-sm font-medium text-neutral-600">
                                  {entry.company}
                                </p>
                              )}
                              {entry.dateRange && (
                                <p className="text-xs text-neutral-400">{entry.dateRange}</p>
                              )}
                              {entry.description && (
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                                  {entry.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {item.itemType === "logoFreeform" && item.logoFreeformEntries && (
                    <div className="space-y-6">
                      {item.logoFreeformEntries.map((entry: LogoFreeformEntry) => (
                        <div key={entry._key} className="flex gap-5">
                          {/* Left: logo only, no connecting line */}
                          <div className="shrink-0">
                            {entry.logo ? (
                              <img
                                src={urlFor(entry.logo).width(80).height(80).url()}
                                alt={entry.subtitle ?? entry.title}
                                className="h-16 w-16 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-md bg-neutral-200" />
                            )}
                          </div>

                          {/* Right: content */}
                          <div className="flex-1">
                            <p className="text-base font-semibold text-black">
                              {entry.title}
                            </p>
                            {entry.subtitle && (
                              <p className="text-sm font-medium text-neutral-600">
                                {entry.subtitle}
                              </p>
                            )}
                            {entry.dateRange && (
                              <p className="text-xs text-neutral-400">{entry.dateRange}</p>
                            )}
                            {entry.description && (
                              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                                {entry.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.itemType === "contact" && <ContactForm />}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main ExploreSection ──────────────────────────────────────────────────────

interface ExploreSectionProps {
  bookTitle?: string
  bookDescription?: string
  bookImage?: SanityImageSource
  bookButtonText?: string
  bookButtonUrl?: string
  nftSubtitle?: string
  nftGallery?: NFTItem[]
  landscapeGallery?: NFTItem[]
  ctaButtonText?: string
  ctaButtonUrl?: string
  encryptedText?: string
  accordionItems?: AccordionItemType[]
  socialLinks?: SocialLink[]
  instagramUrl?: string
  aboutIntroText?: string
}

const PANELS = [
  { id: "book", title: "Book" },
  { id: "nfts", title: "NFTs" },
  { id: "about", title: "About Me" },
]

export function ExploreSection({
  bookTitle,
  bookDescription,
  bookImage,
  bookButtonText,
  bookButtonUrl,
  nftSubtitle,
  nftGallery,
  landscapeGallery,
  ctaButtonText,
  ctaButtonUrl,
  encryptedText,
  accordionItems,
  socialLinks,
  instagramUrl,
  aboutIntroText,
}: ExploreSectionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  const [bookAnimKey, setBookAnimKey] = useState(0)

  // Open a specific panel (used by Navbar custom event)
  const openPanel = (id: string) => {
    setOpen((prev) => {
      if (prev.has(id)) return prev // already open, no-op
      const next = new Set(prev)
      next.add(id)
      return next
    })
    if (id === "book") {
      setBookAnimKey((k) => k + 1)
    }
  }

  // Listen for nav clicks that should open a panel
  useEffect(() => {
    const handler = (e: Event) => {
      const panelId = (e as CustomEvent<string>).detail
      if (PANELS.some((p) => p.id === panelId)) {
        openPanel(panelId)
      }
    }
    window.addEventListener("explore-open-panel", handler)
    return () => window.removeEventListener("explore-open-panel", handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = (id: string) => {
    const willOpen = !open.has(id)
    if (id === "book" && willOpen) {
      setBookAnimKey((k) => k + 1)
    }
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const isOpen = (id: string) => open.has(id)

  const linkedinUrl = socialLinks?.find((l) => l.platform === "linkedin")?.url
  const instagramFromSocial = socialLinks?.find((l) => l.platform === "instagram")?.url
  const resolvedInstagramUrl = instagramFromSocial || instagramUrl

  return (
    <section id="explore" className="w-full bg-white px-8 py-16 md:px-16">
      {/* Explore heading */}
      <h2 className="mb-4 text-[80px] font-bold leading-none tracking-tight md:text-[120px]">
        Explore
      </h2>
      <hr className="border-black/20" />

      {PANELS.map((panel) => (
        <div key={panel.id} id={`panel-${panel.id}`}>
          <hr className="border-black" />
          <button
            onClick={() => toggle(panel.id)}
            className="flex w-full items-center gap-3 py-5 text-left"
          >
            {/* Filled triangle — rotates 90° when open */}
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
            {/* Panel title — 2 sizes up from text-xl */}
            <span className="text-3xl font-medium">{panel.title}</span>
          </button>

          {/* Collapsible content */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isOpen(panel.id) ? "max-h-[500vh] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pb-10">
              {panel.id === "book" && (
                <BookPanel
                  title={bookTitle}
                  description={bookDescription}
                  image={bookImage}
                  buttonText={bookButtonText}
                  buttonUrl={bookButtonUrl}
                  animKey={bookAnimKey}
                  isOpen={isOpen("book")}
                />
              )}
              {panel.id === "nfts" && (
                <NFTPanel
                  subtitle={nftSubtitle}
                  nftGallery={nftGallery}
                  landscapeGallery={landscapeGallery}
                  ctaButtonText={ctaButtonText}
                  ctaButtonUrl={ctaButtonUrl}
                  encryptedText={encryptedText}
                />
              )}
              {panel.id === "about" && (
                <AboutPanel
                  accordionItems={accordionItems}
                  socialLinks={socialLinks}
                  linkedinUrl={linkedinUrl}
                  instagramUrl={resolvedInstagramUrl}
                  aboutIntroText={aboutIntroText}
                />
              )}
            </div>
          </div>
        </div>
      ))}
      <hr className="border-black" />
    </section>
  )
}
