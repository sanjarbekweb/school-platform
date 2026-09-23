'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'uz' | 'ru' | 'en'

interface Translations {
  [key: string]: {
    uz: string
    ru: string
    en: string
  }
}

export const TRANSLATIONS: Translations = {
  // Top utility strip
  'topbar.institution': {
    uz: '25-sonli davlat umumiy o‘rta ta’lim maktabi',
    ru: 'Государственная школа №25',
    en: 'State School No. 25'
  },
  'topbar.emaktab': {
    uz: 'Kundalik (eMaktab)',
    ru: 'Дневник (eMaktab)',
    en: 'eMaktab Diary'
  },
  'topbar.admission': {
    uz: 'Qabul 2026/2027',
    ru: 'Прием 2026/2027',
    en: 'Admissions 2026/2027'
  },

  // Main navigation items
  'nav.home': {
    uz: 'Bosh sahifa',
    ru: 'Главная',
    en: 'Home'
  },
  'nav.about': {
    uz: 'Maktab haqida',
    ru: 'О школе',
    en: 'About School'
  },
  'nav.news': {
    uz: 'Yangiliklar',
    ru: 'Новости',
    en: 'News'
  },
  'nav.teachers': {
    uz: 'O‘qituvchilar',
    ru: 'Учителя',
    en: 'Teachers'
  },
  'nav.life': {
    uz: 'Maktab hayoti',
    ru: 'Школьная жизнь',
    en: 'School Life'
  },
  'nav.pubs': {
    uz: 'Nashrlar',
    ru: 'Публикации',
    en: 'Publications'
  },
  'nav.contact': {
    uz: 'Bog‘lanish',
    ru: 'Контакты',
    en: 'Contact'
  },

  // Dropdown - About
  'dropdown.about.overview.title': {
    uz: 'Umumiy ma’lumot',
    ru: 'Общая информация',
    en: 'General Information'
  },
  'dropdown.about.overview.desc': {
    uz: 'Maktab tarixi, qadriyatlari va rahbariyat',
    ru: 'История школы, ценности и руководство',
    en: 'School history, values and leadership'
  },
  'dropdown.about.curriculum.title': {
    uz: 'Ta’lim bosqichlari',
    ru: 'Этапы обучения',
    en: 'Academic Stages'
  },
  'dropdown.about.curriculum.desc': {
    uz: '1–11 sinf davlat ta’lim standarti',
    ru: 'Государственный стандарт 1–11 классов',
    en: 'Grades 1–11 state educational standards'
  },
  'dropdown.about.profile.title': {
    uz: 'Maktab profili',
    ru: 'Профиль школы',
    en: 'School Profile'
  },
  'dropdown.about.profile.desc': {
    uz: 'OTM va xalqaro qabul komissiyalari uchun',
    ru: 'Для вузов и международных комиссий',
    en: 'For university and international admissions'
  },
  'dropdown.about.parents.title': {
    uz: 'Ota-onalar uchun',
    ru: 'Для родителей',
    en: 'For Parents'
  },
  'dropdown.about.parents.desc': {
    uz: 'Maktab tartib-qoidalari va kiyinish madaniyati',
    ru: 'Правила внутреннего распорядка и форма',
    en: 'School policies and dress code guidelines'
  },

  // Dropdown - News
  'dropdown.news.all.title': {
    uz: 'Barcha yangiliklar',
    ru: 'Все новости',
    en: 'All News'
  },
  'dropdown.news.all.desc': {
    uz: 'Maktab hayotidagi so‘nggi voqea va xabarlar',
    ru: 'Свежие события и статьи школьной жизни',
    en: 'Latest events and school updates'
  },
  'dropdown.news.notices.title': {
    uz: 'Rasmiy e’lonlar',
    ru: 'Официальные объявления',
    en: 'Official Notices'
  },
  'dropdown.news.notices.desc': {
    uz: 'Tadbirlar, ta’tillar va muhim bildirishnomalar',
    ru: 'Мероприятия, каникулы и важные уведомления',
    en: 'Events, holidays and critical notifications'
  },

  // Dropdown - School Life
  'dropdown.life.events.title': {
    uz: 'Tadbirlar va to‘garaklar',
    ru: 'События и кружки',
    en: 'Events & Clubs'
  },
  'dropdown.life.events.desc': {
    uz: 'Ijodiy to‘garaklar va sport seksiyalari jadvali',
    ru: 'Расписание кружков и спортивных секций',
    en: 'Creative clubs and athletic sports schedule'
  },
  'dropdown.life.awards.title': {
    uz: 'Maktab yutuqlari',
    ru: 'Достижения школы',
    en: 'School Achievements'
  },
  'dropdown.life.awards.desc': {
    uz: 'Fan olimpiadalari g‘oliblari va faxriy sovrinlar',
    ru: 'Победители олимпиад и почетные награды',
    en: 'Olympiad winners and honor medals'
  },
  'dropdown.life.gallery.title': {
    uz: 'Fotogalereya',
    ru: 'Фотогалерея',
    en: 'Photo Gallery'
  },
  'dropdown.life.gallery.desc': {
    uz: 'Maktab hayoti va bayram tadbirlari fotosuratlarda',
    ru: 'Школьная жизнь и праздники в фотографиях',
    en: 'Campus life and celebration photos'
  },

  // Dropdown - Publications
  'dropdown.pubs.magazines.title': {
    uz: 'Maktab jurnali',
    ru: 'Школьный журнал',
    en: 'School Magazine'
  },
  'dropdown.pubs.magazines.desc': {
    uz: 'Chop etilgan jurnallar va elektron PDF nashrlar',
    ru: 'Печатные и электронные PDF выпуски',
    en: 'Published print and digital PDF editions'
  },
  'dropdown.pubs.blog.title': {
    uz: 'Ilmiy maqolalar va blog',
    ru: 'Статьи и блог',
    en: 'Articles & Blog'
  },
  'dropdown.pubs.blog.desc': {
    uz: 'Pedagoglar va iqtidorli o‘quvchilar izlanishlari',
    ru: 'Исследования педагогов и учащихся',
    en: 'Research by educators and talented students'
  },

  // Badges
  'badge.important': {
    uz: 'Muhim',
    ru: 'Важно',
    en: 'Important'
  },
  'badge.new': {
    uz: 'Yangi',
    ru: 'Новое',
    en: 'New'
  },

  // Actions
  'action.search': {
    uz: 'Sayt bo‘yicha qidiruv',
    ru: 'Поиск по сайту',
    en: 'Search site'
  },
  'action.admin': {
    uz: 'Boshqaruv',
    ru: 'Управление',
    en: 'Admin'
  },
  'action.login': {
    uz: 'Tizimga kirish',
    ru: 'Войти в систему',
    en: 'Sign In'
  },
  'action.view_all': {
    uz: 'Barchasini ko‘rish',
    ru: 'Смотреть все',
    en: 'View All'
  },

  // Mobile Drawer
  'mobile.drawer.title': {
    uz: '25-MAKTAB',
    ru: 'ШКОЛА №25',
    en: 'SCHOOL #25'
  },
  'mobile.drawer.city': {
    uz: 'Toshkent shahar',
    ru: 'город Ташкент',
    en: 'Tashkent city'
  },
  'mobile.drawer.emaktab': {
    uz: 'Kundalik / eMaktab portali',
    ru: 'Портал Kundalik / eMaktab',
    en: 'Kundalik / eMaktab Portal'
  },
  'mobile.drawer.admin': {
    uz: 'Ma’muriyat boshqaruvi',
    ru: 'Панель управления',
    en: 'Administration Portal'
  },

  // Hero section
  'hero.year_badge': {
    uz: '2026–2027 O‘quv yili',
    ru: '2026–2027 Учебный год',
    en: '2026–2027 Academic Year'
  },
  'hero.standard_badge': {
    uz: 'Davlat ta’lim standarti',
    ru: 'Государственный стандарт',
    en: 'State Educational Standard'
  },
  'hero.title': {
    uz: 'Zamonaviy bilim, mustahkam tarbiya va porloq kelajak maskani',
    ru: 'Обитель современных знаний, крепкого воспитания и светлого будущего',
    en: 'Modern knowledge, strong character, and a bright future'
  },
  'hero.description': {
    uz: 'Toshkent shahri Mirzo Ulug‘bek tumanidagi 25-sonli umumiy o‘rta ta’lim maktabi — har bir o‘quvchining shaxsiy iqtidorini kashf etish, chuqur fundamental bilim va yuqori natijalar sari yetaklovchi maskan.',
    ru: 'Школа №25 Мирзо-Улугбекского района города Ташкента — учебное заведение, раскрывающее таланты каждого ученика и ведущее к фундаментальным знаниям.',
    en: 'School No. 25 of Mirzo Ulugbek District in Tashkent — fostering personal talents, deep fundamental mastery, and inspiring educational success for every student.'
  },
  'hero.cta.about': {
    uz: 'Maktab haqida tanishing',
    ru: 'Познакомиться со школой',
    en: 'Discover Our School'
  },
  'hero.cta.profile': {
    uz: 'Maktab profili (School Profile)',
    ru: 'Профиль школы (School Profile)',
    en: 'School Profile'
  },
  'hero.cta.contact': {
    uz: 'Aloqa & Qabulxona',
    ru: 'Контакты и приемная',
    en: 'Contact & Admissions'
  }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'uz',
  setLanguage: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('uz')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const savedLang = localStorage.getItem('school-lang') as Language
      if (savedLang && (savedLang === 'uz' || savedLang === 'ru' || savedLang === 'en')) {
        setLanguageState(savedLang)
      } else {
        // Check cookie
        const match = document.cookie.match(/(?:^|; )school-lang=([^;]*)/)
        if (match && (match[1] === 'uz' || match[1] === 'ru' || match[1] === 'en')) {
          setLanguageState(match[1] as Language)
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang)
    try {
      localStorage.setItem('school-lang', newLang)
      document.cookie = `school-lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`
      document.documentElement.setAttribute('lang', newLang)
    } catch {
      // Storage unavailable
    }
  }

  const t = (key: string): string => {
    const entry = TRANSLATIONS[key]
    if (!entry) return key
    return entry[language] || entry.uz || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
