import { z } from 'zod'

export type AgentTier = 'Bundled' | 'Single' | 'Monthly-5' | 'Monthly-15'

export interface Agent {
  id: string
  name: string
  email?: string
  phone?: string
  instagramHandle?: string
  facebookPageUrl?: string
  brokerage?: string
  preferredTone?: string
  defaultCta?: string
  headshotUrl?: string
  logoUrl?: string
  googleDriveFolderId?: string
  tier?: AgentTier
  active: boolean
  notes?: string
}

export const AgentSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  instagramHandle: z.string().optional(),
  facebookPageUrl: z.string().url().optional().or(z.literal('')),
  brokerage: z.string().optional(),
  preferredTone: z.enum(['Luxury', 'Family-Friendly', 'Investor-Focused', 'First-Time Buyer', 'Neutral']).optional(),
  defaultCta: z.string().optional(),
  headshotUrl: z.string().url().optional().or(z.literal('')),
  logoUrl: z.string().url().optional().or(z.literal('')),
  tier: z.enum(['Bundled', 'Single', 'Monthly-5', 'Monthly-15']).optional(),
  active: z.boolean().default(true),
  notes: z.string().optional(),
})

export type AgentInput = z.infer<typeof AgentSchema>
