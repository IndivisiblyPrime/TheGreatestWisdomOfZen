export const revalidate = 60

import { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import { SiteSettings } from "@/lib/types"
import { PAGES, SITE_NAME, pageMetadata, websiteJsonLd } from "@/lib/site"
import { BookHero } from "@/components/sections/BookHero"
import { JsonLd } from "@/components/JsonLd"

const SETTINGS_QUERY = `*[_type == "homepageSettings"][0]{
  siteFavicon,
  backgroundImage, backgroundImageMobile, brushStrokeImage,
  transitionVideo { asset-> { url } },
  transitionVideoMobile { asset-> { url } }
}`

async function getSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(SETTINGS_QUERY)
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(PAGES.home, await getSettings())
}

export default async function Home() {
  const settings = await getSettings()

  // The hero is all image and video, so these give screen readers — and search engines —
  // the title that's on the book cover and a line about it. Visually hidden; the cover
  // already says it.
  return (
    <main>
      <JsonLd data={websiteJsonLd} />
      <h1 className="sr-only">{SITE_NAME}</h1>
      <p className="sr-only">{PAGES.home.description}</p>
      <BookHero
        backgroundImage={settings?.backgroundImage}
        backgroundImageMobile={settings?.backgroundImageMobile}
        brushStrokeImage={settings?.brushStrokeImage}
        transitionVideoUrl={settings?.transitionVideo?.asset?.url}
        transitionVideoMobileUrl={settings?.transitionVideoMobile?.asset?.url}
      />
    </main>
  )
}
