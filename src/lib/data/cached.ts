import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

/**
 * Cached News Query
 * revalidate: false ensures Next.js NEVER touches the database on requests.
 * Cache is only invalidated on-demand when revalidateTag('news') is triggered.
 */
export const getCachedNewsArchive = unstable_cache(
  async (category?: string, page: number = 1, limit: number = 9) => {
    const payload = await getPayloadClient()
    const whereClause: any = {
      status: { equals: 'nashr_qilingan' },
    }
    if (category) {
      whereClause.category = { equals: category }
    }

    const res = await payload.find({
      collection: 'news',
      where: whereClause,
      sort: '-publishedAt',
      limit,
      page,
    }).catch(() => ({ docs: [], totalPages: 1, page: 1, totalDocs: 0 }))

    return {
      docs: res.docs,
      totalPages: res.totalPages,
      page: res.page,
      totalDocs: res.totalDocs,
    }
  },
  ['cached-news-archive'],
  { tags: ['news'], revalidate: false }
)

/**
 * Cached Staff Query
 */
export const getCachedStaffArchive = unstable_cache(
  async (subjectFilter?: string, page: number = 1, limit: number = 12) => {
    const payload = await getPayloadClient()
    const whereClause: any = {
      status: { equals: 'faol' },
    }
    if (subjectFilter) {
      whereClause.subject = { equals: subjectFilter }
    }

    const res = await payload.find({
      collection: 'staff',
      where: whereClause,
      sort: 'displayOrder',
      limit,
      page,
    }).catch(() => ({ docs: [], totalPages: 1, page: 1, totalDocs: 0 }))

    return {
      docs: res.docs,
      totalPages: res.totalPages,
      page: res.page,
      totalDocs: res.totalDocs,
    }
  },
  ['cached-staff-archive'],
  { tags: ['staff'], revalidate: false }
)

/**
 * Cached Blog Query
 */
export const getCachedBlogArchive = unstable_cache(
  async (page: number = 1, limit: number = 9) => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'blog',
      where: { status: { equals: 'nashr_qilingan' } },
      sort: '-publishedAt',
      limit,
      page,
    }).catch(() => ({ docs: [], totalPages: 1, page: 1, totalDocs: 0 }))

    return {
      docs: res.docs,
      totalPages: res.totalPages,
      page: res.page,
      totalDocs: res.totalDocs,
    }
  },
  ['cached-blog-archive'],
  { tags: ['blog'], revalidate: false }
)

/**
 * Cached Notices Query
 */
export const getCachedNoticesArchive = unstable_cache(
  async (viewPast: boolean = false) => {
    const payload = await getPayloadClient()
    const nowIso = new Date().toISOString()
    const whereClause: any = viewPast
      ? {
          status: { equals: 'nashr_qilingan' },
          endDate: { less_than: nowIso },
        }
      : {
          status: { equals: 'nashr_qilingan' },
          or: [
            { endDate: { exists: false } },
            { endDate: { equals: null } },
            { endDate: { greater_than_equal: nowIso } },
          ],
        }

    const res = await payload.find({
      collection: 'notices',
      where: whereClause,
      sort: '-startDate',
      limit: 30,
    }).catch(() => ({ docs: [] }))

    return {
      docs: res.docs,
    }
  },
  ['cached-notices-archive'],
  { tags: ['notices'], revalidate: false }
)

/**
 * Cached Site Settings
 */
export const getCachedSiteSettings = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient()
      return await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
    } catch {
      return null
    }
  },
  ['cached-site-settings'],
  { tags: ['settings'], revalidate: false }
)

/**
 * Complete School Data Manifest
 * Bundles teachers, latest news, and blog articles into a single lightweight cache
 * that the browser downloads once on first visit.
 */
export const getCachedSchoolManifest = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient()

      const [staffRes, newsRes, blogRes, settings] = await Promise.all([
        payload.find({
          collection: 'staff',
          where: { status: { equals: 'faol' } },
          sort: 'displayOrder',
          limit: 100,
        }).catch(() => ({ docs: [] })),
        payload.find({
          collection: 'news',
          where: { status: { equals: 'nashr_qilingan' } },
          sort: '-publishedAt',
          limit: 30,
        }).catch(() => ({ docs: [] })),
        payload.find({
          collection: 'blog',
          where: { status: { equals: 'nashr_qilingan' } },
          sort: '-publishedAt',
          limit: 30,
        }).catch(() => ({ docs: [] })),
        payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
      ])

      return {
        timestamp: Date.now(),
        version: '1.0.0',
        school: {
          name: settings?.schoolName || '25-sonli umumiy o‘rta ta’lim maktabi',
          phone: settings?.phone || '+998 71 200 00 25',
          email: settings?.email || 'info@maktab25.uz',
          address: settings?.address || 'Toshkent shahri, Mirzo Ulug‘bek tumani',
        },
        teachers: staffRes.docs.map((s: any) => ({
          id: s.id,
          name: s.fullName,
          slug: s.slug,
          role: s.role,
          subject: s.subject,
          qualifications: s.qualifications,
          email: s.email,
        })),
        news: newsRes.docs.map((n: any) => ({
          id: n.id,
          title: n.title,
          slug: n.slug,
          summary: n.summary,
          category: n.category,
          date: n.publishedAt,
        })),
        blog: blogRes.docs.map((b: any) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          summary: b.summary,
          date: b.publishedAt,
        })),
      }
    } catch {
      return { timestamp: Date.now(), version: '1.0.0', school: {}, teachers: [], news: [], blog: [] }
    }
  },
  ['cached-school-manifest'],
  { tags: ['manifest', 'news', 'staff', 'blog', 'settings'], revalidate: false }
)
