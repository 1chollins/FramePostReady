import blockedTermsData from '../../../data/blocked-terms.json'
import shadowbannedData from '../../../data/shadowbanned-hashtags.json'

interface BlockedTerms {
  fairHousing: string[]
  unsubstantiated: string[]
  overused: string[]
}

interface ShadowbannedData {
  shadowbanned: string[]
  restricted: string[]
  realEstateAvoid: string[]
}

export function getBlockedTerms(): BlockedTerms {
  return blockedTermsData as BlockedTerms
}

export function getShadowbannedHashtags(): string[] {
  const data = shadowbannedData as ShadowbannedData
  return [...data.shadowbanned, ...data.restricted]
}

export function isHashtagShadowbanned(hashtag: string): boolean {
  const normalized = hashtag.toLowerCase().replace(/^#/, '')
  const list = getShadowbannedHashtags().map((h) => h.toLowerCase().replace(/^#/, ''))
  return list.includes(normalized)
}

export function filterShadowbannedHashtags(hashtags: string[]): string[] {
  return hashtags.filter((tag) => !isHashtagShadowbanned(tag))
}
