import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SmoothScroll } from '@/components/SmoothScroll'
import { LanguageProvider } from '@/context/LanguageContext'
import { SiteCacheProvider } from '@/components/SiteCacheProvider'
import { getCachedSiteSettings } from '@/lib/data/cached'

export const metadata: Metadata = {
  title: {
    template: '%s | 142-sonli umumiy o‘rta ta’lim maktabi',
    default: '142-sonli umumiy o‘rta ta’lim maktabi — Toshkent shahri, Mirzo Ulug‘bek',
  },
  description: 'Toshkent shahri Mirzo Ulug‘bek tumanidagi 142-sonli umumiy o‘rta ta’lim maktabining rasmiy veb-portali.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.svg',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getCachedSiteSettings()

  const schoolName = settings?.schoolName || '142-sonli umumiy o‘rta ta’lim maktabi'
  const legalName = settings?.legalName || 'Toshkent shahar Mirzo Ulug‘bek tumani 142-sonli umumiy o‘rta ta’lim maktabi'
  const telephone = settings?.phone || '+998 71 200 01 42'
  const email = settings?.email || 'info@maktab142.uz'
  const addressLocality = settings?.address || 'Toshkent shahri, Mirzo Ulug‘bek tumani'

  const schemaOrgJson = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: schoolName,
    legalName: legalName,
    url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://maktab142.uz',
    telephone: telephone,
    email: email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: addressLocality,
      addressRegion: 'Mirzo Ulug‘bek tumani',
      addressCountry: 'UZ',
    },
  }

  return (
    <html lang="uz">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('school-platform-theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJson) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Asosiy matnga o‘tish (Skip to content)
        </a>
        <LanguageProvider>
          <SiteCacheProvider>
            <SmoothScroll>
              <Header />
              <main id="main-content" style={{ flex: 1 }}>
                {children}
              </main>
              <Footer />
            </SmoothScroll>
          </SiteCacheProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
