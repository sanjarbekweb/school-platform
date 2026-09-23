import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const secret = url.searchParams.get('secret') || request.headers.get('x-revalidate-secret')
    const expectedSecret = process.env.REVALIDATE_SECRET || process.env.PAYLOAD_SECRET || 'school_revalidate_token_2026'

    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const tag = body.tag || url.searchParams.get('tag')
    const path = body.path || url.searchParams.get('path')

    if (tag) {
      revalidateTag(tag)
      // Also purge manifest if any content tag is updated
      revalidateTag('manifest')
    }

    if (path) {
      revalidatePath(path)
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
      tag: tag || null,
      path: path || null,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Revalidation failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')
  const expectedSecret = process.env.REVALIDATE_SECRET || process.env.PAYLOAD_SECRET || 'school_revalidate_token_2026'

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 })
  }

  const tag = url.searchParams.get('tag')
  const path = url.searchParams.get('path')

  if (tag) {
    revalidateTag(tag)
    revalidateTag('manifest')
  }
  if (path) {
    revalidatePath(path)
  }

  return NextResponse.json({
    revalidated: true,
    timestamp: Date.now(),
    tag: tag || null,
    path: path || null,
  })
}
