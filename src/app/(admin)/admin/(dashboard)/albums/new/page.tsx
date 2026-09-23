import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { AlbumEditor } from '@/components/admin/editors/AlbumEditor'

export default async function NewAlbumPage() {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  return <AlbumEditor currentUser={user} />
}
