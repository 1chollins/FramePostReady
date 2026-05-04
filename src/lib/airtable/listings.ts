import Airtable from 'airtable'
import { base, TABLES } from './client'
import type { Listing, ContentStatus, ListingStatus } from '@/types/listing'

function recordToListing(record: Airtable.Record<Airtable.FieldSet>): Listing {
  const f = record.fields as Record<string, unknown>
  return {
    id: record.id,
    zillowUrl: (f['Zillow URL'] as string) || undefined,
    zpid: (f['ZPID'] as string) || undefined,
    address: (f['Address'] as string) || '',
    city: (f['City'] as string) || '',
    county: (f['County'] as string) || undefined,
    zip: (f['Zip Code'] as string) || undefined,
    price: (f['Price'] as number) || 0,
    beds: (f['Beds'] as number) || 0,
    baths: (f['Baths'] as number) || 0,
    sqft: (f['Sqft'] as number) || 0,
    lotSize: (f['Lot Size'] as string) || undefined,
    yearBuilt: (f['Year Built'] as number) || undefined,
    propertyType: (f['Property Type'] as Listing['propertyType']) || 'Single Family',
    originalDescription: (f['Original MLS Description'] as string) || undefined,
    keyFeatures: parseJsonArray(f['Key Features'] as string),
    photoUrls: parseJsonArray(f['Photo URLs'] as string),
    neighborhood: (f['Neighborhood'] as string) || undefined,
    swflKeywordsMatched: (f['SWFL Keywords Matched'] as string[]) || [],
    tone: (f['Tone'] as Listing['tone']) || 'Neutral',
    targetBuyer: (f['Target Buyer'] as Listing['targetBuyer']) || undefined,
    emailType: (f['Email Type'] as Listing['emailType']) || undefined,
    uniqueSellingPoints: (f['Unique Selling Points'] as string) || undefined,
    specialNotes: (f['Special Notes'] as string) || undefined,
    openHouseDate: (f['Open House Date'] as string) || undefined,
    priceChangeAmount: (f['Price Change Amount'] as number) || undefined,
    listingStatus: (f['Listing Status'] as ListingStatus) || undefined,
    contentStatus: (f['Content Status'] as ContentStatus) || 'Queued',
    agentId: Array.isArray(f['Agent']) ? (f['Agent'] as string[])[0] : undefined,
    createdAt: (f['Created Date'] as string) || new Date().toISOString(),
    updatedAt: (f['Last Modified'] as string) || new Date().toISOString(),
  }
}

