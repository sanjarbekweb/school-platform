'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentUser } from '@/lib/auth/session'
import {
  canAccessResource,
  canEditDocument,
  canPublishDocument,
  Resource,
} from '@/lib/permissions'
import {
  validateNews,
  validateNotice,
  validateStaff,
  validateRedirect,
  validateUser,
  validateSiteSettings,
  ValidationError,
} from '@/lib/validation/schemas'

export interface ActionResponse {
  success: boolean
  error?: string
  validationErrors?: ValidationError[]
  id?: string | number
  doc?: any
}

/**
 * Validates payload based on resource type
 */
function validateData(collection: Resource, data: any, isNew: boolean): ValidationError[] {
  switch (collection) {
    case 'news':
      return validateNews(data)
    case 'notices':
      return validateNotice(data)
    case 'staff':
      return validateStaff(data)
    case 'redirects':
      return validateRedirect(data)
    case 'users':
      return validateUser(data, isNew)
    case 'settings':
      return validateSiteSettings(data)
    default:
      return []
  }
}

/**
 * Creates or updates an admin document with permission and validation enforcement
 */
export async function saveDocumentAction(
  collection: Resource,
  id: string | number | null,
  data: Record<string, any>
): Promise<ActionResponse> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Sessiya muddati tugagan. Iltimos, tizimga qayta kiring.' }
  }

  const isNew = !id
  const actionType = isNew ? 'create' : 'update'

  if (!canAccessResource(user, collection, actionType)) {
    return { success: false, error: 'Ushbu amalni bajarish uchun ruxsatingiz yo‘q.' }
  }

  const payload = await getPayloadClient()

  // If editing an existing document, verify ownership/permission
  if (!isNew && id) {
    try {
      const existing = await payload.findByID({
        collection: collection as any,
        id,
      })
      if (!existing || !canEditDocument(user, collection, existing)) {
        return { success: false, error: 'Siz ushbu hujjatni o‘zgartira olmaysiz.' }
      }
    } catch {
      return { success: false, error: 'Hujjat topilmadi.' }
    }
  }

  // Teacher security restrictions:
  if (user.role === 'teacher') {
    // Force own author on news and blog
    if (collection === 'news' || collection === 'blog') {
      data.author = user.id
      if (user.linkedStaff) {
        data.authorStaff = user.linkedStaff
      }
      // Cannot directly publish: downgrade if attempted
      if (data.status === 'nashr_qilingan') {
        data.status = 'korib_chiqilmoqda'
      }
    }
    // Linked staff restrictions
    if (collection === 'staff') {
      if (String(id) !== String(user.linkedStaff)) {
        return { success: false, error: 'Siz faqat o‘zingizga biriktirilgan profilni tahrirlashingiz mumkin.' }
      }
    }
  }

  // Check publication authorization
  if (data.status === 'nashr_qilingan' && !canPublishDocument(user)) {
    return {
      success: false,
      error: 'Faqatgina muharrir yoki administrator maqolani to‘g‘ridan-to‘g‘ri nashr qila oladi.',
    }
  }

  // Clean empty relationship fields to avoid SQLite foreign key / type errors
  for (const key of ['coverImage', 'featuredImage', 'portrait', 'photo', 'pdfFile', 'relatedNews', 'authorStaff']) {
    if (key in data && (data[key] === '' || data[key] === 'null' || data[key] === undefined)) {
      data[key] = null
    }
  }

  // Validate fields
  const validationErrors = validateData(collection, data, isNew)
  if (validationErrors.length > 0) {
    return {
      success: false,
      error: 'Kiritilgan ma’lumotlarda xatoliklar mavjud.',
      validationErrors,
    }
  }

  try {
    let resultDoc: any
    if (isNew) {
      resultDoc = await payload.create({
        collection: collection as any,
        data,
      })
    } else {
      resultDoc = await payload.update({
        collection: collection as any,
        id: id as any,
        data,
      })
    }

    // Purge cached data tags
    try {
      revalidateTag(collection)
      revalidateTag('manifest')
    } catch {
      // safe fallback
    }

    // Revalidate frontend and admin paths
    revalidatePath(`/admin/${collection}`)
    revalidatePath(`/admin/${collection}/${resultDoc.id}`)
    revalidatePath('/admin')
    revalidatePath('/')
    if (collection === 'news') {
      revalidatePath('/yangiliklar')
      if (resultDoc.slug) revalidatePath(`/yangiliklar/${resultDoc.slug}`)
    }
    if (collection === 'notices') {
      revalidatePath('/elonlar')
      if (resultDoc.slug) revalidatePath(`/elonlar/${resultDoc.slug}`)
    }
    if (collection === 'staff') {
      revalidatePath('/oqituvchilar')
      if (resultDoc.slug) revalidatePath(`/oqituvchilar/${resultDoc.slug}`)
    }
    if (collection === 'awards') revalidatePath('/yutuqlar')
    if (collection === 'albums') {
      revalidatePath('/galereya')
      if (resultDoc.slug) revalidatePath(`/galereya/${resultDoc.slug}`)
    }
    if (collection === 'magazines') {
      revalidatePath('/jurnallar')
      if (resultDoc.slug) revalidatePath(`/jurnallar/${resultDoc.slug}`)
    }
    if (collection === 'blog') {
      revalidatePath('/blog')
      if (resultDoc.slug) revalidatePath(`/blog/${resultDoc.slug}`)
    }
    if (collection === 'pages') {
      revalidatePath('/[...slug]')
      if (resultDoc.slug) revalidatePath(`/${resultDoc.slug}`)
    }

    return {
      success: true,
      id: resultDoc.id,
      doc: resultDoc,
    }
  } catch (err: any) {
    console.error(`Error saving ${collection}:`, err)
    return {
      success: false,
      error: err.message || 'Saqlash jarayonida server xatoligi yuz berdi.',
    }
  }
}

