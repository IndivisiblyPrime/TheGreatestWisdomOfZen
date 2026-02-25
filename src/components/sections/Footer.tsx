"use client"

import { useRef, useEffect } from "react"
import { urlFor } from "@/sanity/lib/image"
import { MarqueeItem } from "@/lib/types"

interface FooterProps {
  marqueeItems?: MarqueeItem[]
}

const defaultMarqueeItems: MarqueeItem[] = [
  { _key: "1", text: "BB&J Real Estate LLC" },
  { _key: "2", text: "Neti Neti App" },
]

// Speed in pixels per second
const SPEED = 40

export function Footer({ marqueeItems }: FooterProps) {
  const rawItems =
    marqueeItems?.filter(
      (item): item is MarqueeItem => item !== null && item !== undefined
    ) || []
  const items = rawItems.length > 0 ? rawItems : defaultMarqueeItems

  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const tick = (now: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = now
      // Clamp delta to 50 ms so a backgrounded/paused tab can't cause a huge jump
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = now

      // Half-width = width of one content set (we render 2 identical sets)
      const halfWidth = track.scrollWidth / 2

      if (halfWidth > 0) {
        posRef.current -= SPEED * delta
        // Use while (not if) so any overshot amount is fully corrected each frame
        while (posRef.current <= -halfWidth) {
          posRef.current += halfWidth
        }
        track.style.transform = `translateX(${posRef.current}px)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = null
    }
  }, [items])

  const renderItem = (item: MarqueeItem, key: string) => (
    <div key={key} className="flex shrink-0 items-center gap-3">
      {item.icon?.asset && (
        <img
          src={urlFor(item.icon).width(32).height(32).url()}
          alt=""
          className="h-8 w-8 rounded object-cover"
        />
      )}
      <span className="text-sm text-black">{item.text}</span>
      <span className="mx-10 text-neutral-300">•</span>
    </div>
  )

  return (
    <footer id="coming-soon" className="overflow-hidden border-t border-black/20 bg-white py-8">
      <p className="mb-6 text-center text-xs uppercase tracking-widest text-neutral-400">
        Coming Soon
      </p>
      {/* RAF-driven ticker — pixel-perfect, no CSS animation loop seam */}
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex will-change-transform">
          {items.map((item) => renderItem(item, `a-${item._key}`))}
          {items.map((item) => renderItem(item, `b-${item._key}`))}
        </div>
      </div>
    </footer>
  )
}
