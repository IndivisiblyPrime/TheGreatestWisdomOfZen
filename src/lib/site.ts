/**
 * Search & sharing metadata — what Google, Bing and link previews (iMessage, Slack,
 * social) read about each page. Nothing here renders visibly.
 *
 * Titles and descriptions live in code rather than in Sanity on purpose: the Studio's
 * "Browser Tab Title" field was set to "TGWOZ", which made every page's <title> (and the
 * homepage's description) an acronym nobody searches for. See "Search & sharing" in
 * docs/architecture.md.
 */
import { Metadata } from "next"
import { urlFor } from "@/sanity/lib/image"
import { SiteSettings } from "@/lib/types"

export const SITE_URL = "https://thegreatestwisdomofzen.com"
export const SITE_NAME = "The Greatest Wisdom of Zen"

/** Every indexable page. The sitemap is generated from this list. */
export const PAGES = {
  home: {
    path: "/",
    title: "The Greatest Wisdom of Zen — A Complete Guide",
    description:
      "For centuries, seekers have pursued the greatest wisdom of Zen. At last, all of it is here, in 170 blank pages. A hardcover gag gift for the enlightened.",
  },
  acquire: {
    path: "/acquire",
    title: "Acquire the Book · The Greatest Wisdom of Zen",
    description:
      "The Greatest Wisdom of Zen: the complete guide to Zen wisdom, in 170 blank pages. Hardcover, available on Amazon.",
  },
  reviews: {
    path: "/reviews",
    title: "Reviews · The Greatest Wisdom of Zen",
    description:
      "Reviews of The Greatest Wisdom of Zen. One book club has been discussing it in silence for three years. They are so close.",
  },
  contact: {
    path: "/contact",
    title: "Contact · The Greatest Wisdom of Zen",
    description:
      "Join the mailing list (zero spam) or get in touch about The Greatest Wisdom of Zen.",
  },
} as const

/** Describes the desktop background photo — the hardcover standing on raked sand. */
export const COVER_PHOTO_ALT = "The Greatest Wisdom of Zen, hardcover, standing on raked sand"

/**
 * The published book, as listed on Amazon. Restated in the Book structured data on
 * /acquire — keep it in step with the listing, the price especially.
 */
export const BOOK = {
  amazonUrl: "https://www.amazon.com/dp/B0HFVZ1B26",
  isbn: "9798994211014",
  author: "〇",
  publisher: "Neti Neti LLC",
  datePublished: "2026-08-18",
  numberOfPages: 170,
  price: "20.00",
}

type Page = (typeof PAGES)[keyof typeof PAGES]

/** 1200×630 crop of the background photo — the size link previews expect. JPEG, because a
 *  full-size PNG is heavy enough that some apps (WhatsApp) silently drop the preview. */
function shareImageUrl(settings: SiteSettings | null) {
  return settings?.backgroundImage
    ? urlFor(settings.backgroundImage).width(1200).height(630).fit("crop").format("jpg").quality(85).url()
    : undefined
}

/** Full metadata for one page: title, description, canonical URL, link-preview card, favicon. */
export function pageMetadata(page: Page, settings: SiteSettings | null): Metadata {
  const image = shareImageUrl(settings)
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      type: "website",
      url: page.path,
      siteName: SITE_NAME,
      locale: "en_US",
      title: page.title,
      description: page.description,
      images: image ? [{ url: image, width: 1200, height: 630, alt: COVER_PHOTO_ALT }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: image ? [image] : undefined,
    },
    icons: settings?.siteFavicon
      ? {
          icon: urlFor(settings.siteFavicon).width(64).height(64).url(),
          apple: urlFor(settings.siteFavicon).width(180).height(180).url(),
        }
      : undefined,
  }
}

/** Homepage only — tells Google which name to show for the site in results. */
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: ["TGWOZ"],
  url: SITE_URL,
}

/** /acquire only — ties this site to the ISBN and the Amazon listing. */
export function bookJsonLd(settings: SiteSettings | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: SITE_NAME,
    alternativeHeadline: "A Complete Guide",
    url: `${SITE_URL}${PAGES.acquire.path}`,
    description: PAGES.home.description,
    image: shareImageUrl(settings),
    author: { "@type": "Person", name: BOOK.author },
    publisher: { "@type": "Organization", name: BOOK.publisher },
    datePublished: BOOK.datePublished,
    inLanguage: "en",
    isbn: BOOK.isbn,
    numberOfPages: BOOK.numberOfPages,
    bookFormat: "https://schema.org/Hardcover",
    sameAs: BOOK.amazonUrl,
    offers: {
      "@type": "Offer",
      url: BOOK.amazonUrl,
      price: BOOK.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  }
}
