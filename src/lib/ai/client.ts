import Anthropic from '@anthropic-ai/sdk'
import type { ClaudeCallResult } from '@/types/content'

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY environment variable is not set')
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const DEFAULT_MODEL = 'claude-sonnet-4-6'
const DEFAULT_MAX_TOKENS = 2000
const DEFAULT_TEMPERATURE = 0.7

export async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  options: {
    temperature?: number
    maxTokens?: number
    retries?: number
  } = {}
): Promise<ClaudeCallResult> {
  const {
    temperature = DEFAULT_TEMPERATURE,
    maxTokens = DEFAULT_MAX_TOKENS,
    retries = 1,
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      })

      const textContent = response.content.find((c) => c.type === 'text')
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text content in Claude response')
      }

      return {
        text: textContent.text,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
        console.warn(`Claude API attempt ${attempt + 1} failed, retrying in ${delay}ms...`)
      }
    }
  }

  throw lastError ?? new Error('Claude API call failed')
}

export function calculateCost(inputTokens: number, outputTokens: number): number {
  const INPUT_COST_PER_MILLION = 3.0
  const OUTPUT_COST_PER_MILLION = 15.0
  return (
    (inputTokens / 1_000_000) * INPUT_COST_PER_MILLION +
    (outputTokens / 1_000_000) * OUTPUT_COST_PER_MILLION
  )
}
