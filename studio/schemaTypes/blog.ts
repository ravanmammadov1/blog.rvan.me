import { defineType, defineField } from 'sanity'
import { FileText } from 'lucide-react'

export default defineType({
  name: 'blog',
  title: 'Məqalə / Article',
  type: 'document',
  icon: FileText,
  fields: [
    defineField({
      name: 'title',
      title: 'Məqalə Başlığı (Title)',
      type: 'string',
      description: 'Məqalənin əsas adı (English və ya Azərbaycanca)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_az',
      title: 'Azərbaycanca Başlıq (Optional)',
      type: 'string',
      description: 'Əgər əsas başlıq ingiliscədirsə, azərbaycanca tərcüməsi',
    }),
    defineField({
      name: 'slug',
      title: 'URL Link (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Üz Qabığı Şəkli (Cover Image)',
      type: 'image',
      description: 'Məqalənin əsas afişası (OpenGraph sosial şəbəkə şəkli kimi də avtomatik istifadə olunur)',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kateqoriya',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Məqalənin aid olduğu əsas mövzu',
    }),
    defineField({
      name: 'excerpt',
      title: 'Qısa Xülasə (Lead Summary / Excerpt)',
      type: 'text',
      rows: 3,
      description: 'Google və sosial şəbəkələrdə görünən 2 cümləlik cəlbedici xülasə',
    }),
    defineField({
      name: 'excerpt_az',
      title: 'Qısa Xülasə (Azərbaycanca)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Məqalə Mətni (Article Content)',
      type: 'blockContent',
      description: 'Məqalənin tam mətni (başlıqlar, abzaslar, sitatlar və şəkillər)',
    }),
    defineField({
      name: 'body_az',
      title: 'Məqalə Mətni (Azərbaycanca)',
      type: 'blockContent',
      description: 'Məqalənin Azərbaycan dilindəki tam mətni (əgər ayrıca varsa)',
    }),
    defineField({
      name: 'tags',
      title: 'Açar Sözlər (Tags)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'readTime',
      title: 'Oxu Müddəti',
      type: 'string',
      initialValue: '5 min read',
    }),
    defineField({
      name: 'featured',
      title: 'Əsas Səhifədə Seçilmiş Et (Featured)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: '🚀 Canlı (Published)', value: 'published' },
          { title: '📝 Qaralama (Draft)', value: 'draft' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
    }),
    defineField({
      name: 'publishDate',
      title: 'Dərc Tarixi',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'authorName',
      title: 'Müəllif Adı',
      type: 'string',
      initialValue: 'Ravan Mammadov',
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
      const statusIcon = status === 'draft' ? '📝 ' : '🚀 '
      return {
        title: `${statusIcon}${title || 'Başlıqsız Məqalə'}`,
        subtitle: subtitle || 'Rvan.me Editorial',
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Dərc Tarixi (Yenilər əvvəl)',
      name: 'publishDateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }],
    },
    {
      title: 'Başlıq (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
