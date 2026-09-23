import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminDocument } from '@/lib/data/admin'
import { getPayloadClient } from '@/lib/payload'
import { NewsEditor } from '@/components/admin/editors/NewsEditor'

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const { id } = await params

  let docData: any = null
  let versions: any[] = []

  try {
    const res = await getAdminDocument('news', id, user)
    docData = res.doc
    versions = res.versions
  } catch {
    notFound()
  }

  if (!docData) notFound()

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
      initialDoc={docData}
      versions={versions}
      staffList={staffList}
      currentUser={user}
    />
  )
}
