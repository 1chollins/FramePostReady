import type { ContentType } from './content'

export interface PromptTemplate {
  id: string
  templateName: string
  contentType: ContentType
  variant?: string
  systemPrompt: string
  userPromptTemplate: string
  version: number
  active: boolean
  temperature?: number
  maxTokens?: number
  performanceScore?: number
  notes?: string
  lastUpdated: string
}

export interface MergedPrompt {
  systemPrompt: string
  userPrompt: string
  variables: Record<string, string>
}

export interface PromptVariables {
  address: string
  city: string
  county: string
  zip: string
  price: string
  beds: string
  baths: string
  sqft: string
  lot_size: string
  year_built: string
  property_type: string
  original_description: string
  key_features: string
  swfl_keywords: string
  neighborhood: string
  unique_selling_points: string
  photo_count: string
  agent_name: string
  agent_handle: string
  agent_phone: string
  agent_email: string
  brokerage: string
  tone: string
  target_buyer: string
  email_type: string
  open_house_date: string
  price_change_amount: string
  special_notes: string
  [key: string]: string
}
