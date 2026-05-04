/**
 * Formats a price number as a currency display string.
 * e.g. 425000 => "$425,000"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Formats a number with commas.
 * e.g. 1850 => "1,850"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

/**
 * Truncates a string to a max length, appending "..." if truncated.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * Counts words in a string.
 */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/**
 * Counts characters in a string (including spaces).
 */
export function charCount(text: string): number {
  return text.length
}

/**
 * Formats a date string for display.
 * e.g. "2026-03-12T14:00:00.000Z" => "Mar 12, 2026"
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Converts a camelCase or snake_case string to Title Case.
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

/**
 * Returns a content status badge color class for Tailwind.
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Queued: 'bg-gray-100 text-gray-600',
    Scraping: 'bg-blue-100 text-blue-700',
    'Scrape Complete': 'bg-blue-100 text-blue-700',
    'Scrape Failed': 'bg-red-100 text-red-700',
    Generating: 'bg-yellow-100 text-yellow-700',
    'Content Ready': 'bg-green-100 text-green-700',
    Delivered: 'bg-purple-100 text-purple-700',
    Archived: 'bg-gray-100 text-gray-500',
  }
  return colors[status] || 'bg-gray-100 text-gray-600'
}
