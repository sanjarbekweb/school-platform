'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    setTheme(currentTheme)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    try {
      localStorage.setItem('school-platform-theme', nextTheme)
      document.cookie = `school-theme=${nextTheme}; path=/; max-age=31536000; SameSite=Lax`
    } catch {
      // Storage unavailable
    }
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className={className || 'btn btn-outline'}
        style={{ minWidth: '40px', minHeight: '40px', padding: '0.45rem', borderRadius: 'var(--radius-md)', ...style }}
        aria-label="Mavzuni o‘zgartirish"
        disabled
      >
        <span style={{ width: 18, height: 18, display: 'inline-block' }} />
      </button>
    )
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={className || 'btn btn-outline'}
      style={{
        minWidth: '40px',
        minHeight: '40px',
        padding: '0.45rem',
        borderRadius: 'var(--radius-md)',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Tungi rejimga o‘tish (Dark mode)' : 'Kunduzgi rejimga o‘tish (Light mode)'}
      title={theme === 'light' ? 'Tungi rejim' : 'Kunduzgi rejim'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#f59e0b" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
