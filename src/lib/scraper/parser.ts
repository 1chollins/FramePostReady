import type { ScrapedListingData } from '@/types/listing'
import type { Listing, PropertyType } from '@/types/listing'

/**
 * Maps a raw Apify Zillow scraper response to our internal ScrapedListingData type.
 * The Apify actor field names may vary — this handles common variants.
 */
export function parseApifyResponse(raw: Record<string, unknown>): ScrapedListingData {
  const addressObj =
    raw.address && typeof raw.address === 'object'
      ? (raw.address as Record<string, unknown>)
      : null

  const streetAddress = String(
    addressObj?.streetAddress || raw.streetAddress || ''
  )
  const city = String(addressObj?.city || raw.city || '')
  const state = String(addressObj?.state || raw.state || 'FL')
  const zip = String(addressObj?.zipcode || raw.zipcode || raw.zipCode || raw.zip || '')

  const subdivision = String(
    addressObj?.subdivision ||
    raw.subdivision ||
    raw.neighborhood ||
    raw.communityName ||
    ''
  )

  return {
    zpid: String(raw.zpid || raw.id || ''),
    address: streetAddress,
    city,
    state,
    zip,
    price: Number(raw.price || raw.listPrice || raw.zestimate || 0),
    beds: Number(raw.bedrooms || raw.beds || 0),
    baths: Number(raw.bathrooms || raw.baths || 0),
    sqft: Number(raw.livingArea || raw.livingAreaValue || raw.sqft || raw.finishedSqFt || 0),
    lotSize: raw.lotAreaValue
      ? `${raw.lotAreaValue} ${raw.lotAreaUnits || raw.lotAreaUnit || 'sqft'}`
      : undefined,
    yearBuilt: raw.yearBuilt ? Number(raw.yearBuilt) : undefined,
    propertyType: String(raw.homeType || raw.propertyType || 'SINGLE_FAMILY'),
    description: String(raw.description || raw.remarks || ''),
    features: parseFeatures(raw),
    photoUrls: parsePhotoUrls(raw),
    neighborhood: subdivision,
    latitude: raw.latitude ? Number(raw.latitude) : undefined,
    longitude: raw.longitude ? Number(raw.longitude) : undefined,
    daysOnMarket: raw.daysOnZillow ? Number(raw.daysOnZillow) : undefined,
  }
}

function parseFeatures(raw: Record<string, unknown>): string[] {
  const features: string[] = []

  if (raw.resoFacts && typeof raw.resoFacts === 'object') {
    const facts = raw.resoFacts as Record<string, unknown>
    if (facts.hasPool) features.push('Pool')
    if (facts.hasGarage) features.push('Garage')
    if (facts.hasSpa) features.push('Spa')
    if (facts.hasFireplace) features.push('Fireplace')
    if (facts.parkingFeatures) {
      const parking = Array.isArray(facts.parkingFeatures)
        ? facts.parkingFeatures.join(', ')
        : String(facts.parkingFeatures)
      if (parking) features.push(parking)
    }
    if (facts.waterBodyName) features.push(`Waterfront: ${facts.waterBodyName}`)
  }

  if (Array.isArray(raw.atAGlanceFacts)) {
    for (const fact of raw.atAGlanceFacts as Array<{ factLabel?: string; factValue?: string }>) {
      if (fact.factLabel && fact.factValue) {
        features.push(`${fact.factLabel}: ${fact.factValue}`)
      }
    }
  }

  if (Array.isArray(raw.homeFactsAndFeatures)) {
    for (const section of raw.homeFactsAndFeatures as Array<{
      factLabel?: string
      facts?: Array<{ factLabel?: string; factValue?: string }>
    }>) {
      if (Array.isArray(section.facts)) {
        for (const fact of section.facts) {
          if (fact.factLabel) features.push(fact.factLabel)
        }
      }
    }
  }

  return features.filter(Boolean)
}

function parsePhotoUrls(raw: Record<string, unknown>): string[] {
  if (Array.isArray(raw.responsivePhotos)) {
    const urls = (raw.responsivePhotos as Array<{ url?: string }>)
      .map((p) => p.url || '')
      .filter(Boolean)
    if (urls.length > 0) return urls
  }
  if (Array.isArray(raw.photos)) {
    return (raw.photos as Array<string | { url?: string; mixedSources?: { jpeg?: Array<{ url: string }> } }>)
      .map((p) =>
        typeof p === 'string'
          ? p
          : p.url || p.mixedSources?.jpeg?.[0]?.url || ''
      )
      .filter(Boolean)
  }
  if (Array.isArray(raw.originalPhotos)) {
    return (raw.originalPhotos as Array<{ url?: string }>).map((p) => p.url || '').filter(Boolean)
  }
  return []
}

/**
 * Maps a Zillow homeType string to our PropertyType enum.
 */
export function mapPropertyType(zillowType: string): PropertyType {
  const typeMap: Record<string, PropertyType> = {
    SINGLE_FAMILY: 'Single Family',
    CONDO: 'Condo',
    TOWNHOUSE: 'Townhome',
    MULTI_FAMILY: 'Multi-Family',
    MANUFACTURED: 'Single Family',
    LOT: 'Vacant Land',
    LAND: 'Vacant Land',
  }
  return typeMap[zillowType.toUpperCase()] || 'Single Family'
}
