import type { EmailType, PropertyType } from '@/types/listing'
import swflKeywords from '../../../data/swfl-keywords.json'

interface CityKeywordsData {
  cities?: Record<string, string[]>
}

/**
 * Returns email-type-specific instructions to inject into the Email prompt template.
 */
export function getEmailTypeInstructions(emailType: EmailType): string {
  const instructions: Record<EmailType, string> = {
    'Just Listed': [
      'This is a JUST LISTED announcement.',
      'Urgency hook: Fresh to market, first chance to see it.',
      'Subject lines should emphasize "just listed" and the property highlight.',
      'Body should build excitement and drive immediate showing requests.',
      'CTA: Schedule a private showing or visit the open house.',
    ].join('\n'),

    'Open House': [
      'This is an OPEN HOUSE invitation.',
      'Include the open house date/time prominently — do not bury it.',
      'Subject lines should lead with the date or event framing.',
      'Body should describe what attendees will experience, not just the property specs.',
      'CTA: RSVP or simply show up — make it feel like an event worth attending.',
    ].join('\n'),

    'Price Reduction': [
      'This is a PRICE REDUCTION announcement.',
      'Lead with the new price and the reduction amount — this is the news.',
      'Subject lines should highlight the savings or value opportunity.',
      'Tone: Opportunity framing, not desperation. "Smart buy" not "deal gone wrong."',
      'CTA: Act now while the price is this competitive.',
    ].join('\n'),

    'Back on Market': [
      'This is a BACK ON MARKET re-announcement.',
      'Acknowledge it returned to market without dwelling on why.',
      'Subject lines: Frame it as a second chance or rare opportunity.',
      'Tone: Positive spin — "Another chance to make it yours."',
      'CTA: Move fast — motivated seller, ready to close.',
    ].join('\n'),

    'Under Contract': [
      'This is an UNDER CONTRACT status update for marketing purposes.',
      'Use this to showcase your track record — "just went under contract."',
      'Subject lines: Social proof framing — "Another one sold."',
      'Body: Brief property recap + agent credibility statement.',
      'CTA: Ask if they have similar needs — lead generation play.',
    ].join('\n'),
  }

  return instructions[emailType] ?? instructions['Just Listed']
}

/**
 * Returns city-specific seed hashtags from swfl-keywords.json.
 */
export function getCityHashtags(city: string): string {
  const data = swflKeywords as CityKeywordsData
  const cityMap = data.cities ?? {}
  const tags = cityMap[city] ?? cityMap['Cape Coral'] ?? []
  return tags.join(' ')
}

/**
 * Returns property-type-specific reel shot suggestions.
 */
export function getReelContext(propertyType: PropertyType, swflKeywords: string[]): string {
  const keywordsLower = swflKeywords.map((k) => k.toLowerCase())
  const hasPool = keywordsLower.some((k) => k.includes('pool'))
  const hasWaterfront = keywordsLower.some((k) => k.includes('waterfront') || k.includes('canal') || k.includes('gulf access'))
  const hasLanai = keywordsLower.some((k) => k.includes('outdoor') || k.includes('lanai'))

  const baseShots: string[] = []

  switch (propertyType) {
    case 'Single Family':
      baseShots.push(
        'SHOT 1 (3s): Aerial or wide exterior approach',
        'SHOT 2 (3s): Front door / entryway walk-in',
        'SHOT 3 (4s): Main living area wide shot',
        'SHOT 4 (3s): Kitchen — appliances and counter space',
        'SHOT 5 (3s): Primary bedroom',
        'SHOT 6 (4s): Primary bath or most impressive bathroom',
      )
      break
    case 'Condo':
      baseShots.push(
        'SHOT 1 (3s): Building exterior or lobby entrance',
        'SHOT 2 (3s): Entry and open floor plan',
        'SHOT 3 (4s): Living area with view (if applicable)',
        'SHOT 4 (3s): Kitchen and dining area',
        'SHOT 5 (3s): Primary bedroom',
        'SHOT 6 (4s): Balcony or community amenities',
      )
      break
    default:
      baseShots.push(
        'SHOT 1 (3s): Exterior wide shot',
        'SHOT 2 (3s): Entryway',
        'SHOT 3 (4s): Main living space',
        'SHOT 4 (3s): Kitchen',
        'SHOT 5 (3s): Primary bedroom',
        'SHOT 6 (4s): Best feature of the property',
      )
  }

  const featureShots: string[] = []
  if (hasPool) featureShots.push('FEATURE SHOT: Pool/spa — slow pan or overhead drone')
  if (hasWaterfront) featureShots.push('FEATURE SHOT: Canal/water view — dock walk or water-level drone')
  if (hasLanai) featureShots.push('FEATURE SHOT: Lanai/outdoor living — golden hour if possible')

  const allShots = [...baseShots, ...featureShots, 'FINAL SHOT (3s): Agent name card / CTA text overlay']

  return allShots.join('\n')
}
