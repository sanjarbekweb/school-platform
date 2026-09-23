import type { Access, FieldAccess, Where } from 'payload'

export interface AppUser {
  id: string | number
  email: string
  name?: string
  role: 'admin' | 'editor' | 'teacher'
  linkedStaff?: string | number | null
}

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user && (user as unknown as AppUser).role === 'admin')
}

export const isEditor: Access = ({ req: { user } }) => {
  if (!user) return false
  const role = (user as unknown as AppUser).role
  return role === 'admin' || role === 'editor'
}

export const isTeacher: Access = ({ req: { user } }) => {
  return Boolean(user && (user as unknown as AppUser).role === 'teacher')
}

export const isLoggedIn: Access = ({ req: { user } }) => {
  return Boolean(user)
}

/**
 * Public read access for published content; logged-in users see all
 */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }
  return {
    status: {
      equals: 'nashr_qilingan',
    },
  }
}

/**
 * Notices access: public only sees active notices within date range; logged-in sees all
 */
export const activeNoticesOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }
  const nowIso = new Date().toISOString()
  return {
    and: [
      {
        status: {
          equals: 'faol',
        },
      },
      {
        startDate: {
          less_than_equal: nowIso,
        },
      },
      {
        expiryDate: {
          greater_than_equal: nowIso,
        },
      },
    ],
  } as Where
}

/**
 * News item mutation:
 * - Admin and Editor can edit any article
 * - Teacher can only edit their own drafts in editable workflow states
 */
export const canMutateNews: Access = ({ req: { user } }) => {
  if (!user) return false
  const appUser = user as unknown as AppUser
  if (appUser.role === 'admin' || appUser.role === 'editor') {
    return true
  }
  if (appUser.role === 'teacher') {
    return {
      and: [
        {
          author: {
            equals: appUser.id,
          },
        },
        {
          status: {
            in: ['qoralama', 'korib_chiqilmoqda', 'ozgartirish_kerak'],
          },
        },
      ],
    } as Where
  }
  return false
}

/**
 * Blog post mutation:
 * - Admin and Editor can edit any post
 * - Teacher can only edit their own draft blog posts
 */
export const canMutateBlog: Access = ({ req: { user } }) => {
  if (!user) return false
  const appUser = user as unknown as AppUser
  if (appUser.role === 'admin' || appUser.role === 'editor') {
    return true
  }
  if (appUser.role === 'teacher') {
    return {
      and: [
        {
          author: {
            equals: appUser.id,
          },
        },
        {
          status: {
            in: ['qoralama', 'korib_chiqilmoqda', 'ozgartirish_kerak'],
          },
        },
      ],
    } as Where
  }
  return false
}

/**
 * Staff directory mutation:
 * - Admin and Editor can edit all staff profiles
 * - Teacher can only edit their linked staff profile
 */
export const canMutateStaff: Access = ({ req: { user } }) => {
  if (!user) return false
  const appUser = user as unknown as AppUser
  if (appUser.role === 'admin' || appUser.role === 'editor') {
    return true
  }
  if (appUser.role === 'teacher' && appUser.linkedStaff) {
    return {
      id: {
        equals: appUser.linkedStaff,
      },
    }
  }
  return false
}

/**
 * Field-level access: Only editors and admins can change publication status to 'nashr_qilingan' or 'arxivlangan'
 */
export const canSetPublicationStatus: FieldAccess = ({ req: { user }, data, siblingData }) => {
  if (!user) return false
  const role = (user as unknown as AppUser).role
  if (role === 'admin' || role === 'editor') {
    return true
  }
  // Teachers cannot directly publish or archive
  const targetStatus = (siblingData as any)?.status || data?.status
  if (targetStatus === 'nashr_qilingan' || targetStatus === 'arxivlangan') {
    return false
  }
  return true
}

/**
 * Field-level access: Only admins can alter sensitive fields
 */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return Boolean(user && (user as unknown as AppUser).role === 'admin')
}

/**
 * Field-level access: Only editors and admins
 */
export const isEditorFieldLevel: FieldAccess = ({ req: { user } }) => {
  if (!user) return false
  const role = (user as unknown as AppUser).role
  return role === 'admin' || role === 'editor'
}
