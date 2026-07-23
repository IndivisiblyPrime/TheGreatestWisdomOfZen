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
    { name: 'readOnline', title: 'Read Online' },
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
      name: 'transitionVideo',
      title: 'Transition Video',
      type: 'file',
      group: 'hero',
      description: 'Video shown fullscreen when clicking the homepage. Plays before navigating to /acquire.',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'transitionVideoMobile',
      title: 'Transition Video (Mobile)',
      type: 'file',
      group: 'hero',
      description: 'Optional — shown instead of Transition Video on narrow screens (under 768px wide). Falls back to Transition Video if left empty. Both videos are always downloaded so the correct one can play instantly if the browser is resized.',
      options: { accept: 'video/*' },
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
    defineField({
      name: 'readOnlineButtonText',
      title: 'Read Online Button Text',
      type: 'string',
      group: 'buttons',
      initialValue: 'Read Online',
    }),

    // ─── More ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'exploreHeading',
      title: 'Explore Heading',
      type: 'string',
      group: 'more',
      initialValue: 'Explore',
      description: 'Large heading on the /acquire page',
    }),
    defineField({
      name: 'bookDescription',
      title: 'Book Description',
      type: 'text',
      group: 'more',
      rows: 6,
      description: 'Text shown in the Description accordion on the /acquire page',
    }),

    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      group: 'more',
      description: 'Wide background scene shown behind the /acquire page content. Also used on the homepage.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'backgroundImageMobile',
      title: 'Background Image (Mobile)',
      type: 'image',
      group: 'more',
      description: 'Optional — shown instead of Background Image on narrow screens (under 768px wide), on the homepage, /acquire, /contact, and /reviews. Falls back to Background Image if left empty.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'brushStrokeImage',
      title: 'Brush Stroke (Nav Bar)',
      type: 'image',
      group: 'more',
      description: 'Wide horizontal black brush stroke overlaid at the top of /acquire. Should be much wider than tall.',
      options: { hotspot: false },
    }),

    // ─── Read Online ──────────────────────────────────────────────────────────
    defineField({
      name: 'readOnlineTitle',
      title: 'Page Title',
      type: 'string',
      group: 'readOnline',
      initialValue: 'Read Online',
      description: 'Title shown at the top of the Read Online page',
    }),
    defineField({
      name: 'readOnlinePdf',
      title: 'Book PDF',
      type: 'file',
      group: 'readOnline',
      description: 'Upload the PDF of the book here',
      options: { accept: 'application/pdf' },
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage Settings' }
    },
  },
})
