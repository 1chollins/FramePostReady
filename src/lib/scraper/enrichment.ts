import swflKeywords from '../../../data/swfl-keywords.json'
import type { ScrapedListingData } from '@/types/listing'

interface KeywordRule {
  triggers?: string[]
  cityTrigger?: string
  requiresTags?: string[]
  yearBuiltAfter?: number
  lotSizeAcresMin?: number
  tags: string[]
}

type KeywordsData = Record<string, KeywordRule | Record<string, string[]>>

/**
 * Matches SWFL keywords against scraped listing data and returns an array of matched tag strings.
 */
export function enrichWithSwflKeywords(data: ScrapedListingData): string[] {
  const keywords = swflKeywords as KeywordsData
  const matchedTags = new Set<string>()

  const searchText = [
    data.description || '',
    ...(data.features || []),
    data.neighborhood || '',
  ]
    .join(' ')
    .toLowerCase()

  for (const [ruleName, rule] of Object.entries(keywords)) {
    if (ruleName === 'cities') continue
    const r = rule as KeywordRule

    if (r.yearBuiltAfter && data.yearBuilt) {
      if (data.yearBuilt > r.yearBuiltAfter) {
        r.tags.forEach((t) => matchedTags.add(t))
      }
      continue
    }

    if (r.lotSizeAcresMin) {
      const lotStr = data.lotSize || ''
      const lotMatch = lotStr.match(/([\d.]+)\s*(acres?|ac)/i)
      if (lotMatch && parseFloat(lotMatch[1]) >= r.lotSizeAcresMin) {
        r.tags.forEach((t) => matchedTags.add(t))
      }
      continue
    }

    if (r.cityTrigger) {
      if (data.city.toLowerCase() === r.cityTrigger.toLowerCase()) {
        if (r.requiresTags) {
          const hasRequired = r.requiresTags.some((req) => matchedTags.has(req))
          if (hasRequired) r.tags.forEach((t) => matchedTags.add(t))
        } else {
          r.tags.forEach((t) => matchedTags.add(t))
        }
      }
      continue
    }

    if (r.triggers && r.triggers.length > 0) {
      const matched = r.triggers.some((trigger) =>
        searchText.includes(trigger.toLowerCase())
      )
      if (matched) {
        r.tags.forEach((t) => matchedTags.add(t))
      }
    }
  }

  return Array.from(matchedTags)
}

/**
 * Returns the county name for a given SWFL city.
 */
export function deriveCounty(city: string): string {
  const countyMap: Record<string, string> = {
    'Cape Coral': 'Lee',
    'Fort Myers': 'Lee',
    'Fort Myers Beach': 'Lee',
    'Bonita Springs': 'Lee',
    'Estero': 'Lee',
    'Lehigh Acres': 'Lee',
    'Sanibel': 'Lee',
    'Naples': 'Collier',
    'Marco Island': 'Collier',
    'Immokalee': 'Collier',
    'Punta Gorda': 'Charlotte',
    'Port Charlotte': 'Charlotte',
    'Englewood': 'Charlotte',
  }
  return countyMap[city] || 'Lee'
}
