import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminDocument } from '@/lib/data/admin'
import { AlbumEditor } from '@/components/admin/editors/AlbumEditor'

export default async function EditAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  const { id } = await params
  let docData: any = null

  try {
    const res = await getAdminDocument('albums', id, user)
    docData = res.doc
  } catch {
    notFound()
  }

  if (!docData) notFound()

  return <AlbumEditor initialDoc={docData} currentUser={user} />
}
