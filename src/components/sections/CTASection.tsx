"use client"

import { EncryptedText } from "@/components/ui/encrypted-text"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"

interface CTASectionProps {
  buttonText?: string
  buttonUrl?: string
  encryptedText?: string
}

export function CTASection({ buttonText, buttonUrl, encryptedText }: CTASectionProps) {
  const displayButtonText = buttonText || "Learn More"
  const displayEncryptedText = encryptedText || "Welcome to the Matrix, Neo."

  return (
    <section className="relative overflow-hidden bg-neutral-900 px-4 py-20">
      <ShootingStars className="absolute inset-0 z-0" />
      <StarsBackground className="absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Gradient Button */}
        {buttonUrl ? (
          <a
            href={buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-8 py-2 text-white transition duration-200 hover:shadow-xl focus:ring-2 focus:ring-blue-400"
          >
            {displayButtonText}
          </a>
        ) : (
          <button className="rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-8 py-2 text-white transition duration-200 hover:shadow-xl focus:ring-2 focus:ring-blue-400">
            {displayButtonText}
          </button>
        )}

        {/* Encrypted Text */}
        <p className="mx-auto max-w-lg py-10 text-left">
          <EncryptedText
            text={displayEncryptedText}
            encryptedClassName="text-neutral-500"
            revealedClassName="text-white"
            revealDelayMs={50}
            triggerOnHover
          />
        </p>
      </div>
    </section>
  )
}
