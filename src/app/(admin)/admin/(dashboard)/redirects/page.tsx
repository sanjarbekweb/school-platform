import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getPayloadClient } from '@/lib/payload'
import { RedirectManager } from '@/components/admin/RedirectManager'

export default async function AdminRedirectsPage() {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') {
    redirect('/admin')
  }

  const payload = await getPayloadClient()
  const redirectsRes = await payload.find({
    collection: 'redirects',
    limit: 100,
    sort: 'from',
  }).catch(() => ({ docs: [] }))

  return (
    <RedirectManager
      initialRedirects={redirectsRes.docs as any[]}
      currentUser={user}
    />
  )
}
