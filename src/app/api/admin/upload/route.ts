import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentUser } from '@/lib/auth/session'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
]

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB
const MAX_PDF_SIZE = 25 * 1024 * 1024 // 25 MB

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Ruxsat berilmagan (Autentifikatsiya talab etiladi).' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const alt = (formData.get('alt') as string) || ''

    if (!file) {
      return NextResponse.json({ error: 'Fayl tanlanmadi.' }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Faqatgina JPEG, PNG, WebP, SVG yoki PDF formatidagi fayllar qabul qilinadi.' },
        { status: 400 }
      )
    }

    const maxSize = file.type === 'application/pdf' ? MAX_PDF_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) {
      const maxMb = maxSize / (1024 * 1024)
      return NextResponse.json(
        { error: `Fayl hajmi ruxsat etilgan me’yordan (${maxMb} MB) oshib ketdi.` },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const payload = await getPayloadClient()

    // Sanitize filename
    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-')

    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: alt.trim() || safeName,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: safeName,
        size: file.size,
      },
      user: user as any,
    })

    return NextResponse.json({
      success: true,
      media: {
        id: mediaDoc.id,
        url: mediaDoc.url,
        filename: mediaDoc.filename,
        alt: mediaDoc.alt,
        mimeType: mediaDoc.mimeType,
        filesize: mediaDoc.filesize,
      },
    })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json(
      { error: `Faylni yuklashda xatolik: ${err.message || 'Noma’lum xatolik'}` },
      { status: 500 }
    )
  }
}
