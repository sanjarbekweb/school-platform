'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Kirishda xatolik yuz berdi. Iltimos, ma’lumotlarni tekshiring.')
        setIsLoading(false)
        return
      }

      // Hard navigate so session cookie is sent with browser request
      window.location.href = redirectParam
    } catch {
      setError('Server bilan aloqa uzildi. Iltimos, qaytadan urinib ko‘ring.')
      setIsLoading(false)
    }
  }

    return (
      <div className="admin-auth-wrapper">
        <motion.div 
          className="admin-auth-card"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="admin-auth-header">
            <motion.div 
              className="admin-auth-logo"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              25
            </motion.div>
            <h1 className="admin-auth-title" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Boshqaruv Tizimi
            </h1>
            <p className="admin-auth-subtitle">
              25-sonli umumiy o‘rta ta’lim maktabi portali
            </p>
          </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: '1rem' }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              role="alert"
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#dc2626',
                fontSize: 'var(--text-sm)',
                lineHeight: 1.4,
                overflow: 'hidden'
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-form-label" htmlFor="email">
              Elektron pochta (Email)
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
                display: 'flex'
              }}>
                <Mail size={16} />
              </div>
              <input
                id="email"
                type="email"
                className="admin-input"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="masalan: admin@maktab25.uz"
                required
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <div className="admin-form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="admin-form-label" htmlFor="password" style={{ margin: 0 }}>
                Maxfiy parol
              </label>
              <Link
                href="/admin/reset-password"
                prefetch={false}
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                Parolni unutdingizmi?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
                display: 'flex'
              }}>
                <Lock size={16} />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolingizni kiriting"
                required
                autoComplete="current-password"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.65rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.25rem'
                }}
                aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.925rem', marginTop: '0.25rem' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 size={16} className="animate-spin" />
                <span>Tekshirilmoqda...</span>
              </span>
            ) : (
              'Tizimga kirish'
            )}
          </motion.button>
        </form>

        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--color-border)',
            textAlign: 'center',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)' }}>
            <ShieldCheck size={14} color="var(--color-primary)" />
            <span>Mualliflar, muharrirlar va xodimlar uchun yopiq hudud.</span>
          </div>
          <Link
            href="/"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginTop: '0.25rem'
            }}
          >
            <ArrowLeft size={14} />
            <span>Maktab rasmiy saytiga qaytish</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="admin-auth-wrapper">Yuklanmoqda...</div>}>
      <LoginForm />
    </Suspense>
  )
}
