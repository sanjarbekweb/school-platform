import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrAuthenticated } from '../access'

export const Awards: CollectionConfig = {
  slug: 'awards',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'competition', 'level', 'result', 'year'],
    group: 'Kontent',
  },
  labels: {
    singular: 'Yutuq va mukofot',
    plural: 'Maktab yutuqlari',
  },
  access: {
    read: publishedOrAuthenticated,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Yutuq sarlavhasi',
      required: true,
      admin: {
        placeholder: 'Respublika fan olimpiadasida matematika fanidan 1-o‘rin',
      },
    },
    {
      name: 'competition',
      type: 'text',
      label: 'Musobaqa / Tanlov nomi',
      required: true,
      admin: {
        placeholder: 'Asosiy fanlar bo‘yicha Respublika olimpiadasi',
      },
    },
    {
      name: 'level',
      type: 'select',
      label: 'Bosqich (Daraja)',
      required: true,
      defaultValue: 'respublika',
      options: [
        { label: 'Xalqaro bosqich', value: 'xalqaro' },
        { label: 'Respublika bosqichi', value: 'respublika' },
        { label: 'Toshkent shahar bosqichi', value: 'shahar' },
        { label: 'Tuman bosqichi', value: 'tuman' },
      ],
    },
    {
      name: 'result',
      type: 'text',
      label: 'Natija / Olingan o‘rin',
      required: true,
      admin: {
        placeholder: '1-o‘rin (Oltin medal)',
      },
    },
    {
      name: 'year',
      type: 'number',
      label: 'Yil',
      required: true,
      defaultValue: 2026,
    },
    {
      name: 'recipient',
      type: 'text',
      label: 'G‘olib (O‘quvchi yoki jamoa)',
      required: true,
      admin: {
        placeholder: 'Karimov Jasur (11-A sinf o‘quvchisi)',
      },
    },
    {
      name: 'photo',
      type: 'relationship',
      relationTo: 'media',
      label: 'Taqdirlash fotosurati',
    },
    {
      name: 'relatedNews',
      type: 'relationship',
      relationTo: 'news',
      label: 'Tegishli batafsil yangilik (agar mavjud bo‘lsa)',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Holati',
      required: true,
      defaultValue: 'nashr_qilingan',
      options: [
        { label: 'Nashr qilingan (Hamma ko‘radi)', value: 'nashr_qilingan' },
        { label: 'Qoralama (Tekshirilmoqda)', value: 'qoralama' },
      ],
    },
  ],
}
