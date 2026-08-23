import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO & Social Sharing Metadata',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'SEO Meta Title',
      type: 'string',
      description: 'Defaults to the article title if left empty (Recommended: 50-60 characters)',
      validation: (Rule) => Rule.max(70).warning('Longer titles may be truncated in search results'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 3,
      description: 'Defaults to the article excerpt if left empty (Recommended: 120-160 characters)',
      validation: (Rule) => Rule.max(170).warning('Longer descriptions may be truncated in search results'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (Open Graph)',
      type: 'image',
      description: 'Custom 1200x630 share image. Defaults to the featured cover image if omitted.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL (Optional)',
      type: 'url',
      description: 'Use if the article was originally published elsewhere',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from Search Engines (noindex)',
      type: 'boolean',
      description: 'Enable only if you do NOT want search engines to index this article',
      initialValue: false,
    }),
  ],
})
