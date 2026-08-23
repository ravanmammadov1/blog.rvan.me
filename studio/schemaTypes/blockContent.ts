import { defineType, defineArrayMember } from 'sanity'

/**
 * Editorial Portable Text block content definition
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2 (Section Heading)', value: 'h2' },
        { title: 'H3 (Sub-heading)', value: 'h3' },
        { title: 'H4 (Minor Heading)', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet List', value: 'bullet' },
        { title: 'Numbered List', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
        ],
        annotations: [
          {
            title: 'URL Link',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
              {
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean',
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Inline Figure Image',
      options: { hotspot: true },
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Caption / Figure Note',
          description: 'Shown below the image as an editorial caption',
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility and SEO',
        },
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'codeBlock',
      title: 'Code Block / Snippet',
      fields: [
        {
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              { title: 'TypeScript / JavaScript', value: 'typescript' },
              { title: 'CSS / SCSS', value: 'css' },
              { title: 'HTML', value: 'html' },
              { title: 'JSON', value: 'json' },
              { title: 'Bash / Shell', value: 'bash' },
              { title: 'Python', value: 'python' },
            ],
          },
          initialValue: 'typescript',
        },
        {
          name: 'filename',
          title: 'Filename / Label (optional)',
          type: 'string',
        },
        {
          name: 'code',
          title: 'Code Content',
          type: 'text',
          rows: 8,
        },
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'calloutBox',
      title: 'Editorial Callout Box',
      fields: [
        {
          name: 'type',
          title: 'Callout Tone',
          type: 'string',
          options: {
            list: [
              { title: '💡 Key Insight / Takeaway', value: 'insight' },
              { title: '⚠️ Warning / Watch-out', value: 'warning' },
              { title: '📖 Research Reference', value: 'reference' },
            ],
          },
          initialValue: 'insight',
        },
        {
          name: 'title',
          title: 'Callout Title',
          type: 'string',
        },
        {
          name: 'text',
          title: 'Callout Text',
          type: 'text',
          rows: 4,
        },
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'divider',
      title: 'Section Divider',
      fields: [
        {
          name: 'style',
          title: 'Divider Style',
          type: 'string',
          options: {
            list: [
              { title: 'Subtle Line', value: 'line' },
              { title: 'Editorial Star Break (***)', value: 'stars' },
            ],
          },
          initialValue: 'line',
        },
      ],
    }),
  ],
})
