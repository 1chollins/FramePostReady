import type { ParsedVariant } from '@/types/content'

const VARIANT_SEPARATOR = '---'

/**
 * Splits a Claude response into labeled variants.
 * Expects variants separated by "---" with optional header labels like:
 * "VARIANT 1 — HOOK-DRIVEN" or "VARIANT 1 - HOOK-DRIVEN"
 */
export function parseVariants(responseText: string): ParsedVariant[] {
  const parts = responseText.split(/\n---\n|\n---$|^---\n/m).map((p) => p.trim()).filter(Boolean)

  if (parts.length <= 1) {
    console.warn('parseVariants: No separator found — returning single variant')
    return [{ label: 'Default', text: responseText.trim() }]
  }

  return parts.map((part) => {
    const lines = part.split('\n')
    const firstLine = lines[0].trim()

    const labelMatch = firstLine.match(
      /^(?:VARIANT\s*\d+\s*[—–-]+\s*)?(.+)$/i
    )

    const isHeader =
      labelMatch &&
      (firstLine.toUpperCase() === firstLine ||
        firstLine.startsWith('VARIANT') ||
        firstLine.startsWith('##') ||
        firstLine.startsWith('**'))

    if (isHeader && lines.length > 1) {
      const label = firstLine
        .replace(/^#+\s*/, '')
        .replace(/^\*+|\*+$/g, '')
        .replace(/^VARIANT\s*\d+\s*[—–-]+\s*/i, '')
        .trim()
      const text = lines.slice(1).join('\n').trim()
      return { label, text }
    }

    return { label: `Variant ${parts.indexOf(part) + 1}`, text: part }
  })
}

/**
 * Counts words in a string.
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/**
 * Counts characters in a string (including spaces).
 */
export function countChars(text: string): number {
  return text.length
}

/**
 * Extracts a labeled section from text.
 * e.g. extractSection("SUBJECT LINE 1: Hello World", "SUBJECT LINE 1") => "Hello World"
 */
export function extractSection(text: string, label: string): string | null {
  const regex = new RegExp(`${label}:?\\s*(.+?)(?=\\n[A-Z]|$)`, 'is')
  const match = text.match(regex)
  return match ? match[1].trim() : null
}

/**
 * Extracts all lines matching a pattern like "SUBJECT LINE 1: ..."
 */
export function extractLabeledLines(
  text: string,
  prefix: string
): string[] {
  const lines = text.split('\n')
  const results: string[] = []
  for (const line of lines) {
    if (line.toLowerCase().startsWith(prefix.toLowerCase())) {
      const value = line.replace(/^[^:]+:\s*/, '').trim()
      if (value) results.push(value)
    }
  }
  return results
}
