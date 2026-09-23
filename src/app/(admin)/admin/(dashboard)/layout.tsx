import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminOverview } from '@/lib/data/admin'
import { AdminShell } from '@/components/admin/AdminShell'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/admin/login')
  }

  let reviewCount = 0
  try {
    const overview = await getAdminOverview(user)
    reviewCount = overview.stats.reviewNewsCount
  } catch {
    // Graceful fallback if overview query fails
  }

  return (
    <AdminShell user={user} reviewNewsCount={reviewCount}>
      {children}
    </AdminShell>
  )
}
