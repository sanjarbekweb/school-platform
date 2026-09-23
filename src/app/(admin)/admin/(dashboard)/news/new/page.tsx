import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getPayloadClient } from '@/lib/payload'
import { NewsEditor } from '@/components/admin/editors/NewsEditor'

export default async function NewNewsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const payload = await getPayloadClient()
  const staffRes = await payload.find({
    collection: 'staff',
    limit: 100,
    sort: 'fullName',
  }).catch(() => ({ docs: [] }))

  const staffList = staffRes.docs.map((s: any) => ({
    id: s.id,
    fullName: s.fullName,
  }))

  return (
    <NewsEditor
      currentUser={user}
      staffList={staffList}
    />
  )
}
