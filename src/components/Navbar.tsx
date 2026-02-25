"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { NavItem } from "@/lib/types"

// These targets map to panels inside ExploreSection
const PANEL_TARGETS = new Set(["book", "nfts", "about"])

const defaultNavItems: NavItem[] = [
  { _key: "1", label: "Home", target: "hero" },
  { _key: "2", label: "Book", target: "book" },
  { _key: "3", label: "NFTs", target: "nfts" },
  { _key: "4", label: "About Me", target: "about" },
  { _key: "5", label: "Coming Soon", target: "coming-soon" },
]

interface NavbarProps {
  navItems?: NavItem[]
}

export function Navbar({ navItems }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const items = navItems && navItems.length > 0 ? navItems : defaultNavItems

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault()

    if (PANEL_TARGETS.has(target)) {
      // Dispatch first so the panel opens (and expands) before we scroll to it
      window.dispatchEvent(new CustomEvent("explore-open-panel", { detail: target }))
      // Wait one frame for the DOM to start expanding, then scroll to the panel header
      requestAnimationFrame(() => {
        const panelEl = document.querySelector(`#panel-${target}`)
        if (panelEl) panelEl.scrollIntoView({ behavior: "smooth" })
      })
    } else {
      const el = document.querySelector(`#${target}`)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 shadow-sm backdrop-blur-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4">
        <ul className="flex items-center gap-8">
          {items.map((item) => (
            <li key={item._key}>
              <a
                href={`#${item.target}`}
                onClick={(e) => handleClick(e, item.target)}
                className="text-sm font-medium text-black transition-colors hover:text-neutral-500"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
