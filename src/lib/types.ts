import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface NavItem {
  _key: string;
  label: string;
  target: string;
}

export interface NFTItem {
  _key: string;
  title?: string;
  image: SanityImageSource;
  alt?: string;
  year?: string;
  collection?: string;
}

export interface ExperienceEntry {
  _key: string;
  logo?: SanityImageSource;
  jobTitle: string;
  dateRange?: string;
  company?: string;
  description?: string;
}

export interface LogoFreeformEntry {
  _key: string;
  logo?: SanityImageSource;
  title: string;
  dateRange?: string;
  subtitle?: string;
  description?: string;
}

export interface AccordionItem {
  _key: string;
  title: string;
  content?: string;
  showSocialLinks?: boolean;
  itemType?: "text" | "experience" | "logoFreeform" | "contact";
  experienceEntries?: ExperienceEntry[];
  logoFreeformEntries?: LogoFreeformEntry[];
}

export interface SocialLink {
  _key: string;
  platform: string;
  url: string;
}

export interface SanityImageWithAsset {
  asset?: {
    _ref: string;
    _type: "reference";
  };
}

export interface MarqueeItem {
  _key: string;
  text: string;
  icon?: SanityImageWithAsset;
}

export interface SanityFileAsset {
  _type: "file";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface HomepageSettings {
  // Site
  siteTitle?: string;
  siteFavicon?: SanityImageSource;

  // Navigation
  navItems?: NavItem[];

  // Hero
  heroImage?: SanityImageSource;
  heroVideo?: SanityFileAsset;
  heroVideoUrl?: string;

  // Book
  bookTitle?: string;
  bookDescription?: string;
  bookImage?: SanityImageSource;
  bookButtonText?: string;
  bookButtonUrl?: string;

  // NFT
  nftSectionTitle?: string;
  nftSectionSubtitle?: string;
  nftGallery?: NFTItem[];
  landscapeGallery?: NFTItem[];

  // CTA
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  encryptedText?: string;

  // About
  aboutAccordion?: AccordionItem[];
  socialLinks?: SocialLink[];
  instagramUrl?: string;
  aboutIntroText?: string;

  // Footer
  footerMarqueeItems?: MarqueeItem[];
}
