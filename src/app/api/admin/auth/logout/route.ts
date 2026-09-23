import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('payload-token')
  return res
}

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url))
  res.cookies.delete('payload-token')
  return res
}
