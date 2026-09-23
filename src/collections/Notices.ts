import type { CollectionConfig } from 'payload'
import { activeNoticesOrAuthenticated, isEditor } from '../access'

export const Notices: CollectionConfig = {
  slug: 'notices',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'priority', 'expiryDate', 'status'],
    group: 'Kontent',
  },
  labels: {
    singular: 'Rasmiy e’lon',
    plural: 'E’lonlar va bildirishnomalar',
  },
  access: {
    read: activeNoticesOrAuthenticated,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'E’lon sarlavhasi',
      required: true,
      admin: {
        placeholder: 'Maktabimizda 1-sinfga qabul jarayoni boshlandi',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'E’lon matni',
      required: true,
      admin: {
        placeholder: 'Hurmatli ota-onalar, 2026-2027 o‘quv yili uchun qabul my.maktab.uz portali orqali amalga oshiriladi.',
      },
    },
    {
      name: 'link',
      type: 'text',
      label: 'Batafsil ma’lumot havolasi (URL)',
      admin: {
        placeholder: 'https://my.maktab.uz yoki /ota-onalar/',
      },
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Muhimlik darajasi',
      required: true,
      defaultValue: 'oddiy',
      options: [
        { label: 'Oddiy e’lon (Ko‘k rangda)', value: 'oddiy' },
        { label: 'Muhim bildirishnoma (Sariq rangda)', value: 'muhim' },
        { label: 'Shoshilinch xabar (Qizil rangda)', value: 'shoshilinch' },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Boshlanish vaqti (Toshkent vaqti bilan)',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'Ushbu vaqtdan boshlab e’lon saytda ko‘rinishni boshlaydi.',
      },
    },
    {
      name: 'expiryDate',
      type: 'date',
      label: 'Amal qilish muddati / Tugash vaqti (Toshkent vaqti bilan)',
      required: true,
      admin: {
        description: 'Muddati o‘tgach, e’lon bosh sahifa va faol ro‘yxatdan avtomatik yashiriladi.',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Holati',
      required: true,
      defaultValue: 'faol',
      options: [
        { label: 'Faol (Muddati bo‘yicha ko‘rsatilsin)', value: 'faol' },
        { label: 'Qoralama (Hali e’lon qilinmasin)', value: 'qoralama' },
        { label: 'Bekor qilingan / Arxiv', value: 'arxivlangan' },
      ],
    },
  ],
}
