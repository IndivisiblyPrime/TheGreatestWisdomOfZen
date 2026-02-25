"use client"

import { urlFor } from "@/sanity/lib/image"
import { NFTItem } from "@/lib/types"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"

interface NFTSectionProps {
  nfts: NFTItem[]
  title?: string
  subtitle?: string
  landscapeItems?: NFTItem[]
}

const placeholderNFTs = [
  { _key: "1", title: "NFT #1", year: "2025", collection: "Collection A" },
  { _key: "2", title: "NFT #2", year: "2025", collection: "Collection A" },
  { _key: "3", title: "NFT #3", year: "2025", collection: "Collection B" },
  { _key: "4", title: "NFT #4", year: "2025", collection: "Collection B" },
]

function ImageOverlay({ nft }: { nft: NFTItem | (typeof placeholderNFTs)[number] }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <div className="flex items-end justify-between">
        <div className="text-left">
          {nft.title && (
            <h3 className="text-lg font-semibold text-white">{nft.title}</h3>
          )}
          {nft.year && (
            <p className="text-sm text-white/70">{nft.year}</p>
          )}
        </div>
        {nft.collection && (
          <div className="text-right">
            <p className="text-sm font-medium text-white/80">{nft.collection}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function NFTSection({ nfts, title, subtitle, landscapeItems }: NFTSectionProps) {
  const hasRealNFTs = nfts && nfts.length > 0
  const hasLandscape = landscapeItems && landscapeItems.length > 0
  const displayItems = hasRealNFTs ? nfts : placeholderNFTs

  return (
    <section
      id="nfts"
      className="relative min-h-screen overflow-hidden bg-neutral-900 px-4 py-20"
    >
      <ShootingStars className="absolute inset-0 z-0" />
      <StarsBackground className="absolute inset-0 z-0" />

      <div className="relative z-10">
        {/* Section heading */}
        <h2 className="mb-3 text-center text-5xl font-bold tracking-tight text-white md:text-6xl">
          {title || "NFTs"}
        </h2>
        {subtitle && (
          <p className="mb-12 text-center text-base text-neutral-400 md:text-lg">
            {subtitle}
          </p>
        )}
        {!subtitle && <div className="mb-12" />}

        {/* Landscape paintings — full-width single column */}
        {hasLandscape && (
          <div className="mx-auto mb-10 max-w-5xl space-y-6">
            {landscapeItems!.map((item) => (
              <div
                key={item._key}
                className="group relative overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[1.02]"
              >
                <img
                  src={urlFor(item.image).width(1200).url()}
                  alt={item.alt || item.title || "Painting"}
                  className="h-auto w-full object-contain"
                />
                <ImageOverlay nft={item} />
              </div>
            ))}
          </div>
        )}

        {/* Portrait grid */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {displayItems.map((nft) => (
            <div
              key={nft._key}
              className="group relative overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105"
            >
              {hasRealNFTs && (nft as NFTItem).image ? (
                <img
                  src={urlFor((nft as NFTItem).image).width(800).url()}
                  alt={(nft as NFTItem).alt || nft.title || "NFT"}
                  className="h-auto w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-neutral-700 to-neutral-800">
                  <span className="text-6xl text-neutral-600/50">NFT</span>
                </div>
              )}
              <ImageOverlay nft={nft} />
            </div>
          ))}
        </div>

        {!hasRealNFTs && (
          <p className="mt-8 text-center text-neutral-400">
            Add your images in Sanity Studio
          </p>
        )}
      </div>
    </section>
  )
}
