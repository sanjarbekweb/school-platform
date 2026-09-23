import { getPayload } from 'payload'
import config from '../src/payload.config'

async function seedDemo() {
  console.log('🚀 Starting Development Seed Tool...')
  const payload = await getPayload({ config })

  // 1. Seed Users (Admin, Editor, Teacher)
  console.log('\n👤 Checking & Seeding Users...')

  const usersToSeed = [
    {
      email: 'admin@maktab25.uz',
      password: 'MaktabAdmin2026!',
      role: 'admin' as const,
      name: 'Bosh administrator (25-maktab)',
    },
    {
      email: 'editor@maktab25.uz',
      password: 'MaktabEditor2026!',
      role: 'editor' as const,
      name: 'Tahririyat mas’uli (Muharrir)',
    },
    {
      email: 'teacher@maktab25.uz',
      password: 'MaktabTeacher2026!',
      role: 'teacher' as const,
      name: 'Pedagog o‘qituvchi',
    },
    {
      email: 'admin@maktab142.uz',
      password: 'MaktabAdmin2026!',
      role: 'admin' as const,
      name: 'Bosh administrator',
    },
    {
      email: 'editor@maktab142.uz',
      password: 'MaktabEditor2026!',
      role: 'editor' as const,
      name: 'Tahririyat mas’uli',
    },
  ]

  for (const u of usersToSeed) {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: u.email } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: u.email,
          password: u.password,
          role: u.role,
          name: u.name,
        },
      })
      console.log(`  ✓ Created ${u.role}: ${u.email} (Password: ${u.password})`)
    } else {
      console.log(`  - Exists ${u.role}: ${u.email}`)
    }
  }

  // 2. Seed Site Settings
  console.log('\n⚙️ Configuring Site Settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      schoolName: '25-sonli umumiy o‘rta ta’lim maktabi',
      shortName: '25-maktab',
      schoolNumber: '25',
      legalName: 'Toshkent shahar 25-sonli umumiy o‘rta ta’lim maktabi',
      institutionId: '25-TOSHKENT',
      supervisingAuthority: 'O‘zbekiston Respublikasi Maktabgacha va maktab ta’limi vazirligi',
      address: 'Toshkent shahar, Mirzo Ulug‘bek tumani, 25-maktab',
      phone: '+998 71 200 00 25',
      phoneVerified: true,
      email: 'info@maktab25.uz',
      emailVerified: true,
      telegram: 'https://t.me/maktab25_uz',
      receptionHours: 'Dushanba – Shanba: 08:00 – 18:00',
      directorName: 'Rahimova Dilnoza Shavkatovna',
      counselorName: 'Yo‘ldoshev Xurshid Baxtiyorovich',
      counselorEmail: 'counselor@maktab25.uz',
      lastVerifiedDate: '2026-yil sentabr',
      approvedBy: 'Maktab ma’muriyati va pedagogik kengash',
    },
  })
  console.log('  ✓ Site settings updated and verified.')

  console.log('\n✅ Demo Seeding Finished Successfully!')
  console.log('--------------------------------------------------')
  console.log('Admin Panel URL: /admin')
  console.log('Admin:   admin@maktab25.uz   / MaktabAdmin2026!')
  console.log('Editor:  editor@maktab25.uz  / MaktabEditor2026!')
  console.log('Teacher: teacher@maktab25.uz / MaktabTeacher2026!')
  console.log('--------------------------------------------------\n')
  process.exit(0)
}

seedDemo().catch((err) => {
  console.error('❌ Error during demo seed:', err)
  process.exit(1)
})
