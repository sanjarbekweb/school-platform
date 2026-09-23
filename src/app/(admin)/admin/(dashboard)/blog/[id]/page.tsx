import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminDocument } from '@/lib/data/admin'
import { BlogEditor } from '@/components/admin/editors/BlogEditor'

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const { id } = await params
  let docData: any = null

  try {
    const res = await getAdminDocument('blog', id, user)
    docData = res.doc
  } catch {
    notFound()
  }

  if (!docData) notFound()

  // Teachers can only edit their own blog posts
  if (user.role === 'teacher') {
    const authorId = typeof docData.author === 'object' ? docData.author?.id : docData.author
    if (String(authorId) !== String(user.id)) {
      redirect('/admin/blog')
    }
  }

  return <BlogEditor initialDoc={docData} currentUser={user} />
}
