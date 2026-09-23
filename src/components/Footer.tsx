import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="no-print" style={{ 
      background: 'linear-gradient(180deg, #070d19 0%, #030712 100%)', 
      color: '#ffffff', 
      marginTop: 'auto', 
      paddingTop: '4.5rem', 
      paddingBottom: '2rem',
      borderTop: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div className="container">
        
        {/* Top Institutional Banner inside Footer */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-card)',
          padding: '1.75rem 2rem',
          marginBottom: '3.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>
                Davlat umumiy o‘rta ta’lim muassasasi
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                O‘zbekiston Respublikasi Maktabgacha va maktab ta’limi vazirligi tasarrufida
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a 
              href="https://t.me/maktab25_uz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-ghost-white"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Send size={14} />
              <span>Rasmiy Telegram kanali</span>
            </a>
            <a 
              href="https://emaktab.uz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-ghost-white"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <ExternalLink size={14} />
              <span>Kundalik (eMaktab)</span>
            </a>
          </div>
        </div>

        {/* 4 Multi-column Grid */}
        <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-4-lg" style={{ gap: '2.5rem', marginBottom: '3.5rem' }}>
          
          {/* Column 1: School Identity & Contact */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                background: '#ffffff',
                color: '#070d19',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.15rem'
              }}>
                25
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', lineHeight: 1.1 }}>25-MAKTAB</div>
                <div style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600 }}>TOSHKENT SHAHRI</div>
              </div>
            </div>
            
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              Har bir o‘quvchining shaxsiy qobiliyati va yuksak natijalarini rivojlantirishga qaratilgan zamonaviy ta’lim maskani.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="#60a5fa" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                <span>Toshkent sh., Mirzo Ulug‘bek tumani, 25-maktab</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#60a5fa" style={{ flexShrink: 0 }} />
                <a href="tel:+998712000025" style={{ color: '#ffffff' }}>+998 71 200 00 25</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#60a5fa" style={{ flexShrink: 0 }} />
                <a href="mailto:info@maktab25.uz" style={{ color: '#ffffff' }}>info@maktab25.uz</a>
              </div>
            </div>
          </div>

          {/* Column 2: Maktab haqida */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '0.65rem' }}>
              Maktab haqida
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li><Link href="/maktab-haqida" style={{ color: '#94a3b8' }} className="footer-link">Umumiy ma’lumot va tarix</Link></li>
              <li><Link href="/talim" style={{ color: '#94a3b8' }} className="footer-link">Ta’lim bosqichlari (1–11 sinf)</Link></li>
              <li><Link href="/school-profile" style={{ color: '#60a5fa', fontWeight: 600 }} className="footer-link">Maktab profili (School Profile)</Link></li>
              <li><Link href="/oqituvchilar" style={{ color: '#94a3b8' }} className="footer-link">Pedagogik tarkib</Link></li>
              <li><Link href="/ota-onalar" style={{ color: '#94a3b8' }} className="footer-link">Ota-onalar uchun ma’lumot</Link></li>
              <li><Link href="/maxfiylik" style={{ color: '#94a3b8' }} className="footer-link">Maxfiylik siyosati</Link></li>
            </ul>
          </div>

          {/* Column 3: Nashrlar va Faoliyat */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '0.65rem' }}>
              Faoliyat va Nashrlar
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li><Link href="/yangiliklar" style={{ color: '#94a3b8' }} className="footer-link">So‘nggi yangiliklar</Link></li>
              <li><Link href="/elonlar" style={{ color: '#94a3b8' }} className="footer-link">Rasmiy e’lonlar</Link></li>
              <li><Link href="/jurnallar" style={{ color: '#94a3b8' }} className="footer-link">Maktab jurnali (PDF)</Link></li>
              <li><Link href="/yutuqlar" style={{ color: '#94a3b8' }} className="footer-link">Maktab yutuqlari va sovrinlar</Link></li>
              <li><Link href="/galereya" style={{ color: '#94a3b8' }} className="footer-link">Fotogalereya</Link></li>
              <li><Link href="/blog" style={{ color: '#94a3b8' }} className="footer-link">O‘qituvchilar blogi</Link></li>
            </ul>
          </div>

          {/* Column 4: Admissions and Admin */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '0.65rem' }}>
              Qabul va xodimlar
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Qabul, hujjatlar va rasmiy ma’lumotlar maktab ma’muriyati tomonidan belgilangan tartibda ko‘rib chiqiladi.
            </p>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-sm)', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                Pedagoglar va muharrirlar uchun:
              </div>
              <Link 
                href="/admin" 
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
              >
                Boshqaruv paneliga kirish &rarr;
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.08)', 
          paddingTop: '1.75rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          fontSize: '0.8125rem', 
          color: '#64748b' 
        }}>
          <div>
            &copy; {new Date().getFullYear()} 25-sonli umumiy o‘rta ta’lim maktabi. Barcha huquqlar qonun bilan himoyalangan.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span>Toshkent shahri, Mirzo Ulug‘bek tumani</span>
            <span>•</span>
            <span style={{ color: '#94a3b8' }}>Rasmiy veb-portal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
