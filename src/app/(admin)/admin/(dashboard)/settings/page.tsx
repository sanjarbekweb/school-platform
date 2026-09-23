import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getPayloadClient } from '@/lib/payload'
import { SiteSettingsEditor } from '@/components/admin/SiteSettingsEditor'

export default async function AdminSettingsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    redirect('/admin')
  }

  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => ({}))

  return <SiteSettingsEditor initialSettings={settings} />
}
