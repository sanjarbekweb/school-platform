import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { PageEditor } from '@/components/admin/editors/PageEditor'

export default async function NewPage() {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  return <PageEditor currentUser={user} />
}
