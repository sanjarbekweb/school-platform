import { cookies, headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

export interface SessionUser {
  id: string | number
  email: string
  name: string
  role: 'admin' | 'editor' | 'teacher'
  linkedStaff?: string | number | null
}

/**
 * Retrieves currently authenticated user from Payload session cookie
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const payload = await getPayloadClient()
    const reqHeaders = await headers()
    
    // Check Payload auth using request headers (which includes cookies)
    const { user } = await payload.auth({ headers: reqHeaders })
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: (user as any).name || user.email,
      role: (user as any).role || 'teacher',
      linkedStaff: typeof (user as any).linkedStaff === 'object'
        ? (user as any).linkedStaff?.id
        : (user as any).linkedStaff,
    }
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('Dynamic server usage')) {
      throw err
    }
    console.error('Failed to resolve current user session:', err)
    return null
  }
}

/**
 * In-memory rate limiter for login attempts to protect against brute-force attacks
 */
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string, maxAttempts = 5, windowMs = 60000): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record || record.resetAt <= now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (record.count >= maxAttempts) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000)
    return { allowed: false, retryAfterSeconds }
  }

  record.count++
  return { allowed: true }
}

export function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip)
}
