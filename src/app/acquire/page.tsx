export const revalidate = 60

import { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import { SiteSettings } from "@/lib/types"
import { PAGES, bookJsonLd, pageMetadata } from "@/lib/site"
import { AcquireSection } from "@/components/sections/AcquireSection"
import { JsonLd } from "@/components/JsonLd"

const ACQUIRE_QUERY = `*[_type == "homepageSettings"][0]{
  siteFavicon,
  backgroundImage, backgroundImageMobile, brushStrokeImage,
  buyButtonText, buyButtonUrl,
  bookDescription
}`

async function getSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(ACQUIRE_QUERY)
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(PAGES.acquire, await getSettings())
}

export default async function AcquirePage() {
  const settings = await getSettings()

  return (
    <main>
      <JsonLd data={bookJsonLd(settings)} />
      <AcquireSection
        bookDescription={settings?.bookDescription}
        buyButtonUrl={settings?.buyButtonUrl}
        backgroundImage={settings?.backgroundImage}
        backgroundImageMobile={settings?.backgroundImageMobile}
        brushStrokeImage={settings?.brushStrokeImage}
      />
    </main>
  )
}
