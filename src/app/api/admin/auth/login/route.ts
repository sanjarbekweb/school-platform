import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { checkRateLimit } from '@/lib/auth/session'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
    const limit = checkRateLimit(ip, 5, 60000)

    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Juda ko‘p urinishlar qilindi. Iltimos, ${limit.retryAfterSeconds} soniyadan so‘ng qayta urinib ko‘ring.` },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Elektron pochta va parol kiritilishi shart.' },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()
    const result = await payload.login({
      collection: 'users',
      data: {
        email: email.trim().toLowerCase(),
        password,
      },
    })

    if (!result || !result.token || !result.user) {
      return NextResponse.json(
        { error: 'Elektron pochta yoki parol noto‘g‘ri.' },
        { status: 401 }
      )
    }

    const res = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: (result.user as any).name || result.user.email,
        role: (result.user as any).role || 'teacher',
      },
    })

    // Only enforce secure flag if protocol is actually HTTPS (allows localhost development & production on HTTP)
    const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.nextUrl.protocol === 'https:'

    // Set HTTP-only session cookie
    res.cookies.set('payload-token', result.token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return res
  } catch (err: any) {
    console.error('Login error:', err.message)
    return NextResponse.json(
      { error: 'Kirish paytida xatolik yuz berdi. Iltimos, ma’lumotlarni tekshiring.' },
      { status: 401 }
    )
  }
}
