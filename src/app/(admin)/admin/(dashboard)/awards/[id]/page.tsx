import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminDocument } from '@/lib/data/admin'
import { AwardEditor } from '@/components/admin/editors/AwardEditor'

export default async function EditAwardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  const { id } = await params
  let docData: any = null

  try {
    const res = await getAdminDocument('awards', id, user)
    docData = res.doc
  } catch {
    notFound()
  }

  if (!docData) notFound()

  return <AwardEditor initialDoc={docData} currentUser={user} />
}
