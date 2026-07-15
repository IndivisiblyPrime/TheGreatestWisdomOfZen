export const revalidate = 60

import { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { SiteSettings } from "@/lib/types"
import { AcquireSection } from "@/components/sections/AcquireSection"

const ACQUIRE_QUERY = `*[_type == "homepageSettings"][0]{
  siteTitle,
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
  const settings = await getSettings()
  const title = settings?.siteTitle || "The Greatest Wisdom of Zen"
  return {
    title,
    icons: settings?.siteFavicon
      ? { icon: urlFor(settings.siteFavicon).width(64).height(64).url() }
      : undefined,
  }
}

export default async function AcquirePage() {
  const settings = await getSettings()

  return (
    <main>
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
