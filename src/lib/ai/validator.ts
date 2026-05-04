import { countWords, countChars } from './parser'
import type { ContentType } from '@/types/content'

export interface ContentQAResult {
  contentType: ContentType
  passed: boolean
  warnings: string[]
  metrics: Record<string, number | string>
}

/**
 * Validates generated content against per-type quality rules.
 * Logs warnings but does NOT block saving — advisory only.
 */
export function validateContentQuality(
  contentType: ContentType,
  text: string
): ContentQAResult {
  const warnings: string[] = []
  const metrics: Record<string, number | string> = {}

  switch (contentType) {
    case 'Instagram': {
      const wordCount = countWords(text)
      metrics.wordCount = wordCount
      if (wordCount < 150) warnings.push(`Too short: ${wordCount} words (target 150-300 per variant)`)
      if (wordCount > 1200) warnings.push(`May be too long: ${wordCount} words for 3 variants`)
      const emojiCount = (text.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || []).length
      metrics.emojiCount = emojiCount
      if (emojiCount < 3) warnings.push(`Only ${emojiCount} emojis — target 3-6 per caption`)
      if (emojiCount > 25) warnings.push(`${emojiCount} emojis may be excessive`)
      break
    }

    case 'Facebook': {
      const wordCount = countWords(text)
      metrics.wordCount = wordCount
      if (wordCount < 150) warnings.push(`Too short: ${wordCount} words (target 200-500 per variant)`)
      if (wordCount > 1500) warnings.push(`Too long: ${wordCount} words for 2 variants`)
      break
    }

    case 'MLS': {
      const shortMatch = text.match(/SHORT VERSION[:\s\n]+([\s\S]+?)(?=LONG VERSION|$)/i)
      const longMatch = text.match(/LONG VERSION[:\s\n]+([\s\S]+?)$/i)

      if (shortMatch) {
        const shortText = shortMatch[1].replace(/\(\d+\s*chars?\)/i, '').trim()
        const shortChars = countChars(shortText)
        metrics.shortVersionChars = shortChars
        if (shortChars > 520) {
          warnings.push(`Short version is ${shortChars} chars — should be under 500`)
        }
      } else {
        warnings.push('Could not find SHORT VERSION section in MLS response')
      }

      if (longMatch) {
        const longText = longMatch[1].replace(/\(\d+\s*chars?\)/i, '').trim()
        const longChars = countChars(longText)
        metrics.longVersionChars = longChars
        if (longChars > 1050) {
          warnings.push(`Long version is ${longChars} chars — should be under 1,000`)
        }
      } else {
        warnings.push('Could not find LONG VERSION section in MLS response')
      }
      break
    }

    case 'Email': {
      const subjectLines = (text.match(/SUBJECT LINE\s*(?:\d+)?[:\s].+/gi) || [])
      metrics.subjectLineCount = subjectLines.length
      if (subjectLines.length < 1) {
        warnings.push(`No subject lines found — expected SUBJECT LINE: format`)
      }
      subjectLines.forEach((line, i) => {
        const subject = line.replace(/^SUBJECT LINE\s*(?:\d+)?[:\s]+/i, '').trim()
        if (subject.length > 50) {
          warnings.push(`Subject line ${i + 1} is ${subject.length} chars — should be under 50`)
        }
      })
      break
    }

    case 'Reel Script': {
      const byWord = (text.match(/(?:SHOT|Shot|Scene|Clip|Segment|CUT)\s*(?:#\s*)?\d+/gi) || []).length
      const byDuration = (text.match(/\(\d+s\)/g) || []).length
      const byNumberedLine = (text.match(/^\s*\d+[\.\)]\s+\S/gm) || []).length
      const shots = Math.max(byWord, byDuration, byNumberedLine)
      metrics.shotCount = shots
      if (shots < 4) warnings.push(`Only ${shots} shots detected — a 30-60 sec reel needs 5-10`)
      const hasRuntime = /\d+[-–]\d+\s*s(?:ec)?|\(\d+s\)|\d+\s*(?:seconds?|minutes?)/i.test(text)
      if (!hasRuntime) warnings.push('No runtime indicator found in reel script')
      break
    }

    case 'Hashtags': {
      const allTags = (text.match(/#\w+/g) || [])
      const uniqueTags = new Set(allTags.map((t) => t.toLowerCase()))
      metrics.totalHashtags = allTags.length
      metrics.uniqueHashtags = uniqueTags.size
      if (uniqueTags.size < 30) {
        warnings.push(`Only ${uniqueTags.size} unique hashtags — target 30 main + 15 first comment`)
      }
      break
    }
  }

  const passed = warnings.length === 0

  return { contentType, passed, warnings, metrics }
}
