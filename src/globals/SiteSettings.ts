import type { GlobalConfig } from 'payload'
import { isEditor } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Sozlamalar',
  },
  label: 'Maktabning rasmiy ma’lumotlari',
  access: {
    read: () => true,
    update: isEditor,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Asosiy va Yuridik',
          fields: [
            {
              name: 'schoolName',
              type: 'text',
              label: 'Maktabning to‘liq nomi',
              required: true,
              defaultValue: '142-sonli umumiy o‘rta ta’lim maktabi',
            },
            {
              name: 'shortName',
              type: 'text',
              label: 'Qisqa nomi',
              required: true,
              defaultValue: '142-maktab',
            },
            {
              name: 'schoolNumber',
              type: 'text',
              label: 'Maktab raqami',
              required: true,
              defaultValue: '142',
            },
            {
              name: 'legalName',
              type: 'text',
              label: 'To‘liq yuridik nomi (Nizom bo‘yicha)',
              defaultValue: 'Toshkent shahar Mirzo Ulug‘bek tumani 142-sonli umumiy o‘rta ta’lim maktabi',
            },
            {
              name: 'institutionId',
              type: 'text',
              label: 'Muassasa identifikatori (STIR / Litsenziya)',
              defaultValue: '142',
            },
            {
              name: 'supervisingAuthority',
              type: 'text',
              label: 'Yuqori turuvchi idora',
              defaultValue: 'O‘zbekiston Respublikasi Maktabgacha va maktab ta’limi vazirligi',
            },
          ],
        },
        {
          label: 'Aloqa va Ijtimoiy tarmoqlar',
          fields: [
            {
              name: 'address',
              type: 'text',
              label: 'Pochta manzili',
              required: true,
              defaultValue: 'Toshkent shahri, Mirzo Ulug‘bek tumani',
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Rasmiy qabulxona telefoni',
              defaultValue: '+998 71 200 01 42',
            },
            {
              name: 'phoneVerified',
              type: 'checkbox',
              label: 'Telefon raqami rasman tekshirilgan va tasdiqlangan',
              defaultValue: false,
            },
            {
              name: 'email',
              type: 'email',
              label: 'Rasmiy institutsional elektron pochta',
              defaultValue: 'info@maktab142.uz',
            },
            {
              name: 'emailVerified',
              type: 'checkbox',
              label: 'Elektron pochta rasman tekshirilgan va tasdiqlangan',
              defaultValue: false,
            },
            {
              name: 'telegram',
              type: 'text',
              label: 'Rasmiy Telegram kanali manzili',
              defaultValue: 'https://t.me/maktab142_uz',
            },
            {
              name: 'receptionHours',
              type: 'text',
              label: 'Fuqarolarni qabul qilish soatlari',
              defaultValue: 'Dushanba – Juma: 09:00 – 17:00',
            },
          ],
        },
        {
          label: 'Rahbariyat va Qabul maslahatchisi',
          fields: [
            {
              name: 'directorName',
              type: 'text',
              label: 'Maktab direktori F.I.O.',
              defaultValue: 'Maktab rahbariyati',
            },
            {
              name: 'counselorName',
              type: 'text',
              label: 'Oliy ta’lim va kasbga yo‘naltirish maslahatchisi',
              defaultValue: 'Akademik maslahatchi',
            },
            {
              name: 'counselorEmail',
              type: 'email',
              label: 'Maslahatchining xizmat elektron pochtasi (Common App / Parchment)',
              defaultValue: 'admissions@maktab142.uz',
            },
            {
              name: 'lastVerifiedDate',
              type: 'text',
              label: 'Oxirgi ma’muriy tasdiqlangan sana',
              defaultValue: '2026-yil sentyabr',
            },
            {
              name: 'approvedBy',
              type: 'text',
              label: 'Ma’lumotlarni tasdiqlagan mas’ul idora / xodim',
              defaultValue: '142-maktab ma’muriyati',
            },
          ],
        },
      ],
    },
  ],
}
