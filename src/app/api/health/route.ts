import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startTime = Date.now()

  try {
    const payload = await getPayloadClient()
    
    // Quick database ping
    await payload.find({
      collection: 'users',
      limit: 1,
    })

    const latencyMs = Date.now() - startTime

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        database: 'connected',
        latencyMs,
        version: '1.0.0',
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error?.message || 'Database connection error',
      },
      { status: 503 }
    )
  }
}
