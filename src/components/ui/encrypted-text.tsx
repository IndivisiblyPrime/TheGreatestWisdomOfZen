"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"

interface EncryptedTextProps {
  text: string
  className?: string
  revealDelayMs?: number
  flipDelayMs?: number
  charset?: string
  encryptedClassName?: string
  revealedClassName?: string
  /** When true, only starts decrypting on mouse hover. Resets when mouse leaves. */
  triggerOnHover?: boolean
}

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"

export function EncryptedText({
  text,
  className,
  revealDelayMs = 50,
  flipDelayMs = 50,
  charset = DEFAULT_CHARSET,
  encryptedClassName = "text-neutral-500",
  revealedClassName = "text-white",
  triggerOnHover = false,
}: EncryptedTextProps) {
  const [revealedCount, setRevealedCount] = useState(triggerOnHover ? 0 : 0)
  const [displayText, setDisplayText] = useState("")
  const [isActive, setIsActive] = useState(!triggerOnHover)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getRandomChar = useCallback(() => {
    return charset[Math.floor(Math.random() * charset.length)]
  }, [charset])

  // Scramble unrevealed characters
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (i < revealedCount) return char
            return getRandomChar()
          })
          .join("")
      )
    }, flipDelayMs)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text, revealedCount, flipDelayMs, getRandomChar])

  // Progressively reveal characters (only when active)
  useEffect(() => {
    if (!isActive) return
    if (revealedCount >= text.length) return

    const timeout = setTimeout(() => {
      setRevealedCount((prev) => prev + 1)
    }, revealDelayMs)

    return () => clearTimeout(timeout)
  }, [revealedCount, text.length, revealDelayMs, isActive])

  const handleMouseEnter = () => {
    if (!triggerOnHover) return
    setIsActive(true)
  }

  const handleMouseLeave = () => {
    if (!triggerOnHover) return
    setIsActive(false)
    setRevealedCount(0)
  }

  return (
    <span
      className={cn("font-mono", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText.split("").map((char, i) => (
        <span
          key={i}
          className={i < revealedCount ? revealedClassName : encryptedClassName}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
