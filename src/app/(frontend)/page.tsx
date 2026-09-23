import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { formatUzbekDate, getMediaUrl, getMediaAlt, isImageMedia } from '@/lib/utils'
import { 
  ArrowRight, 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Download, 
  FileText, 
  Phone, 
  MapPin, 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  ExternalLink,
  Sparkles,
  Send
} from 'lucide-react'
import { HomeHeroAnimated, MotionFadeIn, MotionCard } from '@/components/MotionWrappers'

export default async function HomePage() {
  const payload = await getPayloadClient()

  // Fetch 3 latest published news articles
  const newsRes = await payload.find({
    collection: 'news',
    where: { status: { equals: 'nashr_qilingan' } },
    sort: '-publishedAt',
    limit: 3,
  }).catch(() => ({ docs: [] }))

  // Fetch recent achievements
  const awardsRes = await payload.find({
    collection: 'awards',
    where: { status: { equals: 'nashr_qilingan' } },
    sort: '-year',
    limit: 3,
  }).catch(() => ({ docs: [] }))

  // Fetch latest magazine
  const magazineRes = await payload.find({
    collection: 'magazines',
    where: { status: { equals: 'nashr_qilingan' } },
    sort: '-publishDate',
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const latestMagazine = magazineRes.docs[0] || null

  return (
    <div>
      {/* 1. High-Impact Modern Hero Section */}
      <section className="hero-gradient-dark" style={{ paddingTop: '4.5rem', paddingBottom: '5.5rem' }}>
        <div className="container">
          <HomeHeroAnimated />
        </div>
      </section>

      {/* 2. Institutional Performance Metrics (Floating Stat Strip) */}
      <section style={{ transform: 'translateY(-2rem)', marginBottom: '-0.5rem', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <MotionFadeIn delay={0.15}>
            <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-4-lg" style={{ gap: '1.25rem' }}>
              
              <div className="stat-pill">
                <div className="stat-icon-wrap" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                  <Users size={26} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-950)', lineHeight: 1.1 }}>
                    1 250+
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                    Tahsil oluvchi o‘quvchilar
                  </div>
                </div>
              </div>

              <div className="stat-pill">
                <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <GraduationCap size={26} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-950)', lineHeight: 1.1 }}>
                    85+
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                    Malakali oliy toifali pedagog
                  </div>
                </div>
              </div>

              <div className="stat-pill">
                <div className="stat-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
                  <Award size={26} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-950)', lineHeight: 1.1 }}>
                    98%
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                    OTMga qabul ko‘rsatkichi
                  </div>
                </div>
              </div>

              <div className="stat-pill">
                <div className="stat-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                  <Sparkles size={26} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-950)', lineHeight: 1.1 }}>
                    40+
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                    Olimpiada va tanlov sovrindori
                  </div>
                </div>
              </div>

            </div>
          </MotionFadeIn>
        </div>
      </section>

      {/* 3. Fast-Action Stakeholder Portals (4 Hub Cards) */}
      <section className="section" style={{ paddingTop: '3.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '42rem', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Tezkor xizmatlar</span>
            <h2>O‘quvchilar, ota-onalar va ustozlar uchun qulay portallar</h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Kerakli ma’lumotlar, ta’lim dasturlari, dars jadvallari va qabul tizimiga to‘g‘ridan-to‘g‘ri o‘ting.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-4-lg" style={{ gap: '1.5rem' }}>
            
            {/* Hub 1: Students */}
            <div className="portal-card blue">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>O‘quvchilar uchun</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', flex: 1, lineHeight: 1.6 }}>
                Dars jadvali, fan to‘garaklari, olimpiadalarga tayyorgarlik materiallari va baholash mezonlari.
              </p>
              <Link href="/talim" style={{ fontWeight: 600, fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem' }}>
                <span>O‘quv dasturi</span>
                <ChevronRight size={15} />
              </Link>
            </div>

            {/* Hub 2: Parents */}
            <div className="portal-card amber">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Ota-onalar xizmati</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', flex: 1, lineHeight: 1.6 }}>
                eMaktab (Kundalik) tizimiga kirish, ota-onalar majlisi taqvimi, maktab formasi va ichki tartib.
              </p>
              <Link href="/ota-onalar" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#d97706', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem' }}>
                <span>Ma’lumotlar</span>
                <ChevronRight size={15} />
              </Link>
            </div>

            {/* Hub 3: Admissions */}
            <div className="portal-card emerald">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <GraduationCap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Qabul va Hujjatlar</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', flex: 1, lineHeight: 1.6 }}>
                1-sinfga qabul tartibi, mikrorayon ro‘yxati, qabul komissiyasi talablari va School Profile ma’lumotnomasi.
              </p>
              <Link href="/school-profile" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem' }}>
                <span>School Profile</span>
                <ChevronRight size={15} />
              </Link>
            </div>

            {/* Hub 4: Library */}
            <div className="portal-card indigo">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Elektron Jurnal</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', flex: 1, lineHeight: 1.6 }}>
                Maktab davriy ilmiy jurnali sonlari, o‘qituvchilar va iqtidorli o‘quvchilar maqolalari (PDF).
              </p>
              <Link href="/jurnallar" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#7c3aed', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem' }}>
                <span>Nashrlar arxivi</span>
                <ChevronRight size={15} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Director's Welcome & Institutional Values */}
      <section className="section" style={{ background: '#ffffff', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="grid grid-cols-1 grid-cols-2-sm" style={{ alignItems: 'center', gap: '3.5rem' }}>
            
            {/* Left: Director Greeting Card */}
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Rahbariyat murojaati</span>
              <h2 style={{ marginBottom: '1.25rem' }}>
                &ldquo;Har bir o‘quvchining qobiliyatini ro‘yobga chiqarish — bizning oliy maqsadimizdir&rdquo;
              </h2>
              <blockquote style={{ margin: '0 0 1.5rem 0', paddingLeft: '1.25rem', borderLeft: '3px solid var(--color-primary)', fontStyle: 'italic', color: '#334155', fontSize: '1.05rem', lineHeight: 1.75 }}>
                142-maktab jamoasi sifatida biz faqatgina fan asoslarini o‘rgatish bilan cheklanmaymiz. 
                Biz zamonaviy dunyoda mustaqil fikrlay oladigan, milliy va umuminsoniy qadriyatlarga sodiq, 
                Vatanimiz taraqqiyotiga munosib hissa qo‘sha oladigan barkamol shaxslarni kamolga yetkazamiz.
              </blockquote>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  flexShrink: 0
                }}>
                  RDS
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-navy-950)' }}>
                    Rahimova Dilnoza Shavkatovna
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                    Maktab direktori • Oliy toifali pedagog
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Core School Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #1d4ed8' }}>
                <h4 style={{ margin: '0 0 0.35rem 0', color: 'var(--color-navy-950)' }}>
                  1. Chuqur akademik tayyorgarlik
                </h4>
                <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                  Aniq fanlar, robototexnika va xorijiy tillarni chuqur o‘rganish orqali xalqaro standartlarga mos bilim beriladi.
                </p>
              </div>

              <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                <h4 style={{ margin: '0 0 0.35rem 0', color: 'var(--color-navy-950)' }}>
                  2. Ma’naviy-axloqiy tarbiya
                </h4>
                <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                  Kitobxonlik madaniyati, vatanparvarlik va jamoada ishlash ko‘nikmalarini shakllantiruvchi qator to‘garaklar.
                </p>
              </div>

              <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                <h4 style={{ margin: '0 0 0.35rem 0', color: 'var(--color-navy-950)' }}>
                  3. Universitetlarga maqsadli yo‘naltirish
                </h4>
                <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                  10–11 sinflarda profil ta’limi, IELTS/CEFR sertifikatlari va xalqaro stipendiya dasturlariga tizimli tayyorgarlik.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. One School, 3 Continuous Stages */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '40rem', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Ta’lim bosqichlari</span>
            <h2>1-sinfdan 11-sinfgacha uzluksiz ta’lim zanjiri</h2>
            <p style={{ color: 'var(--color-muted)' }}>
              Yosh xususiyatlarini hisobga olgan holda tashkil etilgan uch bosqichli ta’lim dasturi.
            </p>
          </div>

          <div className="grid grid-cols-1 grid-cols-3-lg">
            {/* Stage 1 */}
            <div className="card">
              <div style={{ padding: '1.5rem 1.75rem', background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>1–4 sinflar</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Boshlang‘ich ta’lim</h3>
              </div>
              <div className="card-body">
                <p style={{ color: 'var(--color-muted)', fontSize: '0.925rem', flex: 1, lineHeight: 1.65 }}>
                  Mantiqiy fikrlash, savodxonlik, nutq o‘stirish va qiziqarli interaktiv o‘yinlar orqali ta’limga bo‘lgan muhabbat shakllantiriladi.
                </p>
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.85rem', color: '#475569' }}>
                  <strong>Urg‘u:</strong> Savodxonlik, hisoblash va kitobxonlik
                </div>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="card">
              <div style={{ padding: '1.5rem 1.75rem', background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>5–9 sinflar</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Tayanch o‘rta ta’lim</h3>
              </div>
              <div className="card-body">
                <p style={{ color: 'var(--color-muted)', fontSize: '0.925rem', flex: 1, lineHeight: 1.65 }}>
                  Aniq va tabiiy fanlar, chet tillari hamda zamonaviy IT ko‘nikmalarini chuqurlashtirib o‘rgatish, fan olimpiadalariga tayyorgarlik.
                </p>
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.85rem', color: '#475569' }}>
                  <strong>Urg‘u:</strong> STEM fanlar va laboratoriya tajribalari
                </div>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="card">
              <div style={{ padding: '1.5rem 1.75rem', background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>10–11 sinflar</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Umumiy o‘rta ta’lim</h3>
              </div>
              <div className="card-body">
                <p style={{ color: 'var(--color-muted)', fontSize: '0.925rem', flex: 1, lineHeight: 1.65 }}>
                  Oliy o‘quv yurtlariga maqsadli kirish, xalqaro til sertifikatlari (IELTS, CEFR), kasbiy yo‘naltirish va davlat attestatsiyasi.
                </p>
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.85rem', color: '#475569' }}>
                  <strong>Urg‘u:</strong> OTMga kirish va xalqaro tanlovlar
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Dynamic News & Announcements Section */}
      <section className="section" style={{ background: '#ffffff', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Maktab hayoti</span>
              <h2 style={{ marginBottom: 0 }}>So‘nggi yangiliklar va tadbirlar</h2>
            </div>
            <Link href="/yangiliklar" className="btn btn-outline">
              <span>Barcha yangiliklar arxivi</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {newsRes.docs.length > 0 ? (
            <div className="grid grid-cols-1 grid-cols-3-lg">
              {newsRes.docs.map((item: any) => (
                <article key={item.id} className="card">
                  {item.coverImage ? (
                    <div style={{ height: '210px', overflow: 'hidden', background: '#e2e8f0', position: 'relative' }}>
                      <Image
                        src={getMediaUrl(item.coverImage)}
                        alt={getMediaAlt(item.coverImage, item.title)}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div style={{ height: '140px', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                      <FileText size={36} style={{ opacity: 0.7 }} />
                    </div>
                  )}
                  <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '0.65rem' }}>
                      <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{item.category || 'Yangilik'}</span>
                      <span>•</span>
                      <span>{formatUzbekDate(item.publishedAt)}</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                      <Link href={`/yangiliklar/${item.slug}`} style={{ color: 'var(--color-navy-950)' }}>
                        {item.title}
                      </Link>
                    </h3>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', flex: 1, lineHeight: 1.6 }}>
                      {item.summary}
                    </p>
                    <Link href={`/yangiliklar/${item.slug}`} style={{ fontWeight: 600, fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.75rem' }}>
                      <span>Batafsil o‘qish</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-muted)' }}>
              <p style={{ margin: 0, fontSize: '1.05rem' }}>Rasmiy yangiliklar tayyorlanmoqda. Tez orada e’lon qilinadi.</p>
            </div>
          )}
        </div>
      </section>

      {/* 7. School Publications & Achievements Showcase */}
      <section className="section" style={{ background: 'var(--color-background)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="grid grid-cols-1 grid-cols-2-sm" style={{ gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Left: Magazine Showcase */}
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Ilmiy-ijodiy nashr</span>
              <h2>Maktab jurnali (Davriy nashr)</h2>
              <p style={{ color: 'var(--color-muted)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                O‘quvchilarimiz va pedagoglarimizning ilmiy tadqiqotlari, ijodiy namunalari va metodik maqolalarini o‘z ichiga olgan rasmiy jurnalimiz.
              </p>

              {latestMagazine ? (
                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  background: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                  alignItems: 'center'
                }}>
                  <div style={{ width: '90px', height: '125px', position: 'relative', flexShrink: 0, borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                    <Image
                      src={isImageMedia(latestMagazine.coverImage) ? getMediaUrl(latestMagazine.coverImage) : '/images/magazine-cover-2026.svg'}
                      alt={latestMagazine.title}
                      width={90}
                      height={125}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.15rem', color: 'var(--color-navy-950)' }}>
                      {latestMagazine.title}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
                      {latestMagazine.issueNumber} • {latestMagazine.fileSize || 'PDF'}
                    </div>
                    <Link href={`/jurnallar/${latestMagazine.slug}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      <Download size={15} />
                      <span>PDF yuklab olish</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>
                  Yangi jurnal soni nashrga tayyorlanmoqda.
                </div>
              )}
            </div>

            {/* Right: Honors & Olympiad Achievements */}
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Yutuqlarimiz</span>
              <h2>Faxrimiz va G‘oliblarimiz</h2>
              <p style={{ color: 'var(--color-muted)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                O‘quvchilarimiz shahar va Respublika miqyosidagi fan olimpiadalari hamda tanlovlarda muntazam faxrli o‘rinlarni egallab kelmoqda.
              </p>

              {awardsRes.docs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {awardsRes.docs.map((award: any) => (
                    <div 
                      key={award.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '0.85rem', 
                        padding: '1rem 1.25rem', 
                        background: '#ffffff', 
                        borderRadius: 'var(--radius-control)',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-xs)'
                      }}
                    >
                      <CheckCircle2 size={22} color="#059669" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--color-navy-950)' }}>
                          {award.title}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
                          {award.recipient} • <span style={{ color: '#d97706', fontWeight: 600 }}>{award.result}</span> ({award.year})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>
                  Maktab yutuqlari ro‘yxati tekshirilmoqda.
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 8. Institutional Contact & Location Strip */}
      <section className="section" style={{ background: '#ffffff', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="card" style={{ padding: '2.5rem', background: '#ffffff', border: '1px solid var(--color-border)' }}>
            <div className="grid grid-cols-1 grid-cols-3-lg" style={{ gap: '2.5rem', alignItems: 'center' }}>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#eff6ff', padding: '0.85rem', borderRadius: '0.75rem', color: '#1d4ed8' }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-navy-950)' }}>Manzilimiz</h4>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Toshkent shahri, Mirzo Ulug‘bek tumani, Sayram ko‘chasi, 42-uy
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#eff6ff', padding: '0.85rem', borderRadius: '0.75rem', color: '#1d4ed8' }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-navy-950)' }}>Qabulxona telefoni</h4>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    +998 71 268 01 42
                  </p>
                  <a href="mailto:info@maktab142.uz" style={{ fontSize: '0.85rem', color: '#1d4ed8' }}>
                    info@maktab142.uz
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#eff6ff', padding: '0.85rem', borderRadius: '0.75rem', color: '#1d4ed8' }}>
                  <Clock size={24} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-navy-950)' }}>Qabul vaqtlari</h4>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Dushanba – Juma: 09:00 – 17:00<br />
                    Shanba: 09:00 – 14:00
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
