import { NextRequest, NextResponse } from 'next/server'
import { listListings, createListing, getListingByZpid } from '@/lib/airtable/listings'
import { enrichWithSwflKeywords, deriveCounty } from '@/lib/scraper/enrichment'
import type { ApiResponse } from '@/types/api'
import type { Listing, ContentStatus } from '@/types/listing'
import type { ScrapedListingData } from '@/types/listing'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      address, city, price, beds, baths, sqft,
      yearBuilt, propertyType, originalDescription, keyFeatures,
      tone, targetBuyer, emailType, specialNotes, uniqueSellingPoints,
      agentId, neighborhood, zip, lotSize, photoUrls,
    } = body

    if (!address || !city || !price) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'address, city, and price are required' },
        { status: 400 }
      )
    }

    const syntheticZpid = `manual-${address.replace(/\s+/g, '-').toLowerCase()}-${city.replace(/\s+/g, '-').toLowerCase()}`
    const existing = await getListingByZpid(syntheticZpid)
    if (existing) {
      return NextResponse.json<ApiResponse<Listing>>(
        { success: true, data: existing, message: 'Listing already exists' }
      )
    }

    const fakeScrapedData: ScrapedListingData = {
      zpid: syntheticZpid,
      address,
      city,
      state: 'FL',
      zip: zip || '',
      price: Number(price),
      beds: Number(beds || 0),
      baths: Number(baths || 0),
      sqft: Number(sqft || 0),
      lotSize: lotSize || undefined,
      yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
      propertyType: propertyType || 'SINGLE_FAMILY',
      description: originalDescription || '',
      features: Array.isArray(keyFeatures) ? keyFeatures : (keyFeatures ? [keyFeatures] : []),
      photoUrls: Array.isArray(photoUrls) ? photoUrls : [],
      neighborhood: neighborhood || '',
    }

    const swflKeywords = enrichWithSwflKeywords(fakeScrapedData)
    const county = deriveCounty(city)

    const listing = await createListing({
      zillowUrl: '',
      zpid: syntheticZpid,
      address,
      city,
      county,
      zip: zip || '',
      price: Number(price),
      beds: Number(beds || 0),
      baths: Number(baths || 0),
      sqft: Number(sqft || 0),
      lotSize: lotSize || undefined,
      yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
      propertyType: propertyType || 'Single Family',
      originalDescription: originalDescription || '',
      keyFeatures: fakeScrapedData.features ?? [],
      photoUrls: [],
      neighborhood: neighborhood || '',
      swflKeywordsMatched: swflKeywords,
      tone: tone || 'Neutral',
      targetBuyer: targetBuyer || undefined,
      emailType: emailType || undefined,
      specialNotes: specialNotes || undefined,
      uniqueSellingPoints: uniqueSellingPoints || undefined,
      agentId: agentId || undefined,
      contentStatus: 'Scrape Complete',
    })

    return NextResponse.json<ApiResponse<Listing>>({ success: true, data: listing }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create listing'
    console.error('[POST /api/listings]', message)
    return NextResponse.json<ApiResponse>({ success: false, error: message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentStatus = searchParams.get('contentStatus') as ContentStatus | null
    const agentId = searchParams.get('agentId') || undefined
    const maxRecords = searchParams.get('maxRecords')
      ? parseInt(searchParams.get('maxRecords')!)
      : undefined

    const listings = await listListings({
      contentStatus: contentStatus || undefined,
      agentId,
      maxRecords,
    })

    return NextResponse.json<ApiResponse<Listing[]>>({
      success: true,
      data: listings,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch listings'
    console.error('[GET /api/listings]', message)
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
