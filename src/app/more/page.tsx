export const revalidate = 60

import { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { SiteSettings } from "@/lib/types"
import { MoreSection } from "@/components/sections/MoreSection"

const MORE_QUERY = `*[_type == "homepageSettings"][0]{
  siteTitle,
  siteFavicon,
  bookCoverImage,
  buyButtonText, buyButtonUrl,
  bookDescription,
  readOnlinePdf { asset-> { url } }
}`

async function getSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(MORE_QUERY)
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

export default async function MorePage() {
  const settings = await getSettings()

  return (
    <main>
      <MoreSection
        bookDescription={settings?.bookDescription}
        bookCoverImage={settings?.bookCoverImage}
        buyButtonUrl={settings?.buyButtonUrl}
        pdfUrl={settings?.readOnlinePdf?.asset?.url}
      />
    </main>
  )
}
