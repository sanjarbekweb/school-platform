import { getPayloadClient } from '@/lib/payload'
import type { SessionUser } from '../auth/session'
import { canAccessResource, canEditDocument, canPublishDocument, Resource } from '../permissions'

export interface AdminStats {
  newsCount: number
  draftNewsCount: number
  reviewNewsCount: number
  noticesCount: number
  activeNoticesCount: number
  staffCount: number
  awardsCount: number
  magazinesCount: number
  albumsCount: number
  blogCount: number
  mediaCount: number
  usersCount: number
  redirectsCount: number
}

export async function getAdminOverview(user: SessionUser) {
  const payload = await getPayloadClient()
  const nowIso = new Date().toISOString()

  // 1. Fetch counts
  const [
    newsRes,
    reviewNewsRes,
    draftNewsRes,
    noticesRes,
    staffRes,
    mediaRes,
    awardsRes,
    magazinesRes,
    albumsRes,
    blogRes,
    usersRes,
  ] = await Promise.all([
    payload.find({ collection: 'news', where: { status: { equals: 'nashr_qilingan' } }, limit: 1 }).catch(() => ({ totalDocs: 0 })),
    payload.find({ collection: 'news', where: { status: { equals: 'korib_chiqilmoqda' } }, limit: 5 }).catch(() => ({ totalDocs: 0, docs: [] })),
    payload.find({ collection: 'news', where: { status: { equals: 'qoralama' } }, limit: 1 }).catch(() => ({ totalDocs: 0 })),
    payload.find({ collection: 'notices', limit: 50 }).catch(() => ({ totalDocs: 0, docs: [] })),
    payload.find({ collection: 'staff', limit: 1 }).catch(() => ({ totalDocs: 0 })),
    payload.find({ collection: 'media', limit: 1 }).catch(() => ({ totalDocs: 0 })),
    payload.find({ collection: 'awards', limit: 1 }).catch(() => ({ totalDocs: 0 })),
    payload.find({ collection: 'magazines', limit: 1 }).catch(() => ({ totalDocs: 0 })),
    payload.find({ collection: 'albums', limit: 1 }).catch(() => ({ totalDocs: 0 })),
    payload.find({ collection: 'blog', limit: 1 }).catch(() => ({ totalDocs: 0 })),
    payload.find({ collection: 'users', limit: 1 }).catch(() => ({ totalDocs: 0 })),
  ])

  // Process notices: active vs expiring
  const allNotices = (noticesRes.docs || []) as any[]
  const activeNotices = allNotices.filter((n) => {
    if (n.status !== 'faol') return false
    const exp = new Date(n.expiryDate).getTime()
    return exp > Date.now()
  })
  const expiringSoon = activeNotices.filter((n) => {
    const diffDays = (new Date(n.expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24)
    return diffDays <= 5 && diffDays >= 0
  })

  // Recent activity: latest news & notices
  const recentNewsRes = await payload.find({
    collection: 'news',
    limit: 5,
    sort: '-updatedAt',
  }).catch(() => ({ docs: [] }))

  return {
    stats: {
      newsCount: newsRes.totalDocs,
      reviewNewsCount: reviewNewsRes.totalDocs,
      draftNewsCount: draftNewsRes.totalDocs,
      noticesCount: allNotices.length,
      activeNoticesCount: activeNotices.length,
      staffCount: staffRes.totalDocs,
      awardsCount: awardsRes.totalDocs,
      magazinesCount: magazinesRes.totalDocs,
      albumsCount: albumsRes.totalDocs,
      blogCount: blogRes.totalDocs,
      mediaCount: mediaRes.totalDocs,
      usersCount: usersRes.totalDocs,
    },
    draftsRequiringReview: reviewNewsRes.docs as any[],
    expiringNotices: expiringSoon,
    recentNews: recentNewsRes.docs as any[],
  }
}

export async function getAdminList(
  collection: Resource,
  params: {
    page?: number
    limit?: number
    search?: string
    status?: string
    category?: string
    sort?: string
  },
  user: SessionUser
) {
  const payload = await getPayloadClient()
  const page = Math.max(1, params.page || 1)
  const limit = Math.min(100, Math.max(1, params.limit || 15))

  const whereConditions: any[] = []

  // If teacher, constrain to owned news/blog or linked staff
  if (user.role === 'teacher') {
    if (collection === 'news' || collection === 'blog') {
      whereConditions.push({ author: { equals: user.id } })
    } else if (collection === 'staff') {
      if (user.linkedStaff) {
        whereConditions.push({ id: { equals: user.linkedStaff } })
      } else {
        return { docs: [], totalDocs: 0, totalPages: 1, page: 1 }
      }
    }
  }

  // Status filter
  if (params.status && params.status !== 'all') {
    whereConditions.push({ status: { equals: params.status } })
  }

  // Category filter for news
  if (params.category && params.category !== 'all' && collection === 'news') {
    whereConditions.push({ category: { equals: params.category } })
  }

  // Search filter
  if (params.search && params.search.trim()) {
    const term = params.search.trim()
    if (collection === 'staff') {
      whereConditions.push({ fullName: { contains: term } })
    } else if (collection === 'users') {
      whereConditions.push({ or: [{ email: { contains: term } }, { name: { contains: term } }] })
    } else if (collection === 'redirects') {
      whereConditions.push({ or: [{ from: { contains: term } }, { to: { contains: term } }] })
    } else {
      whereConditions.push({ title: { contains: term } })
    }
  }

  const where = whereConditions.length > 1
    ? { and: whereConditions }
    : whereConditions.length === 1
    ? whereConditions[0]
    : {}

  return await payload.find({
    collection: collection as any,
    where,
    page,
    limit,
    sort: params.sort || '-updatedAt',
    depth: 1,
  })
}

export async function getAdminDocument(collection: Resource, id: string | number, user: SessionUser) {
  const payload = await getPayloadClient()
  const doc = await payload.findByID({
    collection: collection as any,
    id,
    depth: 2,
  })

  // Check revisions if versioning is supported
  let versions: any[] = []
  if (collection === 'news' || collection === 'staff') {
    try {
      const vRes = await payload.findVersions({
        collection: collection as any,
        where: { parent: { equals: id } },
        limit: 10,
        sort: '-createdAt',
      })
      versions = vRes.docs || []
    } catch {
      // Versioning lookup fallback
    }
  }

  return { doc, versions }
}
