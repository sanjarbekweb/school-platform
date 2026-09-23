import type { CollectionConfig } from 'payload'
import { canMutateBlog, canSetPublicationStatus, isEditor, isEditorFieldLevel, isLoggedIn, publishedOrAuthenticated } from '../access'

export const BlogPosts: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'authorName', 'publishedAt', 'status'],
    group: 'Nashrlar',
  },
  labels: {
    singular: 'Blog maqolasi',
    plural: 'Blog va maqolalar',
  },
  access: {
    read: publishedOrAuthenticated,
    create: isLoggedIn,
    update: canMutateBlog,
    delete: isEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Maqola sarlavhasi',
      required: true,
      admin: {
        placeholder: 'Zamonaviy darsda interfaol metodlarning samaradorligi',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Veb-manzil (Slug)',
      required: true,
      unique: true,
      admin: {
        placeholder: 'zamonaviy-darsda-interfaol-metodlar',
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
      label: 'Qisqa annotatsiya (Tavsif)',
      required: true,
    },
    {
      name: 'authorName',
      type: 'text',
      label: 'Muallif (Ism va mutaxassislik)',
      required: true,
      admin: {
        placeholder: 'Nilufar Karimova, Oliy toifali ona tili va adabiyot o‘qituvchisi',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Muallif foydalanuvchi hisobi',
      defaultValue: ({ user }: any) => user?.id,
      access: {
        update: isEditorFieldLevel,
      },
      hooks: {
        beforeChange: [
          ({ req: { user }, value }) => {
            if (user && (user as any).role === 'teacher') {
              return user.id
            }
            return value || user?.id
          },
        ],
      },
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Muqova fotosurati',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'To‘liq maqola matni',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Chop etilgan sana',
      defaultValue: () => new Date().toISOString(),
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
        { label: 'Qoralama (Muallif tahririda)', value: 'qoralama' },
        { label: 'Ko‘rib chiqilmoqda (Muharrirga yuborilgan)', value: 'korib_chiqilmoqda' },
        { label: 'O‘zgartirish kerak (Qayta ishlashga qaytarilgan)', value: 'ozgartirish_kerak' },
        { label: 'Nashr qilingan (Saytda hamma ko‘radi)', value: 'nashr_qilingan' },
        { label: 'Arxivlangan (Tarixiy arxivda)', value: 'arxivlangan' },
      ],
      admin: {
        description: 'Faqatgina muharrirlar va administratorlar maqolani to‘g‘ridan-to‘g‘ri "Nashr qilingan" holatiga o‘tkaza oladi.',
      },
    },
  ],
}
