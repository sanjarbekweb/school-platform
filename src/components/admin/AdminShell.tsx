'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { SessionUser } from '@/lib/auth/session'
import {
  LayoutDashboard,
  Newspaper,
  Bell,
  Users,
  FileText,
  Award,
  Image,
  BookOpen,
  PenTool,
  FolderOpen,
  UserCheck,
  Shuffle,
  Settings,
  HelpCircle,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  ShieldAlert
} from 'lucide-react'

interface AdminShellProps {
  user: SessionUser
  reviewNewsCount: number
  children: React.ReactNode
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
  roles?: ('admin' | 'editor' | 'teacher')[]
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Asosiy',
    items: [
      {
        label: 'Boshqaruv paneli',
        href: '/admin',
        icon: LayoutDashboard,
        roles: ['admin', 'editor', 'teacher'],
      },
    ],
  },
  {
    title: 'Kontent va nashrlar',
    items: [
      {
        label: 'Yangiliklar',
        href: '/admin/news',
        icon: Newspaper,
        roles: ['admin', 'editor', 'teacher'],
      },
      {
        label: 'Rasmiy e’lonlar',
        href: '/admin/notices',
        icon: Bell,
        roles: ['admin', 'editor'],
      },
      {
        label: 'O‘qituvchi va xodimlar',
        href: '/admin/staff',
        icon: Users,
        roles: ['admin', 'editor', 'teacher'],
      },
      {
        label: 'Sahifalar',
        href: '/admin/pages',
        icon: FileText,
        roles: ['admin', 'editor'],
      },
      {
        label: 'Maktab yutuqlari',
        href: '/admin/awards',
        icon: Award,
        roles: ['admin', 'editor'],
      },
      {
        label: 'Fotogalereyalar',
        href: '/admin/albums',
        icon: Image,
        roles: ['admin', 'editor'],
      },
      {
        label: 'Maktab jurnallari',
        href: '/admin/magazines',
        icon: BookOpen,
        roles: ['admin', 'editor'],
      },
      {
        label: 'Blog va maqolalar',
        href: '/admin/blog',
        icon: PenTool,
        roles: ['admin', 'editor', 'teacher'],
      },
      {
        label: 'Media kutubxona',
        href: '/admin/media',
        icon: FolderOpen,
        roles: ['admin', 'editor', 'teacher'],
      },
    ],
  },
  {
    title: 'Tizim va sozlamalar',
    items: [
      {
        label: 'Foydalanuvchilar',
        href: '/admin/users',
        icon: UserCheck,
        roles: ['admin'],
      },
      {
        label: 'Qayta yo‘naltirishlar',
        href: '/admin/redirects',
        icon: Shuffle,
        roles: ['admin', 'editor'],
      },
      {
        label: 'Maktab sozlamalari',
        href: '/admin/settings',
        icon: Settings,
        roles: ['admin'],
      },
      {
        label: 'Yordam va yo‘riqnoma',
        href: '/admin/help',
        icon: HelpCircle,
        roles: ['admin', 'editor', 'teacher'],
      },
    ],
  },
]

export function AdminShell({ user, reviewNewsCount, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch {
      router.push('/admin/login')
    }
  }

  const roleLabel =
    user.role === 'admin'
      ? 'Administrator'
      : user.role === 'editor'
      ? 'Muharrir'
      : 'O‘qituvchi'

  const roleClass =
    user.role === 'admin'
      ? 'role-admin'
      : user.role === 'editor'
      ? 'role-editor'
      : 'role-teacher'

  // Determine section name for breadcrumbs
  const getBreadcrumbPage = () => {
    if (pathname === '/admin') return 'Bosh sahifa'
    const parts = pathname.replace('/admin/', '').split('/')
    const map: Record<string, string> = {
      news: 'Yangiliklar',
      notices: 'Rasmiy e’lonlar',
      staff: 'Xodimlar',
      pages: 'Sahifalar',
      awards: 'Maktab yutuqlari',
      albums: 'Fotogalereya',
      magazines: 'Jurnallar',
      blog: 'Blog va maqolalar',
      media: 'Media kutubxona',
      users: 'Foydalanuvchilar',
      redirects: 'Qayta yo‘naltirishlar',
      settings: 'Sozlamalar',
      help: 'Yordam'
    }
    return map[parts[0]] || parts[0].toUpperCase()
  }

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
              background: 'rgba(7, 13, 25, 0.6)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <Link
            href="/admin"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
          >
            <div className="admin-sidebar-logo">
              25
            </div>
            <div>
              <div className="admin-sidebar-title" style={{ fontFamily: 'Outfit, sans-serif' }}>
                25-MAKTAB
              </div>
              <div className="admin-sidebar-subtitle">
                Boshqaruv paneli
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="admin-sidebar-nav" aria-label="Admin menyusi">
          {NAV_GROUPS.map((group) => {
            const accessibleItems = group.items.filter(
              (item) => !item.roles || item.roles.includes(user.role)
            )
            if (accessibleItems.length === 0) return null

            return (
              <div key={group.title} style={{ marginBottom: '0.5rem' }}>
                <div className="admin-nav-group-title">{group.title}</div>
                {accessibleItems.map((item) => {
                  const IconComponent = item.icon
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href)
                  const showBadge = item.href === '/admin/news' && reviewNewsCount > 0

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={false}
                      className={`admin-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                      style={{ position: 'relative' }}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="adminActiveTab"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--color-primary-light)',
                            zIndex: 0,
                          }}
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', color: isActive ? 'var(--color-primary)' : 'inherit' }}>
                        <IconComponent size={17} />
                      </span>
                      <span style={{ position: 'relative', zIndex: 1, flex: 1 }}>{item.label}</span>
                      {showBadge && (
                        <span
                          className="admin-nav-badge"
                          style={{
                            position: 'relative',
                            zIndex: 1,
                            backgroundColor: '#f59e0b',
                            color: '#ffffff',
                            fontWeight: 700,
                            padding: '0.1rem 0.45rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem'
                          }}
                          title={`${reviewNewsCount} ta maqola ko‘rib chiqishni kutmoqda`}
                        >
                          {reviewNewsCount}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="admin-sidebar-footer" style={{ borderTop: '1px solid var(--color-border)', padding: '0.85rem 1rem' }}>
          <div className="admin-user-summary" style={{ flex: 1, minWidth: 0 }}>
            <div 
              className="admin-user-avatar"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1d4ed8 0%, #0b1528 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-info" style={{ minWidth: 0, flex: 1 }}>
              <div 
                className="admin-user-name" 
                title={user.name}
                style={{ 
                  fontWeight: 600, 
                  fontSize: '0.825rem', 
                  color: 'var(--color-text)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {user.name}
              </div>
              <span className={`admin-user-role-badge ${roleClass}`}>
                {roleLabel}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Tizimdan chiqish"
            aria-label="Tizimdan chiqish"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.45rem',
              color: 'var(--color-text-muted)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 300ms ease, background-color 300ms ease, transform 300ms ease'
            }}
            className="hover-bg"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-container">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.35rem',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="admin-breadcrumbs">
              <span style={{ color: 'var(--color-text-muted)' }}>Boshqaruv</span>
              <ChevronRight size={13} style={{ color: 'var(--color-border-hover)' }} />
              <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                {getBreadcrumbPage()}
              </span>
            </div>
          </div>

          <div className="admin-header-right">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ 
                padding: '0.4rem 0.75rem', 
                fontSize: 'var(--text-xs)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <span>Saytni ko‘rish</span>
              <ExternalLink size={12} />
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}
