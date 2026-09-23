import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { StaffEditor } from '@/components/admin/editors/StaffEditor'

export default async function NewStaffPage() {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  return <StaffEditor currentUser={user} />
}
