'use client'

import React from 'react'
import { Printer } from 'lucide-react'

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.print()
        }
      }}
      className="btn btn-outline"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      aria-label="Sahifani chop etish"
    >
      <Printer size={18} aria-hidden="true" />
      <span>Chop etish (Print)</span>
    </button>
  )
}
