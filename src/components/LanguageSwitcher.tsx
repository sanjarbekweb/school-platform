'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useLanguage, type Language } from '@/context/LanguageContext'

interface LanguageOption {
  code: Language
  label: string
  shortLabel: string
  flag: string
}

const LANGUAGES: LanguageOption[] = [
  { code: 'uz', label: 'O‘zbekcha', shortLabel: 'UZ', flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', shortLabel: 'RU', flag: '🇷🇺' },
  { code: 'en', label: 'English', shortLabel: 'EN', flag: '🇬🇧' },
]

export function LanguageSwitcher({ 
  variant = 'navbar',
  className = '' 
}: { 
  variant?: 'navbar' | 'topbar' | 'mobile'
  className?: string 
}) {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mobile drawer variant: inline segmented pill selector
  if (variant === 'mobile') {
    return (
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--color-surface-subtle)',
          borderRadius: '0.65rem',
          padding: '0.25rem',
          gap: '0.25rem',
          border: '1px solid var(--color-border)'
        }}
        className={className}
      >
        {LANGUAGES.map((item) => {
          const active = language === item.code
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setLanguage(item.code)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.5rem',
                borderRadius: '0.45rem',
                border: 'none',
                background: active ? 'var(--color-surface)' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--color-muted)',
                fontWeight: active ? 700 : 500,
                fontSize: '0.825rem',
                cursor: 'pointer',
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 300ms ease'
              }}
            >
              <span>{item.flag}</span>
              <span>{item.shortLabel}</span>
            </button>
          )
        })}
      </div>
    )
  }

  // Topbar variant: compact dropdown or inline switcher
  if (variant === 'topbar') {
    return (
      <div ref={dropdownRef} style={{ position: 'relative' }} className={className}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'transparent',
            border: 'none',
            color: '#cbd5e1',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.2rem 0.4rem',
            borderRadius: '0.35rem',
            transition: 'color 300ms ease, background-color 300ms ease, transform 300ms ease'
          }}
          aria-label="Tilni tanlash (Select language)"
        >
          <span>{currentLang.flag}</span>
          <span>{currentLang.shortLabel}</span>
          <ChevronDown size={11} style={{ opacity: 0.7 }} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                background: '#0b1528',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                padding: '0.3rem',
                zIndex: 300,
                minWidth: '8.5rem'
              }}
            >
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code)
                    setIsOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '0.35rem',
            transition: 'color 300ms ease, background-color 300ms ease, transform 300ms ease',
                    background: language === item.code ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    color: language === item.code ? '#60a5fa' : '#cbd5e1',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{item.flag}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {language === item.code && <Check size={12} />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Standard Navbar variant: elegant glass button with animated menu
  return (
    <div ref={dropdownRef} style={{ position: 'relative' }} className={className}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline"
        style={{
          minWidth: '40px',
          minHeight: '40px',
          padding: '0.45rem 0.65rem',
          borderRadius: 'var(--radius-md)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.84rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}
        aria-label="Tilni tanlash (Select Language)"
        title="Tilni tanlash"
      >
        <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{currentLang.flag}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{currentLang.shortLabel}</span>
        <ChevronDown size={13} style={{ opacity: 0.65 }} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem',
              boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.15)',
              padding: '0.4rem',
              zIndex: 300,
              minWidth: '10rem',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              color: 'var(--color-muted)', 
              padding: '0.3rem 0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Tilni tanlang / Язык
            </div>
            {LANGUAGES.map((item) => {
              const active = language === item.code
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code)
                    setIsOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '0.5rem',
                    background: active ? 'var(--color-primary-light)' : 'transparent',
                    color: active ? 'var(--color-primary)' : 'var(--color-text)',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 300ms ease'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{item.flag}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {active && <Check size={14} color="var(--color-primary)" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
