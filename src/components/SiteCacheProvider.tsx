'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SchoolManifest {
  timestamp: number
  version: string
  school: {
    name?: string
    phone?: string
    email?: string
    address?: string
  }
  teachers: Array<{
    id: string | number
    name: string
    slug: string
    role: string
    subject?: string
    qualifications?: string
    email?: string
  }>
  news: Array<{
    id: string | number
    title: string
    slug: string
    summary?: string
    category?: string
    date?: string
  }>
  blog: Array<{
    id: string | number
    title: string
    slug: string
    summary?: string
    date?: string
  }>
}

interface CacheContextType {
  manifest: SchoolManifest | null
  isCached: boolean
  getTeacherBySlug: (slug: string) => any
  getNewsBySlug: (slug: string) => any
  getBlogBySlug: (slug: string) => any
}

const CacheContext = createContext<CacheContextType>({
  manifest: null,
  isCached: false,
  getTeacherBySlug: () => null,
  getNewsBySlug: () => null,
  getBlogBySlug: () => null,
})

const CACHE_KEY = 'school_manifest_cache_v1'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours fallback TTL

export function SiteCacheProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [manifest, setManifest] = useState<SchoolManifest | null>(null)
  const [isCached, setIsCached] = useState(false)

  useEffect(() => {
    // 1. Try restoring from localStorage first (0ms instantaneous)
    try {
      const stored = localStorage.getItem(CACHE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as SchoolManifest
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          setManifest(parsed)
          setIsCached(true)
        }
      }
    } catch {
      // safe fallback
    }

    // 2. Fetch fresh manifest in background and cache it
    const fetchManifest = async () => {
      try {
        const res = await fetch('/api/school-data/manifest', {
          headers: { 'Cache-Control': 'max-age=3600' }
        })
        if (res.ok) {
          const freshData = await res.json()
          setManifest(freshData)
          setIsCached(true)
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(freshData))
          } catch {
            // Storage quota fallback
          }

          // 3. Pre-warm router for popular article and teacher slugs
          if (freshData.news && Array.isArray(freshData.news)) {
            freshData.news.slice(0, 5).forEach((n: any) => {
              if (n.slug) router.prefetch(`/yangiliklar/${n.slug}`)
            })
          }
          if (freshData.teachers && Array.isArray(freshData.teachers)) {
            freshData.teachers.slice(0, 6).forEach((t: any) => {
              if (t.slug) router.prefetch(`/oqituvchilar/${t.slug}`)
            })
          }
        }
      } catch (err) {
        // Offline or network error: existing cache used
      }
    }

    // Run during browser idle time so initial render is 100% unimpeded
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        fetchManifest()
        prewarmCoreRoutes(router)
        registerServiceWorker()
      })
    } else {
      setTimeout(() => {
        fetchManifest()
        prewarmCoreRoutes(router)
        registerServiceWorker()
      }, 1000)
    }
  }, [router])

  const getTeacherBySlug = (slug: string) => {
    return manifest?.teachers?.find(t => t.slug === slug) || null
  }

  const getNewsBySlug = (slug: string) => {
    return manifest?.news?.find(n => n.slug === slug) || null
  }

  const getBlogBySlug = (slug: string) => {
    return manifest?.blog?.find(b => b.slug === slug) || null
  }

  return (
    <CacheContext.Provider value={{ manifest, isCached, getTeacherBySlug, getNewsBySlug, getBlogBySlug }}>
      {children}
    </CacheContext.Provider>
  )
}

export function useSchoolDataCache() {
  return useContext(CacheContext)
}

function prewarmCoreRoutes(router: any) {
  const coreRoutes = [
    '/yangiliklar',
    '/oqituvchilar',
    '/talim',
    '/blog',
    '/maktab-haqida',
    '/elonlar',
    '/maktab-hayoti',
    '/jurnallar',
    '/boglanish',
    '/school-profile',
  ]

  coreRoutes.forEach((route) => {
    try {
      router.prefetch(route)
    } catch {
      // safe
    }
  })
}

function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        // Background SW registered
      })
      .catch(() => {
        // SW registration optional fallback
      })
  }
}