function parseJsonArray(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value as string[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : [value]
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

export async function createListing(
  data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Listing> {
  const createFields: Record<string, unknown> = {
    'Zillow URL': data.zillowUrl || '',
    'ZPID': data.zpid || '',
    'Address': data.address,
    'City': data.city,
    'County': data.county || '',
    'Zip Code': data.zip || '',
    'Price': data.price,
    'Beds': data.beds,
    'Baths': data.baths,
    'Sqft': data.sqft,
    'Lot Size': data.lotSize || '',
    'Original MLS Description': data.originalDescription || '',
    'Key Features': JSON.stringify(data.keyFeatures),
    'Photo URLs': JSON.stringify(data.photoUrls),
    'Neighborhood': data.neighborhood || '',
    'SWFL Keywords Matched': data.swflKeywordsMatched,
    'Tone': data.tone,
    'Unique Selling Points': data.uniqueSellingPoints || '',
    'Special Notes': data.specialNotes || '',
    'Open House Date': data.openHouseDate || '',
    'Content Status': data.contentStatus,
    ...(data.yearBuilt ? { 'Year Built': data.yearBuilt } : {}),
    ...(data.propertyType ? { 'Property Type': data.propertyType } : {}),
    ...(data.targetBuyer ? { 'Target Buyer': data.targetBuyer } : {}),
    ...(data.emailType ? { 'Email Type': data.emailType } : {}),
    ...(data.listingStatus ? { 'Listing Status': data.listingStatus } : {}),
    ...(data.priceChangeAmount ? { 'Price Change Amount': data.priceChangeAmount } : {}),
    ...(data.agentId ? { 'Agent': [data.agentId] } : {}),
  }
  const record = await base(TABLES.LISTINGS).create(createFields as Airtable.FieldSet)
  return recordToListing(record)
}

export async function getListing(id: string): Promise<Listing | null> {
  try {
    const record = await base(TABLES.LISTINGS).find(id)
    return recordToListing(record)
  } catch {
    return null
  }
}

export async function getListingByZpid(zpid: string): Promise<Listing | null> {
  const records = await base(TABLES.LISTINGS)
    .select({ filterByFormula: `{ZPID} = "${zpid}"`, maxRecords: 1 })
    .firstPage()
  if (records.length === 0) return null
  return recordToListing(records[0])
}

export async function updateListing(
  id: string,
  data: Partial<Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Listing> {
  const fields: Record<string, unknown> = {}

  if (data.zillowUrl !== undefined) fields['Zillow URL'] = data.zillowUrl
  if (data.zpid !== undefined) fields['ZPID'] = data.zpid
  if (data.address !== undefined) fields['Address'] = data.address
  if (data.city !== undefined) fields['City'] = data.city
  if (data.county !== undefined) fields['County'] = data.county
  if (data.zip !== undefined) fields['Zip Code'] = data.zip
  if (data.price !== undefined) fields['Price'] = data.price
  if (data.beds !== undefined) fields['Beds'] = data.beds
  if (data.baths !== undefined) fields['Baths'] = data.baths
  if (data.sqft !== undefined) fields['Sqft'] = data.sqft
  if (data.lotSize !== undefined) fields['Lot Size'] = data.lotSize
  if (data.yearBuilt !== undefined) fields['Year Built'] = data.yearBuilt
  if (data.propertyType !== undefined) fields['Property Type'] = data.propertyType
  if (data.originalDescription !== undefined) fields['Original MLS Description'] = data.originalDescription
  if (data.keyFeatures !== undefined) fields['Key Features'] = JSON.stringify(data.keyFeatures)
  if (data.photoUrls !== undefined) fields['Photo URLs'] = JSON.stringify(data.photoUrls)
  if (data.neighborhood !== undefined) fields['Neighborhood'] = data.neighborhood
  if (data.swflKeywordsMatched !== undefined) fields['SWFL Keywords Matched'] = data.swflKeywordsMatched
  if (data.tone !== undefined) fields['Tone'] = data.tone
  if (data.targetBuyer !== undefined) fields['Target Buyer'] = data.targetBuyer
  if (data.emailType !== undefined) fields['Email Type'] = data.emailType
  if (data.specialNotes !== undefined) fields['Special Notes'] = data.specialNotes
  if (data.uniqueSellingPoints !== undefined) fields['Unique Selling Points'] = data.uniqueSellingPoints
  if (data.openHouseDate !== undefined) fields['Open House Date'] = data.openHouseDate
  if (data.priceChangeAmount !== undefined) fields['Price Change Amount'] = data.priceChangeAmount
  if (data.listingStatus !== undefined) fields['Listing Status'] = data.listingStatus
  if (data.contentStatus !== undefined) fields['Content Status'] = data.contentStatus
  if (data.agentId) fields['Agent'] = [data.agentId]

  const record = await base(TABLES.LISTINGS).update(id, fields as Airtable.FieldSet)
  return recordToListing(record)
}

export async function listListings(options?: {
  contentStatus?: ContentStatus
  agentId?: string
  maxRecords?: number
}): Promise<Listing[]> {
  const filters: string[] = []
  if (options?.contentStatus) {
    filters.push(`{Content Status} = "${options.contentStatus}"`)
  }
  if (options?.agentId) {
    filters.push(`FIND("${options.agentId}", ARRAYJOIN({Agent}))`)
  }
  const formula = filters.length > 1
    ? `AND(${filters.join(', ')})`
    : filters[0] || ''

  const records = await base(TABLES.LISTINGS)
    .select({
      filterByFormula: formula,
      maxRecords: options?.maxRecords || 100,
      sort: [{ field: 'Created Date', direction: 'desc' }],
    })
    .all()
  return records.map(recordToListing)
}

