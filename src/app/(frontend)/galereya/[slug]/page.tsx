import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl, formatUzbekDate } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ChevronLeft, Calendar, Camera } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'albums',
      where: { status: { equals: 'nashr_qilingan' } },
      limit: 100,
    })
    return res.docs.map((doc: any) => ({ slug: doc.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()

  const res = await payload.find({
    collection: 'albums',
    where: {
      slug: { equals: slug },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const album = res.docs[0]
  if (!album) {
    return { title: 'Albom topilmadi' }
  }

  return {
    title: `${album.title} — Fotogalereya`,
    description: `${album.title} fotolavhalari. 142-sonli maktab fotogalereyasi.`,
  }
}

export default async function AlbumDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const res = await payload.find({
    collection: 'albums',
    where: {
      slug: { equals: slug },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const album = res.docs[0]
  if (!album) {
    notFound()
  }

  const images = Array.isArray(album.images) ? album.images : []

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'Fotogalereya', href: '/galereya' },
            { label: album.title },
          ]}
        />

        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/galereya" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-navy)', fontSize: '0.9rem', fontWeight: 500 }}>
            <ChevronLeft size={16} /> Barcha fotogalereyalarga qaytish
          </Link>
        </div>

        <div style={{ maxWidth: '840px', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.4rem', lineHeight: 1.2, color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
            {album.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--color-muted)', fontSize: '0.95rem' }}>
            {album.eventDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={16} />
                <time dateTime={album.eventDate}>{formatUzbekDate(album.eventDate)}</time>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Camera size={16} />
              <span>{images.length} ta fotosurat</span>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg" style={{ gap: '1.5rem' }}>
            {images.map((item: any, idx: number) => {
              const url = getMediaUrl(item.image)
              const altText = (typeof item.image === 'object' && item.image?.alt) ? item.image.alt : (item.caption || `${album.title} fotosurat ${idx + 1}`)
              return (
                <div key={idx} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', position: 'relative', height: '260px', overflow: 'hidden', background: '#e2e8f0' }}>
                    <Image
                      src={url}
                      alt={altText}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    />
                  </a>
                  {item.caption && (
                    <div style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#475569', backgroundColor: '#f8fafc', borderTop: '1px solid var(--color-border)' }}>
                      {item.caption}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-muted)' }}>
            Ushbu albomda hali fotosuratlar mavjud emas.
          </div>
        )}

      </div>
    </div>
  )
}
