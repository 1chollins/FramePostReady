import { NextRequest, NextResponse } from 'next/server'
import { getListing, updateListing } from '@/lib/airtable/listings'
import { getContentByListing } from '@/lib/airtable/content'
import type { ApiResponse } from '@/types/api'
import type { Listing } from '@/types/listing'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await getListing(params.id)
    if (!listing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    const content = await getContentByListing(params.id)

    return NextResponse.json<ApiResponse<Listing & { content: typeof content }>>({
      success: true,
      data: { ...listing, content },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch listing'
    console.error(`[GET /api/listings/${params.id}]`, message)
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updated = await updateListing(params.id, body)
    return NextResponse.json<ApiResponse<Listing>>({ success: true, data: updated })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update listing'
    console.error(`[PATCH /api/listings/${params.id}]`, message)
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
