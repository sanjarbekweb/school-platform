import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { sanitizeRedirectTarget } from '@/lib/redirects'

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path')
  if (!path) {
    return NextResponse.json({ found: false }, { status: 400 })
  }

  try {
    const payload = await getPayloadClient()
    const cleanPath = path.trim()
    const pathNoSlash = cleanPath.endsWith('/') && cleanPath.length > 1 ? cleanPath.slice(0, -1) : cleanPath
    const pathWithSlash = pathNoSlash + '/'

    const res = await payload.find({
      collection: 'redirects',
      where: {
        or: [
          { from: { equals: pathNoSlash } },
          { from: { equals: pathWithSlash } },
        ],
      },
      limit: 1,
    })

    const doc = res.docs[0] as any
    if (doc?.to) {
      const safeTarget = sanitizeRedirectTarget(pathNoSlash, doc.to)
      if (safeTarget) {
        const rawCode = String(doc.statusCode || '301').trim()
        const statusCode = rawCode.startsWith('302') ? 302 : 301
        return NextResponse.json({
          found: true,
          to: safeTarget,
          statusCode,
        })
      }
    }

    return NextResponse.json({ found: false })
  } catch (err) {
    return NextResponse.json({ found: false }, { status: 500 })
  }
}
