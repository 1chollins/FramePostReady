import { NextRequest, NextResponse } from 'next/server'
import { generateAllContent } from '@/lib/ai/generate'
import { getListing } from '@/lib/airtable/listings'
import { notifyContentReady } from '@/lib/notifications/email'
import type { ApiResponse, GenerateResponse } from '@/types/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listingId } = body

    if (!listingId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'listingId is required' },
        { status: 400 }
      )
    }

    const listing = await getListing(listingId)
    if (!listing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Listing not found: ${listingId}` },
        { status: 404 }
      )
    }

    if (listing.contentStatus === 'Scraping' || listing.contentStatus === 'Generating') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Listing is currently in status "${listing.contentStatus}" — wait for it to complete`,
        },
        { status: 409 }
      )
    }

    const result = await generateAllContent(listingId)

    await notifyContentReady(
      `${listing.address}, ${listing.city}`,
      result
    )

    return NextResponse.json<ApiResponse<GenerateResponse>>({
      success: true,
      data: {
        listingId: result.listingId,
        contentTypesGenerated: result.contentTypesGenerated,
        totalTokensInput: result.totalTokensInput,
        totalTokensOutput: result.totalTokensOutput,
        totalCost: result.totalCost,
        errors: result.errors,
      },
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'message' in error
          ? String((error as Record<string, unknown>).message)
          : String(error)
    console.error('[POST /api/generate] Generation failed:', message, '\nFull error:', JSON.stringify(error, null, 2))
    return NextResponse.json<ApiResponse>(
      { success: false, error: message || 'Generation failed' },
      { status: 500 }
    )
  }
}
