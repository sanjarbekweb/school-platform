import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isLoggedIn } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Tizim',
  },
  labels: {
    singular: 'Foydalanuvchi',
    plural: 'Foydalanuvchilar',
  },
  access: {
    // Only admins can view user lists or create users; users can read their own profile
    read: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).role === 'admin') return true
      return {
        id: {
          equals: user.id,
        },
      }
    },
    create: isAdmin,
    update: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).role === 'admin') return true
      // Normal users can only update their own account
      return {
        id: {
          equals: user.id,
        },
      }
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Foydalanuvchi ismi (F.I.O.)',
      required: true,
      admin: {
        placeholder: 'Alisher Rustamov',
      },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Tizimdagi roli',
      required: true,
      defaultValue: 'teacher',
      access: {
        update: isAdminFieldLevel,
      },
      options: [
        {
          label: 'Administrator (To‘liq huquqlar)',
          value: 'admin',
        },
        {
          label: 'Muharrir (Chop etish va tekshirish)',
          value: 'editor',
        },
        {
          label: 'O‘qituvchi / Muallif (Qoralama tayyorlash)',
          value: 'teacher',
        },
      ],
      admin: {
        description: 'Faqatgina administratorlar foydalanuvchi rolini o‘zgartira oladi.',
      },
    },
    {
      name: 'linkedStaff',
      type: 'relationship',
      relationTo: 'staff',
      label: 'Bog‘langan o‘qituvchi profili',
      access: {
        update: isAdminFieldLevel,
      },
      admin: {
        description: 'Ushbu foydalanuvchi o‘zgartira oladigan xodim profili (Faqat administrator biriktira oladi).',
        condition: (data) => data.role === 'teacher',
      },
    },
  ],
}
