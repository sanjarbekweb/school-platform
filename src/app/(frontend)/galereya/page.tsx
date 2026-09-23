import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl, formatUzbekDate } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Pagination } from '@/components/Pagination'
import { Images, Calendar, Camera } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fotogalereya — 142-maktab',
  description: 'Maktabimiz hayoti, bayramlar, ochiq darslar va sport tadbirlaridan fotolavhalar to‘plami.',
}

export default async function GalleryIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = searchParams ? await searchParams : {}
  const rawPage = Array.isArray(resolvedParams.page) ? resolvedParams.page[0] : resolvedParams.page
  const currentPage = rawPage ? Math.max(1, parseInt(rawPage, 10) || 1) : 1

  const payload = await getPayloadClient()

  const albumsRes = await payload.find({
    collection: 'albums',
    where: {
      status: { equals: 'nashr_qilingan' },
    },
    sort: '-eventDate',
    limit: 9,
    page: currentPage,
  }).catch(() => ({ docs: [], totalPages: 1, page: 1 }))

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Fotogalereya' }]} />

        <div style={{ maxWidth: '840px', marginBottom: '2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Fotoxronika
          </span>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, color: 'var(--color-navy)', marginBottom: '1rem' }}>
            Maktab fotogalereyasi
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
            Maktabimizda o‘tkazilgan unutilmas tadbirlar, bayram tantanalari va kundalik o‘quv jarayonlaridan olingan sifatli fotoreportajlar.
          </p>
        </div>

        {albumsRes.docs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg" style={{ gap: '2rem' }}>
              {albumsRes.docs.map((album: any) => {
                const photoCount = Array.isArray(album.images) ? album.images.length : 0
                return (
                  <div key={album.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link href={`/galereya/${album.slug}`} style={{ display: 'block', position: 'relative', height: '220px', overflow: 'hidden', background: '#e2e8f0' }}>
                      {album.coverImage ? (
                        <Image
                          src={getMediaUrl(album.coverImage)}
                          alt={album.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <Camera size={48} />
                        </div>
                      )}
                      <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', backgroundColor: 'rgba(15, 23, 42, 0.75)', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm, 4px)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', backdropFilter: 'blur(4px)' }}>
                        <Camera size={14} />
                        <span>{photoCount} fotosurat</span>
                      </div>
                    </Link>

                    <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {album.eventDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                          <Calendar size={14} />
                          <time dateTime={album.eventDate}>{formatUzbekDate(album.eventDate)}</time>
                        </div>
                      )}

                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                        <Link href={`/galereya/${album.slug}`} style={{ color: 'var(--color-navy)' }}>
                          {album.title}
                        </Link>
                      </h3>

                      <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                        <Link href={`/galereya/${album.slug}`} className="btn btn-outline" style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem', padding: '0.45rem' }}>
                          Albomni ko‘rish
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Pagination
              currentPage={albumsRes.page || 1}
              totalPages={albumsRes.totalPages || 1}
              baseUrl="/galereya"
            />
          </>
        ) : (
          <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--color-muted)' }}>
            <Images size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
              Fotogalereyalar tayyorlanmoqda
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Tez orada yangi tadbirlar fotosuratlari yuklanadi.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
