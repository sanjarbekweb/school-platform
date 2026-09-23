import React from 'react'
import type { Metadata } from 'next'
import { notFound, redirect, permanentRedirect } from 'next/navigation'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { sanitizeRedirectTarget } from '@/lib/redirects'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { getMediaUrl, getMediaAlt } from '@/lib/utils'

interface CatchAllProps {
  params: Promise<{ slug: string[] }>
}

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'pages',
      limit: 100,
    })
    return res.docs.map((doc: any) => ({
      slug: doc.slug.split('/').filter(Boolean),
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: CatchAllProps): Promise<Metadata> {
  const { slug } = await params
  const slugStr = slug.join('/')
  const payload = await getPayloadClient()

  const pageRes = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slugStr } },
    limit: 1,
  }).catch(() => null)

  const doc = pageRes?.docs?.[0]
  if (!doc) return { title: 'Sahifa topilmadi' }

  return {
    title: `${doc.title} — 142-maktab`,
    description: doc.subtitle || doc.title,
  }
}

export default async function CatchAllDynamicPage({ params }: CatchAllProps) {
  const { slug } = await params
  const path = '/' + slug.join('/')
  const payload = await getPayloadClient()

  // 1. Check for dynamic redirect configured in CMS
  const redirectRes = await payload.find({
    collection: 'redirects',
    where: {
      or: [
        { from: { equals: path } },
        { from: { equals: path + '/' } },
      ],
    },
    limit: 1,
  }).catch(() => null)

  const redirectDoc = redirectRes?.docs?.[0] as any
  if (redirectDoc?.to) {
    const safeTarget = sanitizeRedirectTarget(path, redirectDoc.to)
    if (safeTarget) {
      const code = String(redirectDoc.statusCode || '301').trim()
      if (code.startsWith('301')) {
        permanentRedirect(safeTarget)
      } else {
        redirect(safeTarget)
      }
    }
  }

  // 2. Check for CMS Page in 'pages' collection
  const slugStr = slug.join('/')
  const pageRes = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { slug: { equals: slugStr } },
        { status: { equals: 'nashr_qilingan' } },
      ],
    },
    limit: 1,
  }).catch(() => null)

  const pageDoc = pageRes?.docs?.[0]
  if (!pageDoc) {
    notFound()
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '840px' }}>
        <Breadcrumbs items={[{ label: pageDoc.title }]} />

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-navy)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            {pageDoc.title}
          </h1>
          {pageDoc.subtitle && (
            <p style={{ fontSize: '1.2rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.6 }}>
              {pageDoc.subtitle}
            </p>
          )}
        </div>

        {pageDoc.featuredImage && (
          <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 'var(--radius-card)', overflow: 'hidden', marginBottom: '2.5rem' }}>
            <Image
              src={getMediaUrl(pageDoc.featuredImage)}
              alt={getMediaAlt(pageDoc.featuredImage, pageDoc.title)}
              fill
              sizes="(max-width: 840px) 100vw, 840px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        <RichTextRenderer content={pageDoc.content} />
      </div>
    </div>
  )
}
