import { defineType, defineField } from 'sanity'
import { FileText } from 'lucide-react'

export default defineType({
  name: 'blog',
  title: 'Article / Post',
  type: 'document',
  icon: FileText,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'publishing', title: 'Publishing' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── CONTENT GROUP ──
    defineField({
      name: 'title',
      title: 'Article Title (English)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'title_az',
      title: 'Article Title (Azerbaijani)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug (English)',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug_az',
      title: 'URL Slug (Azerbaijani)',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title_az',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Editorial Excerpt (English)',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'A concise 2-3 sentence summary that engages readers',
      validation: (Rule) => Rule.required().max(280),
    }),
    defineField({
      name: 'excerpt_az',
      title: 'Editorial Excerpt (Azerbaijani)',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Article Body (English)',
      type: 'blockContent',
      group: 'content',
      description: 'Main editorial text with rich headings, blockquotes, code, and figures',
    }),
    defineField({
      name: 'body_az',
      title: 'Article Body (Azerbaijani)',
      type: 'blockContent',
      group: 'content',
    }),

    // ── MEDIA GROUP ──
    defineField({
      name: 'coverImage',
      title: 'Featured Cover Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text (Alt Text)',
          description: 'Description of the image for accessibility and SEO',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Cover Caption / Credit',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ── PUBLISHING GROUP ──
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'publishing',
      description: 'Select the primary editorial vertical for this article',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'publishing',
      description: 'Select the article author or contributor',
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'datetime',
      group: 'publishing',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Estimated Reading Time',
      type: 'string',
      group: 'publishing',
      placeholder: 'e.g. 5 min read',
      initialValue: '5 min read',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Article',
      type: 'boolean',
      group: 'publishing',
      description: 'Pin this article as a featured editorial piece',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Editorial Status',
      type: 'string',
      group: 'publishing',
      options: {
        list: [
          { title: '📝 Draft', value: 'draft' },
          { title: '🔍 In Review', value: 'review' },
          { title: '🚀 Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
    }),
    defineField({
      name: 'tags',
      title: 'Editorial Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      group: 'publishing',
    }),

    // ── SEO GROUP ──
    defineField({
      name: 'seo',
      title: 'SEO & Metadata',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category.title',
      media: 'coverImage',
      status: 'status',
    },
    prepare(selection) {
      const { title, subtitle, media, status } = selection
      const statusIcon = status === 'draft' ? '📝 ' : status === 'review' ? '🔍 ' : ''
      return {
        title: `${statusIcon}${title || 'Untitled Article'}`,
        subtitle: subtitle || 'Uncategorized',
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Publish Date, Newest First',
      name: 'publishDateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }],
    },
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
