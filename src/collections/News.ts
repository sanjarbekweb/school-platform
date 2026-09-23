import type { CollectionConfig } from 'payload'
import { canMutateNews, canSetPublicationStatus, isEditor, isEditorFieldLevel, isLoggedIn, publishedOrAuthenticated } from '../access'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
    group: 'Kontent',
  },
  labels: {
    singular: 'Yangilik',
    plural: 'Yangiliklar',
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  access: {
    read: publishedOrAuthenticated,
    create: isLoggedIn,
    update: canMutateNews,
    delete: isEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Yangilik sarlavhasi',
      required: true,
      admin: {
        placeholder: 'Maktabimizda Navro‘z bayrami keng nishonlandi',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Veb-manzil (URL slug)',
      required: true,
      unique: true,
      admin: {
        description: 'Veb-sayt manzilida ko‘rinadigan qism. Bo‘sh qoldirilsa, sarlavhadan avtomatik olinadi.',
        placeholder: 'maktabimizda-navroz-bayrami-keng-nishonlandi',
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
      name: 'summary',
      type: 'textarea',
      label: 'Qisqa mazmuni (Anons)',
      required: true,
      admin: {
        description: 'Bosh sahifa va ijtimoiy tarmoqlar uchun 1-2 jumlali qisqa tavsif.',
        placeholder: 'Navro‘z umumxalq bayrami munosabati bilan maktabimizda milliy taomlar yarmarkasi va sahna ko‘rinishlari tashkil etildi.',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Rukn (Kategoriya)',
      required: true,
      defaultValue: 'akademik',
      options: [
        { label: 'Akademik jarayon', value: 'akademik' },
        { label: 'Tadbirlar va bayramlar', value: 'tadbirlar' },
        { label: 'Sport musobaqalari', value: 'sport' },
        { label: 'Madaniyat va san’at', value: 'madaniyat' },
      ],
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Asosiy rasm (Muqova)',
      admin: {
        description: 'Yangilikning asosiy fotosurati (16:10 nisbatda tavsiya etiladi).',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'To‘liq maqola matni',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Nashr holati (Workflow Status)',
      required: true,
      defaultValue: 'qoralama',
      access: {
        create: canSetPublicationStatus,
        update: canSetPublicationStatus,
      },
      options: [
        {
          label: 'Qoralama (Muallif tahririda)',
          value: 'qoralama',
        },
        {
          label: 'Ko‘rib chiqilmoqda (Muharrirga yuborilgan)',
          value: 'korib_chiqilmoqda',
        },
        {
          label: 'O‘zgartirish kerak (Qayta ishlashga qaytarilgan)',
          value: 'ozgartirish_kerak',
        },
        {
          label: 'Nashr qilingan (Saytda hamma ko‘radi)',
          value: 'nashr_qilingan',
        },
        {
          label: 'Arxivlangan (Tarixiy arxivda)',
          value: 'arxivlangan',
        },
      ],
      admin: {
        description: 'Faqatgina muharrirlar va administratorlar maqolani to‘g‘ridan-to‘g‘ri "Nashr qilingan" holatiga o‘tkaza oladi.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Chop etilgan sana',
      admin: {
        description: 'Agar belgilanmasa, nashr etilgan vaqt avtomatik qo‘yiladi.',
      },
      hooks: {
        beforeChange: [
          ({ value, data }) => {
            if (data?.status === 'nashr_qilingan' && !value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Muallif',
      admin: {
        description: 'Ushbu maqolani tayyorlagan xodim yoki o‘qituvchi.',
      },
      defaultValue: ({ user }: any) => user?.id,
      access: {
        update: isEditorFieldLevel,
      },
      hooks: {
        beforeChange: [
          ({ req: { user }, value }) => {
            // Force teacher's own author identity on creation and prevent forgery
            if (user && (user as any).role === 'teacher') {
              return user.id
            }
            return value || user?.id
          },
        ],
      },
    },
    {
      name: 'authorStaff',
      type: 'relationship',
      relationTo: 'staff',
      label: 'Muallif o‘qituvchi profili',
      admin: {
        description: 'Agar ushbu maqola o‘qituvchi tomonidan yozilgan bo‘lsa, uning sahifasida avtomatik ko‘rinadi.',
      },
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            if (value) {
              return typeof value === 'object' ? value.id : value
            }
            const user = req?.user as any
            if (user && user.linkedStaff) {
              return typeof user.linkedStaff === 'object' ? user.linkedStaff.id : user.linkedStaff
            }
            return value
          },
        ],
      },
    },
    {
      name: 'editorialNotes',
      type: 'textarea',
      label: 'Tahririyat izohlari (Faqat ichki foydalanish uchun)',
      access: {
        read: isEditorFieldLevel,
        create: isEditorFieldLevel,
        update: isEditorFieldLevel,
      },
      admin: {
        description: 'Muharrirning muallifga qaytargan ko‘rsatmalari va fikrlari. Saytda ko‘rinmaydi.',
      },
    },
  ],
}
