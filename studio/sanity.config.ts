import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { deskStructure } from './structure/deskStructure'

export default defineConfig({
  name: 'rvan-editorial',
  title: 'Rvan.me Editorial Studio',

  projectId: '0lqwkcmg',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool({
      defaultApiVersion: '2025-01-01',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
