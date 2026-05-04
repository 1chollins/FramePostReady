export const SWFL_CITIES = [
  'Cape Coral',
  'Fort Myers',
  'Fort Myers Beach',
  'Naples',
  'Bonita Springs',
  'Estero',
  'Lehigh Acres',
  'Sanibel',
  'Marco Island',
  'Punta Gorda',
  'Port Charlotte',
  'Englewood',
] as const

export const TONE_OPTIONS = [
  { value: 'Luxury', label: 'Luxury' },
  { value: 'Family-Friendly', label: 'Family-Friendly' },
  { value: 'Investor-Focused', label: 'Investor-Focused' },
  { value: 'First-Time Buyer', label: 'First-Time Buyer' },
  { value: 'Neutral', label: 'Neutral' },
] as const

export const TARGET_BUYER_OPTIONS = [
  { value: 'Relocator', label: 'Relocator' },
  { value: 'Snowbird', label: 'Snowbird' },
  { value: 'First-Time Buyer', label: 'First-Time Buyer' },
  { value: 'Investor', label: 'Investor' },
  { value: 'Downsizer', label: 'Downsizer' },
  { value: 'Upsizer', label: 'Upsizer' },
  { value: 'Military/VA', label: 'Military/VA' },
] as const

export const EMAIL_TYPE_OPTIONS = [
  { value: 'Just Listed', label: 'Just Listed' },
  { value: 'Open House', label: 'Open House' },
  { value: 'Price Reduction', label: 'Price Reduction' },
  { value: 'Back on Market', label: 'Back on Market' },
  { value: 'Under Contract', label: 'Under Contract' },
] as const

export const CONTENT_TYPES = [
  'Instagram',
  'Facebook',
  'MLS',
  'Email',
  'Reel Script',
  'Hashtags',
] as const

export const MLS_LIMITS = {
  SHORT: 500,
  LONG: 1000,
} as const

export const INSTAGRAM_LIMITS = {
  MIN_WORDS: 150,
  MAX_WORDS: 300,
  MIN_EMOJIS: 3,
  MAX_EMOJIS: 6,
} as const

export const EMAIL_LIMITS = {
  SUBJECT_MAX_CHARS: 50,
  PREVIEW_MIN_CHARS: 40,
  PREVIEW_MAX_CHARS: 90,
  BODY_MIN_WORDS: 150,
  BODY_MAX_WORDS: 250,
} as const

export const REEL_LIMITS = {
  MIN_SECONDS: 25,
  MAX_SECONDS: 60,
} as const

export const HASHTAG_COUNTS = {
  MAIN_SET: 30,
  FIRST_COMMENT: 15,
} as const

export const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'colby@frameandformstudio.com'
