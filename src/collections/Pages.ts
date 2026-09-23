import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrAuthenticated } from '../access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
    group: 'Sahifalar',
  },
  labels: {
    singular: 'Doimiy sahifa',
    plural: 'Statik va axborot sahifalari',
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
      label: 'Sahifa sarlavhasi',
      required: true,
      admin: {
        placeholder: 'Maktab haqida umumiy ma’lumot',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Veb-manzil (URL slug)',
      required: true,
      unique: true,
      admin: {
        description: 'Muhim asosiy sahifalar: maktab-haqida, talim, maktab-hayoti, ota-onalar, boglanish, maxfiylik, school-profile',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Sahifa ost-sarlavhasi / Shior',
      admin: {
        placeholder: '142-sonli umumiy o‘rta ta’lim maktabining tarixi, qadriyatlari va maqsadlari',
      },
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Sahifaning asosiy tasviri',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Sahifa to‘liq matni va tarkibi',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Holati',
      required: true,
      defaultValue: 'nashr_qilingan',
      options: [
        { label: 'Nashr qilingan', value: 'nashr_qilingan' },
        { label: 'Qoralama', value: 'qoralama' },
      ],
    },
  ],
}
