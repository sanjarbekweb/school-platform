'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Award, GraduationCap, BookOpen, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function MotionFadeIn({
  children,
  delay = 0,
  className = '',
  style = {}
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export function MotionCard({
  children,
  className = '',
  style = {},
  onClick
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2, ease: 'easeOut' } }}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function HomeHeroAnimated() {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-1 grid-cols-2-sm" style={{ alignItems: 'center', gap: '3.5rem' }}>
      {/* Left: Text & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            backdropFilter: 'blur(8px)',
            padding: '0.4rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#93c5fd',
            marginBottom: '1.5rem',
          }}
        >
          <span className="pulse-dot" />
          <span>{t('hero.year_badge')}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>{t('hero.standard_badge')}</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ color: '#ffffff', marginBottom: '1.25rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ color: '#cbd5e1', fontSize: '1.12rem', lineHeight: 1.7, marginBottom: '2.25rem', maxWidth: '38rem' }}
        >
          {t('hero.description')}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}
        >
          <Link href="/maktab-haqida" className="btn btn-white">
            <span>{t('hero.cta.about')}</span>
            <ArrowRight size={17} />
          </Link>
          <Link href="/school-profile" className="btn btn-ghost-white">
            <span>{t('hero.cta.profile')}</span>
          </Link>
          <Link 
            href="/boglanish" 
            style={{ 
              color: '#93c5fd', 
              fontSize: '0.95rem', 
              fontWeight: 600, 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              marginLeft: '0.5rem',
              textDecoration: 'none'
            }}
          >
            <span>{t('hero.cta.contact')}</span>
            <ChevronRight size={16} />
          </Link>
        </motion.div>
      </motion.div>

      {/* Right: Modern Glassmorphic Institutional Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <motion.div 
          whileHover={{ y: -6, transition: { duration: 0.25 } }}
          style={{
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'var(--radius-feature)',
            padding: '2.25rem',
            maxWidth: '26rem',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '1.25rem' }}>
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.5rem',
                boxShadow: '0 8px 16px rgba(29, 78, 216, 0.4)',
                flexShrink: 0
              }}
            >
              25
            </motion.div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#ffffff', lineHeight: 1.2, fontFamily: 'Outfit, sans-serif' }}>
                25-MAKTAB
              </div>
              <div style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
                Akkreditatsiyadan o‘tgan davlat maktabi
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem 1rem', borderRadius: '0.75rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.5rem', borderRadius: '0.5rem', color: '#fbbf24', display: 'flex' }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>Respublika olimpiada g‘oliblari</div>
                <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>Matematika, fizika va robototexnika</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem 1rem', borderRadius: '0.75rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '0.5rem', color: '#34d399', display: 'flex' }}>
                <GraduationCap size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>98% OTMga kirish ko‘rsatkichi</div>
                <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>Mahalliy va nufuzli xorijiy universitetlar</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem 1rem', borderRadius: '0.75rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '0.5rem', color: '#60a5fa', display: 'flex' }}>
                <BookOpen size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>STEM & Chet tillari ixtisoslashuvi</div>
                <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>Ingliz va rus tillari chuqurlashtirilgan</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: '#94a3b8' }}>
            <ShieldCheck size={16} color="#34d399" />
            <span>Maktabgacha va maktab ta’limi vazirligi</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
