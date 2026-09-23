import type { CollectionConfig } from 'payload'
import { isEditor, isLoggedIn } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'public/media',
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ],
  },
  admin: {
    useAsTitle: 'alt',
    group: 'Kontent',
  },
  labels: {
    singular: 'Media fayl',
    plural: 'Media kutubxonasi',
  },
  access: {
    read: ({ req: { user } }) => {
      // Logged in users see all media
      if (user) return true
      // Anonymous visitors cannot view protected/draft attachments
      return {
        isPrivate: {
          not_equals: true,
        },
      }
    },
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isEditor,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Rasm tavsifi (Alt matn - ekran o‘quvchilari uchun)',
      required: true,
      admin: {
        description: 'Ko‘zi ojiz foydalanuvchilar va qidiruv tizimlari uchun rasmda nima tasvirlanganini aniq yozing.',
        placeholder: '142-maktab binosining old ko‘rinishi',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Rasm osti izohi (Caption)',
      admin: {
        placeholder: 'Maktab hovlisidagi tadbirdan lavha',
      },
    },
    {
      name: 'isPrivate',
      type: 'checkbox',
      label: 'Maxfiy / Faqat ichki foydalanish uchun',
      defaultValue: false,
      admin: {
        description: 'Belgilansa, ushbu fayl tizimga kirmagan tashrif buyuruvchilarga ko‘rinmaydi.',
      },
    },
  ],
}
