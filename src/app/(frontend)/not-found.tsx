import React from 'react'
import Link from 'next/link'
import { AlertCircle, Home, Search, Newspaper, Users, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="section" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', margin: '0 auto 1.5rem' }}>
          <AlertCircle size={36} />
        </div>

        <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b', marginBottom: '1rem' }}>
          404 Xatolik
        </span>

        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>
          Sahifa topilmadi
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          Siz qidirayotgan sahifa o‘chirilgan, nomi o‘zgartirilgan yoki vaqtincha mavjud bo‘lmasligi mumkin.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={18} /> Bosh sahifaga qaytish
          </Link>
          <Link href="/search" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} /> Saytdan qidirish
          </Link>
        </div>

        <div className="card" style={{ padding: '1.5rem', textAlign: 'left', backgroundColor: '#f8fafc' }}>
          <p style={{ margin: '0 0 0.75rem', fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.9rem' }}>
            Foydali bo‘limlar:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
            <Link href="/yangiliklar" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Newspaper size={14} /> Yangiliklar
            </Link>
            <Link href="/elonlar" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              • E’lonlar
            </Link>
            <Link href="/oqituvchilar" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Users size={14} /> O‘qituvchilar
            </Link>
            <Link href="/school-profile" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              • School Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
