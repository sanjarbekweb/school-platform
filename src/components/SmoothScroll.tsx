'use client'

import React from 'react'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.1,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  )
}
