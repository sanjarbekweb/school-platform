import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Parolni tiklash | Boshqaruv Tizimi',
  description: '142-maktab boshqaruv tizimida parolni tiklash va administrator bilan bog‘lanish.',
}

export default function ResetPasswordPage() {
  return (
    <div className="admin-auth-wrapper">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <div className="admin-auth-logo" aria-hidden="true">
            🔑
          </div>
          <h1 className="admin-auth-title">Parolni tiklash</h1>
          <p className="admin-auth-subtitle">
            Xavfsizlik siyosati va ma’muriy ko‘rsatmalar
          </p>
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: 'rgba(26, 54, 93, 0.05)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-6)',
            fontSize: 'var(--text-sm)',
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: '0 0 var(--space-3)' }}>
            <strong>Hurmatli xodim!</strong> Axborot xavfsizligi qoidalariga muvofiq,
            maktab boshqaruv tizimi hisoblarining parolini masofadan avtomatik tiklash
            taqiqlangan.
          </p>
          <p style={{ margin: 0 }}>
            Agar parolingizni unutgan bo‘lsangiz yoki hisobingiz bloklangan bo‘lsa,
            maktabning AKT mas’ul xodimi yoki bosh ma’muri bilan shaxsan bog‘laning.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)',
            fontSize: 'var(--text-sm)',
          }}
        >
          <div
            style={{
              padding: '0.75rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
              AKT va Tizim administratori
            </div>
            <div style={{ color: 'var(--color-text-muted)' }}>
              Elektron pochta: <a href="mailto:admin@maktab142.uz" style={{ color: 'var(--color-blue)' }}>admin@maktab142.uz</a>
            </div>
            <div style={{ color: 'var(--color-text-muted)' }}>
              Telefon: +998 71 200 01 42 (ichki 101)
            </div>
          </div>

          <div
            style={{
              padding: '0.75rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
              Qabulxona va Ma’muriyat
            </div>
            <div style={{ color: 'var(--color-text-muted)' }}>
              Xona: 2-qavat, 204-xona (O‘quv ishlari bo‘yicha direktor o‘rinbosari)
            </div>
            <div style={{ color: 'var(--color-text-muted)' }}>
              Ish vaqti: Dushanba – Juma, 09:00 – 17:00
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Link
            href="/admin/login"
            className="btn btn-primary"
            style={{ width: '100%', textAlign: 'center' }}
          >
            ← Kirish sahifasiga qaytish
          </Link>
          <Link
            href="/"
            style={{
              textAlign: 'center',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
            }}
          >
            Bosh sahifaga o‘tish
          </Link>
        </div>
      </div>
    </div>
  )
}
