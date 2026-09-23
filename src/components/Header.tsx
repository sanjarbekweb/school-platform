'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLanguage } from '@/context/LanguageContext'
import { 
  Menu, 
  X, 
  Search, 
  ChevronDown, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink,
  BookOpen,
  GraduationCap,
  Award,
  Calendar,
  FileText,
  Camera,
  ShieldCheck,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react'

interface DropdownItem {
  href: string
  titleKey: string
  descKey: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  badgeKey?: string
}

interface NavSection {
  id: string
  labelKey: string
  href?: string
  dropdown?: DropdownItem[]
}

const NAV_ITEMS: NavSection[] = [
  {
    id: 'home',
    labelKey: 'nav.home',
    href: '/',
  },
  {
    id: 'about',
    labelKey: 'nav.about',
    dropdown: [
      {
        href: '/maktab-haqida',
        titleKey: 'dropdown.about.overview.title',
        descKey: 'dropdown.about.overview.desc',
        icon: Building,
        iconBg: 'rgba(29, 78, 216, 0.1)',
        iconColor: '#1d4ed8'
      },
      {
        href: '/talim',
        titleKey: 'dropdown.about.curriculum.title',
        descKey: 'dropdown.about.curriculum.desc',
        icon: BookOpen,
        iconBg: 'rgba(5, 150, 105, 0.1)',
        iconColor: '#059669'
      },
      {
        href: '/school-profile',
        titleKey: 'dropdown.about.profile.title',
        descKey: 'dropdown.about.profile.desc',
        icon: GraduationCap,
        iconBg: 'rgba(79, 70, 229, 0.1)',
        iconColor: '#4f46e5',
        badgeKey: 'badge.important'
      },
      {
        href: '/ota-onalar',
        titleKey: 'dropdown.about.parents.title',
        descKey: 'dropdown.about.parents.desc',
        icon: User,
        iconBg: 'rgba(217, 119, 6, 0.1)',
        iconColor: '#d97706'
      }
    ]
  },
  {
    id: 'news',
    labelKey: 'nav.news',
    dropdown: [
      {
        href: '/yangiliklar',
        titleKey: 'dropdown.news.all.title',
        descKey: 'dropdown.news.all.desc',
        icon: FileText,
        iconBg: 'rgba(29, 78, 216, 0.1)',
        iconColor: '#1d4ed8'
      },
      {
        href: '/elonlar',
        titleKey: 'dropdown.news.notices.title',
        descKey: 'dropdown.news.notices.desc',
        icon: Clock,
        iconBg: 'rgba(217, 119, 6, 0.1)',
        iconColor: '#d97706',
        badgeKey: 'badge.new'
      }
    ]
  },
  {
    id: 'teachers',
    labelKey: 'nav.teachers',
    href: '/oqituvchilar',
  },
  {
    id: 'life',
    labelKey: 'nav.life',
    dropdown: [
      {
        href: '/maktab-hayoti',
        titleKey: 'dropdown.life.events.title',
        descKey: 'dropdown.life.events.desc',
        icon: Calendar,
        iconBg: 'rgba(29, 78, 216, 0.1)',
        iconColor: '#1d4ed8'
      },
      {
        href: '/yutuqlar',
        titleKey: 'dropdown.life.awards.title',
        descKey: 'dropdown.life.awards.desc',
        icon: Award,
        iconBg: 'rgba(217, 119, 6, 0.1)',
        iconColor: '#d97706'
      },
      {
        href: '/galereya',
        titleKey: 'dropdown.life.gallery.title',
        descKey: 'dropdown.life.gallery.desc',
        icon: Camera,
        iconBg: 'rgba(5, 150, 105, 0.1)',
        iconColor: '#059669'
      }
    ]
  },
  {
    id: 'pubs',
    labelKey: 'nav.pubs',
    dropdown: [
      {
        href: '/jurnallar',
        titleKey: 'dropdown.pubs.magazines.title',
        descKey: 'dropdown.pubs.magazines.desc',
        icon: BookOpen,
        iconBg: 'rgba(79, 70, 229, 0.1)',
        iconColor: '#4f46e5'
      },
      {
        href: '/blog',
        titleKey: 'dropdown.pubs.blog.title',
        descKey: 'dropdown.pubs.blog.desc',
        icon: FileText,
        iconBg: 'rgba(29, 78, 216, 0.1)',
        iconColor: '#1d4ed8'
      }
    ]
  },
  {
    id: 'contact',
    labelKey: 'nav.contact',
    href: '/boglanish',
  }
]

export function Header() {
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [expandedMobileSections, setExpandedMobileSections] = useState<Record<string, boolean>>({
    about: true,
  })
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const toggleBtnRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Track scroll position to compact header
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer and dropdowns on route navigation
  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
    setHoveredNav(null)
  }, [pathname])

  // Scroll lock when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [mobileMenuOpen])

  // Auto-close mobile drawer when window resizes to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Keyboard navigation: Escape key closes menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false)
          toggleBtnRef.current?.focus()
        }
        setActiveDropdown(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  const handleMouseEnter = (id: string, hasDropdown: boolean) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setHoveredNav(id)
    if (hasDropdown) {
      setActiveDropdown(id)
    } else {
      setActiveDropdown(null)
    }
  }

  const handleMouseLeave = () => {
    setHoveredNav(null)
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 180)
  }

  const toggleMobileSection = (id: string) => {
    setExpandedMobileSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const isNavActive = (item: NavSection): boolean => {
    if (item.href) {
      if (item.href === '/') return pathname === '/'
      return Boolean(pathname?.startsWith(item.href))
    }
    if (item.dropdown) {
      return item.dropdown.some(sub => pathname?.startsWith(sub.href))
    }
    return false
  }

  return (
    <header className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Main Navigation Bar with Glassmorphism */}
      <div className={`glass-nav ${isScrolled ? 'glass-nav-scrolled' : ''}`}>
        <div 
          className="container" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '0.75rem',
            minHeight: '4.25rem',
            paddingTop: '0.35rem',
            paddingBottom: '0.35rem'
          }}
        >
          {/* Brand Logo & Academic Crest */}
          <Link 
            href="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              textDecoration: 'none',
              flexShrink: 0
            }} 
            aria-label="25-maktab Bosh sahifasi"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              style={{
                width: '2.65rem',
                height: '2.65rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #0b1528 0%, #1e335b 100%)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 4px 12px rgba(11, 21, 40, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.2rem',
                letterSpacing: '-0.02em',
                flexShrink: 0
              }}
            >
              25
            </motion.div>
            <div>
              <div style={{ 
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800, 
                color: 'var(--color-navy-950)', 
                fontSize: '1.18rem', 
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap'
              }}>
                25-MAKTAB
              </div>
              <div 
                className="brand-subtitle"
                style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--color-muted)', 
                  fontWeight: 500, 
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap'
                }}
              >
                Toshkent • Mirzo Ulug‘bek tumani
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav 
            className="desktop-nav" 
            style={{ 
              alignItems: 'center', 
              gap: '0.2rem',
              position: 'relative'
            }} 
            aria-label="Asosiy navigatsiya"
            onMouseLeave={handleMouseLeave}
          >
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item)
              const isHovered = hoveredNav === item.id
              const isOpen = activeDropdown === item.id
              const label = t(item.labelKey)

              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`nav-item-btn ${active ? 'active' : ''}`}
                    onMouseEnter={() => handleMouseEnter(item.id, false)}
                    aria-current={active ? 'page' : undefined}
                  >
                    {isHovered && (
                      <motion.span
                        layoutId="navHoverPill"
                        className="nav-hover-pill"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span>{label}</span>
                  </Link>
                )
              }

              return (
                <div 
                  key={item.id} 
                  style={{ position: 'relative' }}
                  onMouseEnter={() => handleMouseEnter(item.id, true)}
                >
                  <button
                    type="button"
                    className={`nav-item-btn ${active ? 'active' : ''}`}
                    onClick={() => setActiveDropdown(isOpen ? null : item.id)}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                  >
                    {isHovered && (
                      <motion.span
                        layoutId="navHoverPill"
                        className="nav-hover-pill"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span>{label}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: 'inline-flex' }}
                    >
                      <ChevronDown size={14} style={{ opacity: 0.7 }} />
                    </motion.span>
                  </button>

                  {/* Dropdown Popover with Framer Motion */}
                  <AnimatePresence>
                    {isOpen && item.dropdown && (
                      <motion.div
                        className="dropdown-menu-popover"
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ type: 'spring', damping: 26, stiffness: 360 }}
                        style={{
                          minWidth: item.id === 'about' ? '21.5rem' : '18rem'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {item.dropdown.map((sub) => {
                            const IconComponent = sub.icon
                            const isSubActive = pathname === sub.href
                            const subTitle = t(sub.titleKey)
                            const subDesc = t(sub.descKey)
                            const subBadge = sub.badgeKey ? t(sub.badgeKey) : undefined

                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className="dropdown-item-link"
                                style={{
                                  backgroundColor: isSubActive ? 'var(--color-primary-light)' : undefined,
                                  color: isSubActive ? 'var(--color-primary)' : undefined,
                                }}
                              >
                                <div 
                                  className="dropdown-item-icon"
                                  style={{
                                    backgroundColor: sub.iconBg,
                                    color: sub.iconColor
                                  }}
                                >
                                  <IconComponent size={17} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.45rem',
                                    fontWeight: isSubActive ? 600 : 500
                                  }}>
                                    <span>{subTitle}</span>
                                    {subBadge && (
                                      <span style={{
                                        fontSize: '0.6875rem',
                                        padding: '0.12rem 0.45rem',
                                        borderRadius: '9999px',
                                        background: subBadge === 'Muhim' || subBadge === 'Важно' || subBadge === 'Important' 
                                          ? 'rgba(37, 99, 235, 0.12)' 
                                          : 'rgba(217, 119, 6, 0.12)',
                                        color: subBadge === 'Muhim' || subBadge === 'Важно' || subBadge === 'Important' 
                                          ? '#1d4ed8' 
                                          : '#d97706',
                                        fontWeight: 700
                                      }}>
                                        {subBadge}
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ 
                                    fontSize: '0.75rem', 
                                    color: 'var(--color-muted)', 
                                    marginTop: '0.1rem',
                                    lineHeight: 1.25,
                                    whiteSpace: 'normal'
                                  }}>
                                    {subDesc}
                                  </div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>

          {/* Quick Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* Language Switcher Button */}
            <LanguageSwitcher variant="navbar" />

            <ThemeToggle />

            <Link
              href="/search"
              className="btn btn-outline"
              style={{ 
                padding: '0.45rem', 
                minWidth: '40px', 
                minHeight: '40px', 
                borderRadius: 'var(--radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label={t('action.search')}
              title={t('action.search')}
            >
              <Search size={18} />
            </Link>

            <Link
              href="/admin"
              className="btn btn-primary header-admin-btn"
              style={{ 
                padding: '0.5rem 0.85rem', 
                fontSize: '0.86rem', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                borderRadius: 'var(--radius-md)',
                whiteSpace: 'nowrap'
              }}
              aria-label={t('action.admin')}
              title={t('action.admin')}
            >
              <User size={15} />
              <span className="admin-btn-text">{t('action.admin')}</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <motion.button
              ref={toggleBtnRef}
              type="button"
              whileTap={{ scale: 0.92 }}
              className="mobile-nav-toggle btn btn-outline"
              style={{ 
                padding: '0.45rem', 
                minWidth: '42px', 
                minHeight: '42px', 
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Menyuni yopish' : 'Mobil menyuni ochish'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer with Framer Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobil navigatsiya menyusi"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(7, 13, 25, 0.65)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Sheet */}
            <motion.div
              ref={drawerRef}
              data-lenis-prevent
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '22.5rem',
                height: '100%',
                background: 'var(--color-surface)',
                boxShadow: 'var(--shadow-xl)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                zIndex: 1000
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '2.3rem',
                    height: '2.3rem',
                    borderRadius: '0.65rem',
                    background: 'linear-gradient(135deg, #0b1528 0%, #1e335b 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem'
                  }}>
                    25
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--color-navy-950)', fontSize: '1.05rem', lineHeight: 1.2 }}>
                      {t('mobile.drawer.title')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
                      {t('mobile.drawer.city')}
                    </div>
                  </div>
                </div>

                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline"
                  style={{ padding: '0.35rem', minWidth: '36px', minHeight: '36px', borderRadius: 'var(--radius-sm)' }}
                  aria-label="Menyuni yopish"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div style={{ padding: '1rem 1.25rem 0.25rem' }}>
                <LanguageSwitcher variant="mobile" />
              </div>

              {/* Drawer Links List */}
              <div style={{ padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                {NAV_ITEMS.map((item) => {
                  const active = isNavActive(item)
                  const isAccordionOpen = expandedMobileSections[item.id]
                  const label = t(item.labelKey)

                  if (item.href) {
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.75rem 0.9rem',
                          borderRadius: '0.65rem',
                          fontWeight: active ? 700 : 600,
                          fontSize: '0.925rem',
                          textDecoration: 'none',
                          color: active ? 'var(--color-primary)' : 'var(--color-text)',
                          backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <span>{label}</span>
                      </Link>
                    )
                  }

                  return (
                    <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                      <button
                        type="button"
                        onClick={() => toggleMobileSection(item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '0.75rem 0.9rem',
                          borderRadius: '0.65rem',
                          fontWeight: active ? 700 : 600,
                          fontSize: '0.925rem',
                          color: active ? 'var(--color-primary)' : 'var(--color-text)',
                          backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span>{label}</span>
                        <motion.span
                          animate={{ rotate: isAccordionOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ display: 'inline-flex' }}
                        >
                          <ChevronDown size={16} style={{ opacity: 0.6 }} />
                        </motion.span>
                      </button>

                      {/* Accordion Sub-items */}
                      <AnimatePresence initial={false}>
                        {isAccordionOpen && item.dropdown && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ 
                              paddingLeft: '0.75rem', 
                              paddingTop: '0.25rem', 
                              paddingBottom: '0.25rem', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: '0.2rem',
                              borderLeft: '2px solid var(--color-border)',
                              marginLeft: '0.9rem'
                            }}>
                              {item.dropdown.map((sub) => {
                                const isSubActive = pathname === sub.href
                                const SubIcon = sub.icon
                                const subTitle = t(sub.titleKey)
                                const subBadge = sub.badgeKey ? t(sub.badgeKey) : undefined

                                return (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.65rem',
                                      padding: '0.55rem 0.75rem',
                                      borderRadius: '0.5rem',
                                      textDecoration: 'none',
                                      fontSize: '0.875rem',
                                      fontWeight: isSubActive ? 700 : 500,
                                      color: isSubActive ? 'var(--color-primary)' : 'var(--color-text)',
                                      backgroundColor: isSubActive ? 'var(--color-primary-light)' : 'transparent',
                                    }}
                                  >
                                    <SubIcon size={15} color={isSubActive ? 'var(--color-primary)' : sub.iconColor} />
                                    <span>{subTitle}</span>
                                    {subBadge && (
                                      <span style={{
                                        fontSize: '0.65rem',
                                        padding: '0.1rem 0.4rem',
                                        borderRadius: '9999px',
                                        background: 'rgba(37, 99, 235, 0.12)',
                                        color: '#1d4ed8',
                                        fontWeight: 700,
                                        marginLeft: 'auto'
                                      }}>
                                        {subBadge}
                                      </span>
                                    )}
                                  </Link>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

              {/* Drawer Quick Actions Footer */}
              <div style={{ 
                padding: '1.25rem', 
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                backgroundColor: 'var(--color-surface-subtle)',
                flexShrink: 0
              }}>
                <a
                  href="https://emaktab.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    width: '100%',
                    color: '#2563eb',
                    fontWeight: 600
                  }}
                >
                  <span>{t('mobile.drawer.emaktab')}</span>
                  <ExternalLink size={14} />
                </a>

                <Link
                  href="/admin"
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    width: '100%'
                  }}
                >
                  <User size={15} />
                  <span>{t('mobile.drawer.admin')}</span>
                </Link>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  paddingTop: '0.4rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-muted)'
                }}>
                  <a href="tel:+998712680142" style={{ color: 'inherit', textDecoration: 'none' }}>
                    +998 71 268 01 42
                  </a>
                  <span>25-maktab © 2026</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}
