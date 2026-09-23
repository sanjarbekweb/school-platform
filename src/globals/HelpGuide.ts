import type { GlobalConfig } from 'payload'
import { isLoggedIn } from '../access'

export const HelpGuide: GlobalConfig = {
  slug: 'help-guide',
  label: 'Yordam va Yo‘riqnoma',
  admin: {
    group: 'Yordam',
    description: 'O‘qituvchilar, muharrirlar va ma’murlar uchun qisqa elektron yo‘riqnoma va standartlar.',
  },
  access: {
    read: isLoggedIn,
    update: ({ req: { user } }) => Boolean(user && (user as any).role === 'admin'),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'O‘qituvchilar uchun',
          fields: [
            {
              name: 'teacherGuideTitle',
              type: 'text',
              label: 'Sarlavha',
              defaultValue: 'O‘qituvchi va xodimlar uchun tezkor ko‘rsatmalar',
            },
            {
              name: 'teacherGuideContent',
              type: 'richText',
              label: 'Yo‘riqnoma matni',
            },
          ],
        },
        {
          label: 'Muharrirlar uchun',
          fields: [
            {
              name: 'editorGuideTitle',
              type: 'text',
              label: 'Sarlavha',
              defaultValue: 'Muharrir va ma’murlar uchun nashr siyosati',
            },
            {
              name: 'editorGuideContent',
              type: 'richText',
              label: 'Nashr qilish qoidalari',
            },
          ],
        },
        {
          label: 'Texnik standartlar va Fotosuratlar',
          fields: [
            {
              name: 'mediaRules',
              type: 'textarea',
              label: 'Media va fayllar talablari',
              defaultValue:
                '1. Yangilik muqovasi: 16:10 nisbatda (masalan: 1200x750px), maksimal 500 KB.\n' +
                '2. O‘qituvchi portreti: 4:5 nisbatda (masalan: 800x1000px), rasmiy kiyimda, tiniq fon.\n' +
                '3. Maktab jurnali: 3:4 muqova rasmi va haqiqiy PDF fayl (maksimal 25 MB).\n' +
                '4. Har bir rasm uchun alt-matn (tavsif) yozish majburiydir (WCAG 2.2 talabi).\n' +
                '5. Maxfiy yoki shaxsiy o‘quvchi ma’lumotlarini ochiq media kutubxonasiga yuklash qat’iyan taqiqlanadi.',
            },
            {
              name: 'supportContact',
              type: 'text',
              label: 'Texnik yordam va aloqa',
              defaultValue: 'Texnik ma’mur: admin@maktab142.uz | Bosh muharrir: +998 71 200 01 42 (ichki 102)',
            },
          ],
        },
      ],
    },
  ],
}
