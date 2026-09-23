import type { CollectionConfig } from 'payload'
import { isEditor } from '../access'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'statusCode'],
    group: 'Sozlamalar',
  },
  labels: {
    singular: 'Qayta yo‘naltirish (301 Redirect)',
    plural: 'Qayta yo‘naltirishlar (Redirects)',
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      label: 'Eski havola (Qayerdan)',
      required: true,
      unique: true,
      admin: {
        placeholder: '/maktab-profili/ yoki /yangiliklar/eski-yangilik-2/',
      },
    },
    {
      name: 'to',
      type: 'text',
      label: 'Yangi rasmiy havola (Qayerga)',
      required: true,
      admin: {
        placeholder: '/school-profile/ yoki /yangiliklar/eski-yangilik/',
      },
    },
    {
      name: 'statusCode',
      type: 'select',
      label: 'Qayta yo‘naltirish turi (Status code)',
      required: true,
      defaultValue: '301',
      options: [
        { label: '301 Doimiy ko‘chirilgan (Permanent Redirect)', value: '301' },
        { label: '302 Vaqtinchalik yo‘naltirish (Temporary Redirect)', value: '302' },
      ],
    },
  ],
}
