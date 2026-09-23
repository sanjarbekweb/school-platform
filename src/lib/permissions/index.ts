import type { SessionUser } from '../auth/session'

export type Action = 'read' | 'create' | 'update' | 'delete' | 'publish'
export type Resource =
  | 'news'
  | 'notices'
  | 'staff'
  | 'pages'
  | 'awards'
  | 'albums'
  | 'magazines'
  | 'blog'
  | 'media'
  | 'users'
  | 'redirects'
  | 'settings'
  | 'help'

export function canAccessResource(user: SessionUser | null, resource: Resource, action: Action = 'read'): boolean {
  if (!user) return false

  // Administrator has complete access to everything
  if (user.role === 'admin') return true

  // Editor permissions
  if (user.role === 'editor') {
    if (resource === 'users' && action !== 'read') return false
    if (resource === 'settings' && action !== 'read') return false
    return true
  }

  // Teacher permissions
  if (user.role === 'teacher') {
    if (resource === 'users') return false
    if (resource === 'redirects') return false
    if (resource === 'settings') return false
    if (resource === 'pages' && action !== 'read') return false
    if (resource === 'notices' && action !== 'read') return false
    if (resource === 'awards' && action !== 'read') return false
    if (resource === 'albums' && action !== 'read') return false
    if (resource === 'magazines' && action !== 'read') return false
    
    // Teachers cannot directly publish
    if (action === 'publish') return false

    // Staff profile: teacher can only edit their linked profile
    if (resource === 'staff') {
      if (action === 'create' || action === 'delete') return false
      return Boolean(user.linkedStaff)
    }

    // News & Blog: teacher can create and edit own drafts
    if (resource === 'news' || resource === 'blog') {
      if (action === 'delete') return false
      return true
    }

    // Media: can upload and view
    if (resource === 'media') {
      if (action === 'delete') return false
      return true
    }

    if (resource === 'help') return true
  }

  return false
}

export function canEditDocument(
  user: SessionUser | null,
  resource: Resource,
  doc: any
): boolean {
  if (!user) return false
  if (user.role === 'admin' || user.role === 'editor') return true

  if (user.role === 'teacher') {
    // Linked staff profile
    if (resource === 'staff') {
      const staffId = typeof doc === 'object' ? doc.id : doc
      return String(user.linkedStaff) === String(staffId)
    }

    // Authored news / blog
    if (resource === 'news' || resource === 'blog') {
      const authorId = typeof doc.author === 'object' ? doc.author?.id : doc.author
      const isOwner = String(authorId) === String(user.id)
      const isEditableState = ['qoralama', 'korib_chiqilmoqda', 'ozgartirish_kerak', 'draft'].includes(doc.status || doc._status)
      return isOwner && isEditableState
    }
  }

  return false
}

export function canPublishDocument(user: SessionUser | null): boolean {
  return Boolean(user && (user.role === 'admin' || user.role === 'editor'))
}
