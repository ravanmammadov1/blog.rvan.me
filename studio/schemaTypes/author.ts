import { defineType, defineField } from 'sanity'
import { UserCheck } from 'lucide-react'

export default defineType({
  name: 'author',
  title: 'Author / Contributor',
  type: 'document',
  icon: UserCheck,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Ravan Mammadov',
    }),
    defineField({
      name: 'slug',
      title: 'Author Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Profile Portrait Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Professional Role / Title (English)',
      type: 'string',
      initialValue: 'Founder & Creative Director',
    }),
    defineField({
      name: 'role_az',
      title: 'Professional Role / Title (Azerbaijani)',
      type: 'string',
      initialValue: 'Təsisçi və Kreativ Direktor',
    }),
    defineField({
      name: 'bio',
      title: 'Short Biography (English)',
      type: 'text',
      rows: 4,
      description: 'Appears in the author bio card at the end of articles',
      initialValue: 'Designer and marketer exploring the intersection of visual culture, brand architecture, technology, and creative strategy.',
    }),
    defineField({
      name: 'bio_az',
      title: 'Short Biography (Azerbaijani)',
      type: 'text',
      rows: 4,
      initialValue: 'Vizual mədəniyyət, brend arxitekturası, texnologiya və kreativ strategiyanın kəsişməsini araşdıran dizayner və marketoloq.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social & Profile Links',
      type: 'object',
      fields: [
        { name: 'website', title: 'Personal Website URL', type: 'url' },
        { name: 'linkedin', title: 'LinkedIn Profile URL', type: 'url' },
        { name: 'twitter', title: 'X / Twitter URL', type: 'url' },
        { name: 'github', title: 'GitHub Profile URL', type: 'url' },
      ],
    }),
    defineField({
      name: 'isVerified',
      title: 'Verified Editorial Contributor',
      type: 'boolean',
      description: 'Designates verified publication authors and approved contributors',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
})
