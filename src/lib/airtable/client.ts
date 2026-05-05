import Airtable from 'airtable'

Airtable.configure({
  apiKey: process.env.AIRTABLE_PAT || '',
  endpointUrl: 'https://api.airtable.com',
})

export const base = Airtable.base(process.env.AIRTABLE_BASE_ID || '')

export const TABLES = {
  LISTINGS: 'Listing',
  AGENTS: 'Agents',
  CONTENT: 'Content',
  PROMPT_TEMPLATES: 'Prompt Templates',
  DELIVERY_LOG: 'Delivery Log',
} as const

export type TableName = (typeof TABLES)[keyof typeof TABLES]
