export type ContentType =
  | 'Instagram'
  | 'Facebook'
  | 'MLS'
  | 'Email'
  | 'Reel Script'
  | 'Hashtags'

export type ContentBlockStatus = 'Draft' | 'Approved' | 'Exported' | 'Archived'

export interface ContentBlock {
  id: string
  listingId: string
  contentType: ContentType
  variantLabel: string
  generatedText: string
  version: number
  status: ContentBlockStatus
  promptTemplateUsed?: string
  tokenCountInput?: number
  tokenCountOutput?: number
  apiCost?: number
  generatedAt: string
  edited: boolean
  editNotes?: string
  complianceFlags?: ComplianceFlag[]
}

export interface ComplianceFlag {
  term: string
  category: 'fairHousing' | 'unsubstantiated' | 'overused'
  severity: 'high' | 'medium' | 'low'
  position: number
  replacement: string
}

export interface ComplianceScanResult {
  isClean: boolean
  flags: ComplianceFlag[]
}

export interface GenerationResult {
  listingId: string
  contentTypesGenerated: ContentType[]
  totalTokensInput: number
  totalTokensOutput: number
  totalCost: number
  timingMs: Partial<Record<ContentType, number>>
  errors: Partial<Record<ContentType, string | null>>
}

export interface ClaudeCallResult {
  text: string
  inputTokens: number
  outputTokens: number
}

export interface InstagramVariant {
  label: 'Hook-Driven' | 'Storytelling' | 'Direct CTA'
  text: string
  wordCount: number
}

export interface FacebookVariant {
  label: 'Community-Focused' | 'Feature-Focused'
  text: string
  wordCount: number
}

export interface MlsVersion {
  label: 'Short' | 'Long'
  text: string
  characterCount: number
  characterLimit: number
  isWithinLimit: boolean
  complianceFlags?: ComplianceFlag[]
}

export interface EmailContent {
  subjectLines: string[]
  previewText: string
  body: string
  ctaButtonText: string
}

export interface ReelShot {
  shotNumber: number
  duration: string
  visualDirection: string
  voiceoverOrOverlay: string
  notes?: string
}

export interface ReelScript {
  title: string
  style: 'Walkthrough' | 'Fast-Cut'
  totalRuntime: string
  musicCue: string
  shots: ReelShot[]
}

export interface HashtagResult {
  mainSet: string[]
  firstCommentSet: string[]
  categorized: {
    location: string[]
    propertyType: string[]
    lifestyle: string[]
    broadReach: string[]
  }
}

export interface ParsedVariant {
  label: string
  text: string
}
