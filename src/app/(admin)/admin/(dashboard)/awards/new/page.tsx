import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { AwardEditor } from '@/components/admin/editors/AwardEditor'

export default async function NewAwardPage() {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  return <AwardEditor currentUser={user} />
}
