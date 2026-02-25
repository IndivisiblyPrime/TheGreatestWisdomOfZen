import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface SiteSettings {
  siteTitle?: string;
  siteFavicon?: SanityImageSource;
  bookCoverImage?: SanityImageSource;
  buyButtonText?: string;
  buyButtonUrl?: string;
  moreButtonText?: string;
  exploreHeading?: string;
  bookDescription?: string;
}
