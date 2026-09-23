import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { NoticeEditor } from '@/components/admin/editors/NoticeEditor'

export default async function NewNoticePage() {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  return <NoticeEditor currentUser={user} />
}
