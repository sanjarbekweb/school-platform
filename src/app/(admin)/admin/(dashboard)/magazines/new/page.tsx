import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { MagazineEditor } from '@/components/admin/editors/MagazineEditor'

export default async function NewMagazinePage() {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  return <MagazineEditor currentUser={user} />
}
