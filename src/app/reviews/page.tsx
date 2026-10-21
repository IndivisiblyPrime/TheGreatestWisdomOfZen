export const revalidate = 60

import { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import { SiteSettings } from "@/lib/types"
import { PAGES, pageMetadata } from "@/lib/site"
import { ReviewsSection } from "@/components/sections/ReviewsSection"

const REVIEWS_QUERY = `*[_type == "homepageSettings"][0]{
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
  return pageMetadata(PAGES.reviews, await getSettings())
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
