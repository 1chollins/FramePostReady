import { z } from 'zod'

export type PropertyType =
  | 'Single Family'
  | 'Condo'
  | 'Townhome'
  | 'Villa'
  | 'Multi-Family'
  | 'Vacant Land'

export type ToneType =
  | 'Luxury'
  | 'Family-Friendly'
  | 'Investor-Focused'
  | 'First-Time Buyer'
  | 'Neutral'

export type TargetBuyerType =
  | 'Relocator'
  | 'Snowbird'
  | 'First-Time Buyer'
  | 'Investor'
  | 'Downsizer'
  | 'Upsizer'
  | 'Military/VA'

export type EmailType =
  | 'Just Listed'
  | 'Open House'
  | 'Price Reduction'
  | 'Back on Market'
  | 'Under Contract'

export type ListingStatus =
  | 'Active'
  | 'Pending'
  | 'Sold'
  | 'Price Reduced'
  | 'Back on Market'

export type ContentStatus =
  | 'Queued'
  | 'Scraping'
  | 'Scrape Complete'
  | 'Scrape Failed'
  | 'Generating'
  | 'Content Ready'
  | 'Delivered'
  | 'Archived'

export interface Listing {
  id: string
  zillowUrl?: string
  zpid?: string
  address: string
  city: string
  county?: string
  zip?: string
  price: number
  beds: number
  baths: number
  sqft: number
  lotSize?: string
  yearBuilt?: number
  propertyType: PropertyType
  originalDescription?: string
  keyFeatures: string[]
  photoUrls: string[]
  neighborhood?: string
  swflKeywordsMatched: string[]
  tone: ToneType
  targetBuyer?: TargetBuyerType
  emailType?: EmailType
  uniqueSellingPoints?: string
  specialNotes?: string
  openHouseDate?: string
  priceChangeAmount?: number
  listingStatus?: ListingStatus
  contentStatus: ContentStatus
  agentId?: string
  createdAt: string
  updatedAt: string
}

export interface ListingInput {
  zillowUrl?: string
  address?: string
  city?: string
  county?: string
  zip?: string
  price?: number
  beds?: number
  baths?: number
  sqft?: number
  lotSize?: string
  yearBuilt?: number
  propertyType?: PropertyType
  originalDescription?: string
  keyFeatures?: string[]
  neighborhood?: string
  tone: ToneType
  targetBuyer?: TargetBuyerType
  emailType?: EmailType
  uniqueSellingPoints?: string
  specialNotes?: string
  openHouseDate?: string
  priceChangeAmount?: number
  agentId?: string
}

export interface ScrapedListingData {
  zpid: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  lotSize?: string
  yearBuilt?: number
  propertyType?: string
  description?: string
  features?: string[]
  photoUrls?: string[]
  neighborhood?: string
  latitude?: number
  longitude?: number
  daysOnMarket?: number
  priceHistory?: Array<{ date: string; price: number }>
}

export const ListingInputSchema = z.object({
  zillowUrl: z.string().url().optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  beds: z.number().int().positive().optional(),
  baths: z.number().positive().optional(),
  sqft: z.number().positive().optional(),
  lotSize: z.string().optional(),
  yearBuilt: z.number().int().min(1800).max(2030).optional(),
  propertyType: z.enum(['Single Family', 'Condo', 'Townhome', 'Villa', 'Multi-Family', 'Vacant Land']).optional(),
  originalDescription: z.string().optional(),
  keyFeatures: z.array(z.string()).optional(),
  neighborhood: z.string().optional(),
  tone: z.enum(['Luxury', 'Family-Friendly', 'Investor-Focused', 'First-Time Buyer', 'Neutral']),
  targetBuyer: z.enum(['Relocator', 'Snowbird', 'First-Time Buyer', 'Investor', 'Downsizer', 'Upsizer', 'Military/VA']).optional(),
  emailType: z.enum(['Just Listed', 'Open House', 'Price Reduction', 'Back on Market', 'Under Contract']).optional(),
  uniqueSellingPoints: z.string().optional(),
  specialNotes: z.string().optional(),
  openHouseDate: z.string().optional(),
  priceChangeAmount: z.number().optional(),
  agentId: z.string().optional(),
}).refine(
  (data) => data.zillowUrl || data.address,
  { message: 'Either zillowUrl or address is required' }
)

export type ListingInputType = z.infer<typeof ListingInputSchema>
