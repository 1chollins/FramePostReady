import { NextRequest, NextResponse } from 'next/server'
import { listAgents, createAgent } from '@/lib/airtable/agents'
import { AgentSchema } from '@/types/agent'
import type { ApiResponse } from '@/types/api'
import type { Agent } from '@/types/agent'

export async function GET() {
  try {
    const agents = await listAgents(true)
    return NextResponse.json<ApiResponse<Agent[]>>({ success: true, data: agents })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch agents'
    return NextResponse.json<ApiResponse>({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = AgentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      )
    }
    const agent = await createAgent({ ...parsed.data, active: parsed.data.active ?? true })
    return NextResponse.json<ApiResponse<Agent>>({ success: true, data: agent }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create agent'
    return NextResponse.json<ApiResponse>({ success: false, error: message }, { status: 500 })
  }
}
