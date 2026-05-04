import type { ToneType } from '@/types/listing'

interface ToneProfile {
  voice: string
  vocabulary: string[]
  avoid: string[]
  ctaStyle: string
  hashtagStyle: string
}

const TONE_PROFILES: Record<ToneType, ToneProfile> = {
  Luxury: {
    voice: 'Refined, aspirational, understated confidence. Write like a luxury concierge — not a used-car salesman.',
    vocabulary: ['curated', 'bespoke', 'elevated', 'retreat', 'exclusive', 'premier', 'sophisticated', 'resort-style'],
    avoid: ['cheap', 'bargain', 'deal', 'affordable', 'budget', 'starter home'],
    ctaStyle: 'Private showing or exclusive preview invitation.',
    hashtagStyle: 'Mix luxury lifestyle tags with SWFL location tags. Avoid high-volume generic tags.',
  },
  'Family-Friendly': {
    voice: 'Warm, welcoming, community-oriented. Highlight space, schools, safety, and neighborhood feel.',
    vocabulary: ['spacious', 'community', 'top-rated schools', 'safe neighborhood', 'room to grow', 'family memories'],
    avoid: ['bachelor', 'investor', 'STR', 'income-producing'],
    ctaStyle: 'Schedule a family tour — bring the kids.',
    hashtagStyle: 'Focus on family lifestyle, neighborhood, and school district tags.',
  },
  'Investor-Focused': {
    voice: 'Direct, data-driven, ROI-focused. Speak to numbers, cap rates, rental income potential, and appreciation.',
    vocabulary: ['cap rate', 'cash flow', 'appreciation', 'rental income', 'STR eligible', 'turn-key', 'value-add'],
    avoid: ['cozy', 'charming', 'homey', 'perfect for families'],
    ctaStyle: 'Request the pro forma or investment analysis.',
    hashtagStyle: 'Focus on real estate investing, STR, and market-specific investment tags.',
  },
  'First-Time Buyer': {
    voice: 'Encouraging, educational, jargon-free. Demystify the process. Celebrate the milestone.',
    vocabulary: ['move-in ready', 'low maintenance', 'starter', 'first home', 'manageable', 'great value', 'VA eligible'],
    avoid: ['luxury', 'exclusive', 'private', 'high-end'],
    ctaStyle: 'Let\'s talk about financing options and get you pre-approved.',
    hashtagStyle: 'First-time buyer education tags, affordability, and community tags.',
  },
  Neutral: {
    voice: 'Clear, professional, feature-forward. Let the property speak for itself without heavy style lean.',
    vocabulary: ['features', 'includes', 'offers', 'provides', 'highlights', 'showcases'],
    avoid: [],
    ctaStyle: 'Schedule a showing or reach out for more details.',
    hashtagStyle: 'Balanced mix of location, property type, and lifestyle tags.',
  },
}

/**
 * Returns tone-specific writing instructions to inject into prompt templates.
 */
export function getToneInstructions(tone: ToneType): string {
  const profile = TONE_PROFILES[tone] ?? TONE_PROFILES['Neutral']
  return [
    `TONE: ${tone}`,
    `VOICE: ${profile.voice}`,
    `PREFERRED VOCABULARY: ${profile.vocabulary.join(', ')}`,
    profile.avoid.length > 0 ? `AVOID THESE WORDS FOR THIS TONE: ${profile.avoid.join(', ')}` : '',
    `CTA STYLE: ${profile.ctaStyle}`,
    `HASHTAG STYLE: ${profile.hashtagStyle}`,
  ]
    .filter(Boolean)
    .join('\n')
}
