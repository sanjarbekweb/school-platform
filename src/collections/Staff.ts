import type { CollectionConfig } from 'payload'
import { canMutateStaff, isEditor } from '../access'

export const Staff: CollectionConfig = {
  slug: 'staff',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'role', 'subject', 'status'],
    group: 'Xodimlar',
  },
  labels: {
    singular: 'O‘qituvchi / Xodim',
    plural: 'O‘qituvchilar va xodimlar',
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        status: {
          equals: 'faol',
        },
      }
    },
    create: isEditor,
    update: canMutateStaff,
    delete: isEditor,
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'To‘liq ismi (F.I.O.)',
      required: true,
      admin: {
        placeholder: 'Rustamov Alisher Vohidovich',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Veb-manzil (Slug)',
      required: true,
      unique: true,
      admin: {
        placeholder: 'alisher-rustamov',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.fullName) {
              return data.fullName
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
      name: 'portrait',
      type: 'relationship',
      relationTo: 'media',
      label: 'Rasmiy fotosurati (Portret)',
      admin: {
        description: 'Rasmiy kiyimdagi 4:5 nisbatdagi sifatli portret fotosurat.',
      },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Lavozimi / Maktabdagi vazifasi',
      required: true,
      defaultValue: 'oqituvchi',
      options: [
        { label: 'Maktab direktori', value: 'direktor' },
        { label: 'O‘quv ishlari bo‘yicha direktor o‘rinbosari', value: 'orinbosar_oquv' },
        { label: 'Ma’naviy-ma’rifiy ishlar bo‘yicha direktor o‘rinbosari', value: 'orinbosar_manaviyat' },
        { label: 'Fan o‘qituvchisi', value: 'oqituvchi' },
        { label: 'Boshlang‘ich sinf o‘qituvchisi', value: 'boshlangich' },
        { label: 'Maktab psixologi', value: 'psixolog' },
        { label: 'Kutubxona mudiri', value: 'kutubxonachi' },
      ],
    },
    {
      name: 'subject',
      type: 'select',
      label: 'Mutaxassislik fani',
      options: [
        { label: 'Matematika', value: 'matematika' },
        { label: 'Ona tili va adabiyot', value: 'ona_tili' },
        { label: 'Fizika', value: 'fizika' },
        { label: 'Kimyo', value: 'kimyo' },
        { label: 'Biologiya', value: 'biologiya' },
        { label: 'Ingliz tili', value: 'ingliz_tili' },
        { label: 'Tarix va huquq', value: 'tarix' },
        { label: 'Informatika va IT', value: 'informatika' },
        { label: 'Boshlang‘ich ta’lim', value: 'boshlangich_talim' },
        { label: 'Jismoniy tarbiya', value: 'jismoniy_tarbiya' },
        { label: 'Tasviriy san’at va musiqa', value: 'sanat' },
      ],
      admin: {
        description: 'Agar xodim ma’muriyat a’zosi bo‘lsa, fan ixtiyoriy bo‘lishi mumkin.',
      },
    },
    {
      name: 'qualifications',
      type: 'text',
      label: 'Toifasi va ma’lumoti',
      admin: {
        placeholder: 'Oliy toifali o‘qituvchi, Nizomiy nomidagi TDPU bitiruvchisi',
      },
    },
    {
      name: 'achievements',
      type: 'textarea',
      label: 'Yutuqlari va mukofotlari',
      admin: {
        placeholder: '“Xalq ta’limi a’lochisi” ko‘krak nishoni sohibi (2023-yil)',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Qisqa tarjimai hol (Biografiya)',
      admin: {
        placeholder: 'Pedagogik faoliyatini 2012-yilda boshlagan. 100 dan ortiq o‘quvchilari oliy ta’lim muassasalariga grant asosida qabul qilingan.',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Rasmiy maktab elektron pochtasi',
      admin: {
        description: 'Faqatgina maktabning rasmiy xizmat pochtasi kiritiladi (shaxsiy emaillar kiritilmaydi).',
        placeholder: 'a.rustamov@maktab142.uz',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Xizmat telefoni (Ichki raqam)',
      admin: {
        placeholder: '+998 71 200 01 42 (ichki 104)',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Tartib raqami (Ketma-ketlik)',
      defaultValue: 10,
      admin: {
        description: 'Kichik sonlar ro‘yxat boshida ko‘rinadi (Masalan: Direktor = 1, O‘rinbosarlar = 2-5).',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Profil holati',
      required: true,
      defaultValue: 'faol',
      options: [
        { label: 'Faol (Saytda ko‘rinadi)', value: 'faol' },
        { label: 'Qoralama (Tekshirish kutilmoqda)', value: 'qoralama' },
        { label: 'Arxivlangan (Ishdan bo‘shagan)', value: 'arxivlangan' },
      ],
      admin: {
        description: 'Arxivlangan xodimlarning eski maqolalari saqlanadi, lekin o‘zlari ro‘yxatdan chiqariladi.',
      },
    },
  ],
}
