"use client"

import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { SanityFileAsset } from "@/lib/types"

interface HeroSectionProps {
  heroImage?: SanityImageSource
  heroVideo?: SanityFileAsset
  heroVideoUrl?: string
}

export function HeroSection({ heroImage, heroVideo, heroVideoUrl }: HeroSectionProps) {
  // Determine video source - uploaded file takes priority, then external URL
  const getVideoUrl = () => {
    if (heroVideo?.asset?._ref) {
      // Convert Sanity file reference to URL
      const ref = heroVideo.asset._ref
      const [, id, extension] = ref.split('-')
      return `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}.${extension}`
    }
    return heroVideoUrl
  }

  const videoSrc = getVideoUrl()
  const hasVideo = !!videoSrc

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-900"
    >
      {/* Background - Video or Image */}
      <div className="absolute inset-0">
        {hasVideo ? (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-neutral-900/40" />
          </>
        ) : heroImage ? (
          <>
            <img
              src={urlFor(heroImage).width(1920).height(1080).url()}
              alt=""
              className="h-full w-full rotate-180 object-cover"
            />
            <div className="absolute inset-0 bg-neutral-900/40" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-900" />
        )}
      </div>
      <div className="relative z-10 px-4 text-center">
        <h1 className="text-7xl font-bold uppercase tracking-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] md:text-8xl lg:text-9xl">
          Jack Harvey
        </h1>
      </div>
    </section>
  )
}
