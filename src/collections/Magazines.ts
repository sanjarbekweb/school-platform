import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrAuthenticated } from '../access'

export const Magazines: CollectionConfig = {
  slug: 'magazines',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'issueNumber', 'publishDate', 'status'],
    group: 'Nashrlar',
  },
  labels: {
    singular: 'Maktab jurnali soni',
    plural: 'Maktab jurnallari',
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
      label: 'Jurnal nomi',
      required: true,
      admin: {
        placeholder: '“Zukko avlod” ilmiy-ommabop maktab jurnali',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Veb-manzil (Slug)',
      required: true,
      unique: true,
      admin: {
        placeholder: 'zukko-avlod-2026-1-son',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/['‘’`]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'issueNumber',
      type: 'text',
      label: 'Nashr soni va yili',
      required: true,
      admin: {
        placeholder: '2026-yil 1-son',
      },
    },
    {
      name: 'publishDate',
      type: 'date',
      label: 'Chiqarilgan sana',
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Qisqa annotatsiya (Tavsif)',
      admin: {
        placeholder: 'Ushbu sonda: O‘quvchilarimizning ilmiy maqolalari, maktab laboratoriyasidagi tajribalar va adabiy ijod namunalari.',
      },
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Jurnal muqovasi fotosurati',
      admin: {
        description: 'Jurnalning old muqovasi (3:4 nisbatda tavsiya etiladi).',
      },
    },
    {
      name: 'pdfFile',
      type: 'relationship',
      relationTo: 'media',
      label: 'To‘liq PDF fayli',
      required: true,
      admin: {
        description: 'Jurnalning to‘liq elektron shakli (PDF).',
      },
    },
    {
      name: 'fileSize',
      type: 'text',
      label: 'Fayl hajmi (ko‘rsatish uchun)',
      admin: {
        placeholder: '2.4 MB',
      },
    },
    {
      name: 'pageCount',
      type: 'number',
      label: 'Sahifalar soni',
      admin: {
        placeholder: '32',
      },
    },
    {
      name: 'contentsList',
      type: 'textarea',
      label: 'Mundarija (Asosiy maqolalar ro‘yxati)',
      admin: {
        placeholder: '1. Bosh muharrir so‘zi - 2-bet\n2. Yosh astronomlar to‘garagi - 6-bet\n3. Matematika mo‘jizalari - 14-bet',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Holati',
      required: true,
      defaultValue: 'nashr_qilingan',
      options: [
        { label: 'Nashr qilingan (Hamma ko‘radi va yuklay oladi)', value: 'nashr_qilingan' },
        { label: 'Qoralama (Tayyorlanmoqda)', value: 'qoralama' },
      ],
    },
  ],
}
