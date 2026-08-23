import { defineType, defineField } from 'sanity'
import { Tag } from 'lucide-react'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: Tag,
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_az',
      title: 'Category Title (Azerbaijani)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'description_az',
      title: 'Description (Azerbaijani)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'color',
      title: 'Accent Color / Hex Code',
      type: 'string',
      description: 'e.g. #61c5ad, #6099df, #984f9f',
      initialValue: '#61c5ad',
    }),
    defineField({
      name: 'icon',
      title: 'Icon Identifier / Emoji',
      type: 'string',
      description: 'e.g. 🎨 for Design, 📣 for Marketing, ✨ for AI & Creativity',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
