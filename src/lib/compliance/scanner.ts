import type { ComplianceScanResult, ComplianceFlag } from '@/types/content'
import { getBlockedTerms } from './blocklist'

/**
 * Scans text for MLS compliance violations and overused/low-quality terms.
 * Returns a ComplianceScanResult with all flags.
 */
export function scanForCompliance(text: string): ComplianceScanResult {
  const blockedTerms = getBlockedTerms()
  const flags: ComplianceFlag[] = []
  const lowerText = text.toLowerCase()

  const allTerms: Array<{
    term: string
    category: ComplianceFlag['category']
    severity: ComplianceFlag['severity']
    replacement: string
  }> = [
    ...blockedTerms.fairHousing.map((term: string) => ({
      term,
      category: 'fairHousing' as const,
      severity: 'high' as const,
      replacement: getFairHousingReplacement(term),
    })),
    ...blockedTerms.unsubstantiated.map((term: string) => ({
      term,
      category: 'unsubstantiated' as const,
      severity: 'medium' as const,
      replacement: getUnsubstantiatedReplacement(term),
    })),
    ...blockedTerms.overused.map((term: string) => ({
      term,
      category: 'overused' as const,
      severity: 'low' as const,
      replacement: getOverusedReplacement(term),
    })),
  ]

  for (const { term, category, severity, replacement } of allTerms) {
    const termLower = term.toLowerCase()
    let searchStart = 0

    while (true) {
      const pos = lowerText.indexOf(termLower, searchStart)
      if (pos === -1) break

      const before = pos > 0 ? lowerText[pos - 1] : ' '
      const after = pos + termLower.length < lowerText.length ? lowerText[pos + termLower.length] : ' '
      const isWordBoundaryBefore = /[\s,."'!?;:([\-]/.test(before) || pos === 0
      const isWordBoundaryAfter = /[\s,."'!?;:)\]\-]/.test(after) || pos + termLower.length === lowerText.length

      if (isWordBoundaryBefore && isWordBoundaryAfter) {
        flags.push({ term, category, severity, position: pos, replacement })
        break
      }

      searchStart = pos + 1
    }
  }

  return { isClean: flags.length === 0, flags }
}

function getFairHousingReplacement(term: string): string {
  const replacements: Record<string, string> = {
    'master bedroom': 'primary bedroom',
    'master suite': 'primary suite',
    'master bath': 'primary bath',
    'perfect for families': 'great for entertaining',
    'family neighborhood': 'established community',
    'bachelor pad': 'contemporary residence',
    'man cave': 'bonus room',
  }
  return replacements[term.toLowerCase()] || '[remove phrase]'
}

function getUnsubstantiatedReplacement(term: string): string {
  const replacements: Record<string, string> = {
    best: 'one of the finest',
    '#1': 'top-ranked',
    'number one': 'highly sought-after',
    guaranteed: '[remove — cannot guarantee]',
    'will appreciate': 'in a growing market',
    'below market value': 'competitively priced',
  }
  return replacements[term.toLowerCase()] || '[requires substantiation]'
}

function getOverusedReplacement(term: string): string {
  const replacements: Record<string, string> = {
    nestled: 'situated',
    boasts: 'features',
    stunning: 'striking',
    'dream home': 'exceptional home',
    'must-see': 'worth a visit',
    'won\'t last long': 'available now',
    'motivated seller': '[remove — unprofessional]',
    turnkey: 'move-in ready',
    charming: 'inviting',
    cozy: 'intimate',
    spacious: 'generously sized',
    breathtaking: 'impressive',
    gorgeous: 'beautifully designed',
    immaculate: 'meticulously maintained',
  }
  return replacements[term.toLowerCase()] || '[find fresher language]'
}
