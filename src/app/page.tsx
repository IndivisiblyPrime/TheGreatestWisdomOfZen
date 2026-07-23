export const revalidate = 60

import { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { SiteSettings } from "@/lib/types"
import { BookHero } from "@/components/sections/BookHero"

const SETTINGS_QUERY = `*[_type == "homepageSettings"][0]{
  siteTitle,
  siteFavicon,
  backgroundImage, backgroundImageMobile,
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
  const settings = await getSettings()
  const title = settings?.siteTitle || "The Greatest Wisdom of Zen"
  return {
    title,
    description: title,
    icons: settings?.siteFavicon
      ? { icon: urlFor(settings.siteFavicon).width(64).height(64).url() }
      : undefined,
  }
}

export default async function Home() {
  const settings = await getSettings()

  return (
    <main>
      <BookHero
        backgroundImage={settings?.backgroundImage}
        backgroundImageMobile={settings?.backgroundImageMobile}
        transitionVideoUrl={settings?.transitionVideo?.asset?.url}
        transitionVideoMobileUrl={settings?.transitionVideoMobile?.asset?.url}
      />
    </main>
  )
}
