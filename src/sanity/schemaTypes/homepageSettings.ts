import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homepageSettings = defineType({
  name: 'homepageSettings',
  title: 'Homepage Settings',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'site', title: 'Site' },
    { name: 'hero', title: 'Hero' },
    { name: 'buttons', title: 'Buttons' },
    { name: 'more', title: 'More' },
  ],
  fields: [
    // ─── Site ────────────────────────────────────────────────────────────────
    defineField({
      name: 'siteTitle',
      title: 'Browser Tab Title',
      type: 'string',
      group: 'site',
      description: 'Text shown in the browser tab',
    }),
    defineField({
      name: 'siteFavicon',
      title: 'Favicon',
      type: 'image',
      group: 'site',
      description: 'Icon shown in the browser tab. Use a square image (e.g. 32×32 or 64×64 px).',
      options: { hotspot: false },
    }),

    // ─── Hero ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'bookCoverImage',
      title: 'Book Cover Image',
      type: 'image',
      group: 'hero',
      description: 'The tall full-width scrollable book photo shown on the homepage.',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),

    // ─── Buttons ──────────────────────────────────────────────────────────────
    defineField({
      name: 'buyButtonText',
      title: 'Buy Button Text',
      type: 'string',
      group: 'buttons',
      initialValue: 'Buy',
    }),
    defineField({
      name: 'buyButtonUrl',
      title: 'Buy Button URL',
      type: 'url',
      group: 'buttons',
      description: 'Link to the book purchase page',
    }),
    defineField({
      name: 'moreButtonText',
      title: 'More Button Text',
      type: 'string',
      group: 'buttons',
      initialValue: 'More',
    }),

    // ─── More ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'exploreHeading',
      title: 'Explore Heading',
      type: 'string',
      group: 'more',
      initialValue: 'Explore',
      description: 'Large heading on the /more page',
    }),
    defineField({
      name: 'bookDescription',
      title: 'Book Description',
      type: 'text',
      group: 'more',
      rows: 6,
      description: 'Text shown in the Description accordion on the /more page',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage Settings' }
    },
  },
})
