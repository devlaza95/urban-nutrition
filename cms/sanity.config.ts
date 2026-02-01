import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {schemaTypes} from './schemaTypes'

const projectId = process.env.SANITY_PROJECT_ID || 'k0jjn03c'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

if (!projectId) {
  throw new Error('Missing SANITY_PROJECT_ID')
}

export default defineConfig({
  name: 'default',
  title: 'urban-nutrition',

  projectId,
  dataset,

  plugins: [structureTool(), visionTool(), codeInput()],

  schema: {
    types: schemaTypes,
  },
})