/**
 * Deletes a document with role checks
 */
export async function deleteDocumentAction(
  collection: Resource,
  id: string | number
): Promise<ActionResponse> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Avtorizatsiyadan o‘tilmagan.' }
  }

  if (!canAccessResource(user, collection, 'delete')) {
    return { success: false, error: 'Sizda hujjatni o‘chirish huquqi yo‘q.' }
  }

  const payload = await getPayloadClient()
  try {
    await payload.delete({
      collection: collection as any,
      id: id as any,
    })

    try {
      revalidateTag(collection)
      revalidateTag('manifest')
    } catch {
      // safe fallback
    }

    revalidatePath(`/admin/${collection}`)
    revalidatePath('/admin')
    revalidatePath('/')
    if (collection === 'news') revalidatePath('/yangiliklar')
    if (collection === 'staff') revalidatePath('/oqituvchilar')
    if (collection === 'blog') revalidatePath('/blog')
    if (collection === 'notices') revalidatePath('/elonlar')
    if (collection === 'awards') revalidatePath('/yutuqlar')
    if (collection === 'albums') revalidatePath('/galereya')
    if (collection === 'magazines') revalidatePath('/jurnallar')
    return { success: true }
  } catch (err: any) {
    console.error(`Error deleting ${collection} ${id}:`, err)
    return { success: false, error: err.message || 'O‘chirishda xatolik yuz berdi.' }
  }
}

/**
 * Restores a specific version of a document
 */
export async function rollbackVersionAction(
  collection: Resource,
  docId: string | number,
  versionId: string | number
): Promise<ActionResponse> {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') {
    return { success: false, error: 'Eski versiyani tiklash uchun yetarli ruxsat yo‘q.' }
  }

  const payload = await getPayloadClient()
  try {
    // Fetch target version document
    const versionRes = await payload.findVersionByID({
      collection: collection as any,
      id: versionId as any,
    })

    if (!versionRes || !versionRes.version) {
      return { success: false, error: 'Tiklanuvchi versiya topilmadi.' }
    }

    // Restore by updating the active doc with version payload
    const restored = await payload.update({
      collection: collection as any,
      id: docId as any,
      data: versionRes.version,
    })

    revalidatePath(`/admin/${collection}/${docId}`)
    revalidatePath(`/admin/${collection}`)
    return { success: true, doc: restored }
  } catch (err: any) {
    console.error('Error rolling back version:', err)
    return { success: false, error: err.message || 'Versiyani tiklashda xatolik yuz berdi.' }
  }
}

/**
 * Updates global site settings
 */
export async function updateSiteSettingsAction(
  data: Record<string, any>
): Promise<ActionResponse> {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Maktab sozlamalarini faqat bosh ma’mur o‘zgartira oladi.' }
  }

  const validationErrors = validateSiteSettings(data)
  if (validationErrors.length > 0) {
    return { success: false, error: 'Ma’lumotlar to‘liq emas.', validationErrors }
  }

  const payload = await getPayloadClient()
  try {
    const updated = await payload.updateGlobal({
      slug: 'site-settings',
      data,
    })

    revalidatePath('/', 'layout')
    return { success: true, doc: updated }
  } catch (err: any) {
    console.error('Error updating site settings:', err)
    return { success: false, error: err.message || 'Sozlamalarni saqlashda xatolik yuz berdi.' }
  }
}
