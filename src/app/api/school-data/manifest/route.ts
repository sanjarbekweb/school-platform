import { NextResponse } from 'next/server'
import { getCachedSchoolManifest } from '@/lib/data/cached'

export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  const data = await getCachedSchoolManifest()

  return NextResponse.json(data, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Data-Source': 'static-memory-cache',
    },
  })
}
