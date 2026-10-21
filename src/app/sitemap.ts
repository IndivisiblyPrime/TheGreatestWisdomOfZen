import type { MetadataRoute } from "next"
import { PAGES, SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGES).map(({ path }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  }))
}
