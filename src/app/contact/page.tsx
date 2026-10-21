export const revalidate = 60

import { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import { SiteSettings } from "@/lib/types"
import { PAGES, pageMetadata } from "@/lib/site"
import { ContactSection } from "@/components/sections/ContactSection"

const CONTACT_QUERY = `*[_type == "homepageSettings"][0]{
  siteFavicon,
  backgroundImage, backgroundImageMobile,
  brushStrokeImage
}`

async function getSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(CONTACT_QUERY)
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(PAGES.contact, await getSettings())
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <main>
      <ContactSection
        backgroundImage={settings?.backgroundImage}
        backgroundImageMobile={settings?.backgroundImageMobile}
        brushStrokeImage={settings?.brushStrokeImage}
      />
    </main>
  )
}
