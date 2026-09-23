import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminDocument } from '@/lib/data/admin'
import { PageEditor } from '@/components/admin/editors/PageEditor'

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  const { id } = await params
  let docData: any = null

  try {
    const res = await getAdminDocument('pages', id, user)
    docData = res.doc
  } catch {
    notFound()
  }

  if (!docData) notFound()

  return <PageEditor initialDoc={docData} currentUser={user} />
}
