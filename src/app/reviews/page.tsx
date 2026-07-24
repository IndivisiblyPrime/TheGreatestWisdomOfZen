export const revalidate = 60

import { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { SiteSettings } from "@/lib/types"
import { ReviewsSection } from "@/components/sections/ReviewsSection"

const REVIEWS_QUERY = `*[_type == "homepageSettings"][0]{
  siteTitle,
  siteFavicon,
  backgroundImage, backgroundImageMobile,
  brushStrokeImage
}`

async function getSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(REVIEWS_QUERY)
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const title = settings?.siteTitle || "The Greatest Wisdom of Zen"
  return {
    title,
    icons: settings?.siteFavicon
      ? {
          icon: urlFor(settings.siteFavicon).width(64).height(64).url(),
          apple: urlFor(settings.siteFavicon).width(180).height(180).url(),
        }
      : undefined,
  }
}

export default async function ReviewsPage() {
  const settings = await getSettings()

  return (
    <main>
      <ReviewsSection
        backgroundImage={settings?.backgroundImage}
        backgroundImageMobile={settings?.backgroundImageMobile}
        brushStrokeImage={settings?.brushStrokeImage}
      />
    </main>
  )
}
