import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { BlogEditor } from '@/components/admin/editors/BlogEditor'

export default async function NewBlogPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  return <BlogEditor currentUser={user} />
}
