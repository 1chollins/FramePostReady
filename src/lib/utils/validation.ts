export interface ZillowUrlValidation {
  isValid: boolean
  zpid: string | null
  normalizedUrl: string | null
  error: string | null
}

/**
 * Validates a Zillow listing URL and extracts the ZPID.
 * Supports formats like:
 * - https://www.zillow.com/homedetails/address/12345678_zpid/
 * - https://zillow.com/homes/for_sale/12345678_zpid/
 */
export function validateZillowUrl(url: string): ZillowUrlValidation {
  const trimmed = url.trim()

  if (!trimmed) {
    return { isValid: false, zpid: null, normalizedUrl: null, error: 'URL is required' }
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(trimmed)
  } catch {
    return { isValid: false, zpid: null, normalizedUrl: null, error: 'Invalid URL format' }
  }

  if (!parsedUrl.hostname.includes('zillow.com')) {
    return {
      isValid: false,
      zpid: null,
      normalizedUrl: null,
      error: 'URL must be a Zillow listing URL (zillow.com)',
    }
  }

  const zpidMatch =
    parsedUrl.pathname.match(/(\d{7,10})(?:_zpid)?/) ||
    parsedUrl.pathname.match(/\/homedetails\/[^/]+\/(\d{7,10})\/?$/)
  if (!zpidMatch) {
    return {
      isValid: false,
      zpid: null,
      normalizedUrl: null,
      error: 'Could not extract ZPID from URL — make sure this is a specific property listing page',
    }
  }

  const zpid = zpidMatch[1]

  const hdpMatch = parsedUrl.pathname.match(/\/homedetails\/(.+?)\/(\d{7,10})/)
  const normalizedUrl = hdpMatch
    ? `https://www.zillow.com/homedetails/${hdpMatch[1]}/${zpid}_zpid/`
    : `https://www.zillow.com/homedetails/${zpid}_zpid/`

  return { isValid: true, zpid, normalizedUrl, error: null }
}

/**
 * Formats a number as a currency string without the symbol.
 * e.g. 425000 => "425,000"
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US')
}

/**
 * Returns true if a string is a valid Airtable record ID.
 */
export function isAirtableId(id: string): boolean {
  return /^rec[a-zA-Z0-9]{14}$/.test(id)
}
