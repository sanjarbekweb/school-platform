import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrAuthenticated } from '../access'

export const Albums: CollectionConfig = {
  slug: 'albums',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventDate', 'status'],
    group: 'Kontent',
  },
  labels: {
    singular: 'Fotogalereya albomi',
    plural: 'Fotogalereyalar',
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
      label: 'Albom nomi',
      required: true,
      admin: {
        placeholder: '“Bilimlar kuni” tantanali tadbiri',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Veb-manzil (Slug)',
      required: true,
      unique: true,
      admin: {
        placeholder: 'bilimlar-kuni-tantanali-tadbiri',
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
      name: 'eventDate',
      type: 'date',
      label: 'Tadbir o‘tkazilgan sana',
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Albom muqovasi (Bosh rasm)',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Albomdagi fotosuratlar',
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          label: 'Rasm',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Rasm osti izohi',
        },
      ],
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
