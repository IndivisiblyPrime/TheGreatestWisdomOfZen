export const revalidate = 60

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { SiteSettings } from "@/lib/types"
import { ReadOnlineSection } from "@/components/sections/ReadOnlineSection"

const READ_ONLINE_QUERY = `*[_type == "homepageSettings"][0]{
  siteTitle,
  siteFavicon,
  readOnlinePdf { asset-> { url } },
  backgroundImage,
  brushStrokeImage
}`

async function getSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(READ_ONLINE_QUERY)
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

// /read-online is disabled — code kept in place in case we want to bring it back.
export default async function ReadOnlinePage() {
  notFound()
  const settings = await getSettings()

  return (
    <main>
      <ReadOnlineSection
        pdfUrl={settings?.readOnlinePdf?.asset?.url}
        backgroundImage={settings?.backgroundImage}
        brushStrokeImage={settings?.brushStrokeImage}
      />
    </main>
  )
}
