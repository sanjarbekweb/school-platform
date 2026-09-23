import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getPayloadClient } from '@/lib/payload'
import { UserManager } from '@/components/admin/UserManager'

export default async function AdminUsersPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    redirect('/admin')
  }

  const payload = await getPayloadClient()
  const [usersRes, staffRes] = await Promise.all([
    payload.find({ collection: 'users', limit: 100, sort: 'name' }),
    payload.find({ collection: 'staff', limit: 100, sort: 'fullName' }),
  ])

  const staffList = staffRes.docs.map((s: any) => ({
    id: s.id,
    fullName: s.fullName,
  }))

  return (
    <UserManager
      initialUsers={usersRes.docs as any[]}
      staffList={staffList}
      currentUser={user}
    />
  )
}
