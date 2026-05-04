import type { ContentType } from './content'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ScrapeRequest {
  zillowUrl: string
  agentId?: string
  tone?: string
  targetBuyer?: string
  emailType?: string
  specialNotes?: string
  uniqueSellingPoints?: string
}

export interface ScrapeResponse {
  listingId: string
  address: string
  city: string
  price: number
  beds: number
  baths: number
  sqft: number
  swflKeywordsMatched: string[]
  contentStatus: string
}

export interface GenerateRequest {
  listingId: string
  contentType?: ContentType
}

export interface GenerateResponse {
  listingId: string
  contentTypesGenerated: ContentType[]
  totalTokensInput: number
  totalTokensOutput: number
  totalCost: number
  errors: Partial<Record<ContentType, string | null>>
}

export interface WebhookRequest {
  action: 'scrape' | 'generate' | 'scrape_and_generate' | 'notify' | 'export'
  secret: string
  payload: {
    zillowUrl?: string
    agentId?: string
    tone?: string
    listingId?: string
    contentType?: ContentType
    deliveryMethod?: string
    [key: string]: unknown
  }
}

export interface DeliveryRequest {
  listingId: string
  method: 'pdf' | 'drive' | 'email'
  agentId?: string
}
