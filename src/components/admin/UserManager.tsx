'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveDocumentAction, deleteDocumentAction } from '@/lib/actions/admin'
import type { SessionUser } from '@/lib/auth/session'

interface UserDoc {
  id: string | number
  name: string
  email: string
  role: 'admin' | 'editor' | 'teacher'
  linkedStaff?: any
}

interface UserManagerProps {
  initialUsers: UserDoc[]
  staffList: { id: string | number; fullName: string }[]
  currentUser: SessionUser
}

export function UserManager({
  initialUsers,
  staffList,
  currentUser,
}: UserManagerProps) {
  const router = useRouter()
  const [users, setUsers] = useState<UserDoc[]>(initialUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserDoc | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'editor' | 'teacher'>('teacher')
  const [linkedStaff, setLinkedStaff] = useState<string | number | ''>('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openCreateModal = () => {
    setEditingUser(null)
    setName('')
    setEmail('')
    setPassword('')
    setRole('teacher')
    setLinkedStaff('')
    setError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (u: UserDoc) => {
    setEditingUser(u)
    setName(u.name)
    setEmail(u.email)
    setPassword('')
    setRole(u.role)
    setLinkedStaff(
      typeof u.linkedStaff === 'object' ? u.linkedStaff?.id || '' : u.linkedStaff || ''
    )
    setError(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    const payloadData: Record<string, any> = {
      name,
      email: email.trim().toLowerCase(),
      role,
      linkedStaff: role === 'teacher' && linkedStaff ? linkedStaff : null,
    }

    if (password.trim()) {
      payloadData.password = password.trim()
    }

    const res = await saveDocumentAction('users', editingUser?.id || null, payloadData)

    if (!res.success) {
      setError(
        res.error ||
          (res.validationErrors && res.validationErrors.map((e) => e.message).join(' ')) ||
          'Xatolik yuz berdi'
      )
      setIsSaving(false)
      return
    }

    setIsModalOpen(false)
    setIsSaving(false)
    router.refresh()
  }

  const handleDelete = async (u: UserDoc) => {
    if (String(u.id) === String(currentUser.id)) {
      alert('Siz o‘z hisobingizni o‘chira olmaysiz!')
      return
    }

    if (!window.confirm(`Haqiqatan ham ${u.name} (${u.email}) foydalanuvchisini o‘chirmoqchimisiz?`)) {
      return
    }

    const res = await deleteDocumentAction('users', u.id)
    if (!res.success) {
      alert(res.error || 'O‘chirishda xatolik yuz berdi.')
      return
    }

    setUsers((prev) => prev.filter((item) => item.id !== u.id))
    router.refresh()
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Tizim foydalanuvchilari</h1>
          <p>Boshqaruv paneli kirish hisoblari, rollar va xodimlar birikmasi (Faqat Administrator uchun).</p>
        </div>

        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          👤 Yangi foydalanuvchi qo‘shish
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ism (F.I.O.)</th>
                <th>Elektron pochta</th>
                <th>Roli</th>
                <th>Biriktirilgan o‘qituvchi profili</th>
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const linkedStaffObj = staffList.find(
                  (s) =>
                    String(s.id) ===
                    String(typeof u.linkedStaff === 'object' ? u.linkedStaff?.id : u.linkedStaff)
                )

                return (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`admin-user-role-badge role-${u.role}`}>
                        {u.role === 'admin'
                          ? 'Administrator'
                          : u.role === 'editor'
                          ? 'Muharrir'
                          : 'O‘qituvchi'}
                      </span>
                    </td>
                    <td>
                      {linkedStaffObj ? (
                        <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>
                          👤 {linkedStaffObj.fullName}
                        </span>
                      ) : u.role === 'teacher' ? (
                        <span style={{ color: '#ef4444', fontSize: 'var(--text-xs)' }}>
                          ⚠️ Profil biriktirilmagan
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ padding: '0.2rem 0.5rem', fontSize: 'var(--text-xs)' }}
                          onClick={() => openEditModal(u)}
                        >
                          Tahrirlash
                        </button>
                        {String(u.id) !== String(currentUser.id) && (
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ color: '#ef4444', borderColor: '#ef4444', padding: '0.2rem 0.4rem', fontSize: 'var(--text-xs)' }}
                            onClick={() => handleDelete(u)}
                            title="O‘chirish"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '520px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
                {editingUser ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  padding: '0.75rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #ef4444',
                  borderRadius: 'var(--radius-md)',
                  color: '#b91c1c',
                  marginBottom: '1rem',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="user-name">
                  Ism (F.I.O.) *
                </label>
                <input
                  id="user-name"
                  type="text"
                  className="admin-input"
                  placeholder="Alisher Rustamov"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="user-email">
                  Elektron pochta (Email) *
                </label>
                <input
                  id="user-email"
                  type="email"
                  className="admin-input"
                  placeholder="nomi@maktab142.uz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="user-password">
                  {editingUser ? 'Yangi parol (O‘zgartirish shart bo‘lmasa bo‘sh qoldiring)' : 'Parol *'}
                </label>
                <input
                  id="user-password"
                  type="password"
                  className="admin-input"
                  placeholder="Kamida 8 ta belgi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editingUser}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="user-role">
                  Tizimdagi roli *
                </label>
                <select
                  id="user-role"
                  className="admin-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="admin">Administrator (To‘liq huquqlar)</option>
                  <option value="editor">Muharrir (Nashr qilish va tahrirlash)</option>
                  <option value="teacher">O‘qituvchi / Muallif (Faqat qoralamalar)</option>
                </select>
              </div>

              {role === 'teacher' && (
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="user-linked-staff">
                    Biriktirilgan o‘qituvchi profili
                  </label>
                  <select
                    id="user-linked-staff"
                    className="admin-select"
                    value={linkedStaff}
                    onChange={(e) => setLinkedStaff(e.target.value)}
                  >
                    <option value="">Biriktirilmagan</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName}
                      </option>
                    ))}
                  </select>
                  <span className="admin-form-help">
                    O‘qituvchi faqat o‘ziga biriktirilgan profilni tahrirlay oladi.
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
