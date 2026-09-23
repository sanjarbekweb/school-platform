import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminDocument } from '@/lib/data/admin'
import { StaffEditor } from '@/components/admin/editors/StaffEditor'

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const { id } = await params

  // Enforce teacher authorization strictly
  if (user.role === 'teacher' && String(user.linkedStaff) !== String(id)) {
    redirect('/admin')
  }

  let docData: any = null
  let versions: any[] = []

  try {
    const res = await getAdminDocument('staff', id, user)
    docData = res.doc
    versions = res.versions
  } catch {
    notFound()
  }

  if (!docData) notFound()

  return (
    <StaffEditor
      initialDoc={docData}
      versions={versions}
      currentUser={user}
    />
  )
}
