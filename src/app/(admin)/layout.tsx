import React from 'react'
import type { Metadata } from 'next'
import '../(frontend)/globals.css'
import './admin.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Boshqaruv Paneli — 142-maktab',
    default: 'Boshqaruv Paneli — 142-sonli umumiy o‘rta ta’lim maktabi',
  },
  description: '142-sonli maktab boshqaruv va kontent tahrirlash portali.',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('school-platform-theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="admin-body">
        {children}
      </body>
    </html>
  )
}
