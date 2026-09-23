import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import { getActiveNoticesWhere, getPastNoticesWhere } from '../src/lib/notices'
import { sanitizeUrl } from '../src/components/RichTextRenderer'
import { sanitizeRedirectTarget } from '../src/lib/redirects'

const disposableDbPath = path.resolve(process.cwd(), 'disposable-security.db')

async function runSecurityAudit() {
  console.log('========================================================')
  console.log('🛡️ ISOLATED ACCESS CONTROL & SECURITY VERIFICATION SUITE')
  console.log('========================================================\n')

  if (fs.existsSync(disposableDbPath)) {
    fs.unlinkSync(disposableDbPath)
  }
  const sourceDb = path.resolve(process.cwd(), 'school.db')
  if (fs.existsSync(sourceDb)) {
    fs.copyFileSync(sourceDb, disposableDbPath)
  }

  // Set isolated DB environment before importing config
  process.env.DATABASE_URI = `file:${disposableDbPath}`
  process.env.PAYLOAD_SECRET = 'disposable_test_secret_for_security_suite_2026_at_least_32_chars'

  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  console.log('✓ Isolated Payload instance initialized with disposable database.')

  let passedAssertions = 0
  let failedAssertions = 0

  function assert(condition: boolean, description: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${description}`)
      passedAssertions++
    } else {
      console.error(`  ✗ FAIL: ${description}`)
      failedAssertions++
    }
  }

  try {
    // 1. Setup Test Fixtures: Admin, Teacher 1, Teacher 2, Staff A, Staff B
    console.log('\n--- 1. Setting Up Fixtures ---')
    const runId = Date.now()
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: `admin_test_${runId}@maktab142.uz`,
        password: 'AdminPassword123!',
        name: `Admin Test ${runId}`,
        role: 'admin',
      },
    })

    const staffA = await payload.create({
      collection: 'staff',
      data: {
        fullName: `Staff Member A ${runId}`,
        role: 'oqituvchi',
        subject: 'matematika',
        status: 'faol',
      },
    })

    const staffB = await payload.create({
      collection: 'staff',
      data: {
        fullName: `Staff Member B ${runId}`,
        role: 'oqituvchi',
        subject: 'fizika',
        status: 'faol',
      },
    })

    const teacher1 = await payload.create({
      collection: 'users',
      data: {
        email: `teacher1_test_${runId}@maktab142.uz`,
        password: 'TeacherPassword123!',
        name: `Teacher One ${runId}`,
        role: 'teacher',
        linkedStaff: staffA.id,
      },
    })

    const teacher2 = await payload.create({
      collection: 'users',
      data: {
        email: `teacher2_test_${runId}@maktab142.uz`,
        password: 'TeacherPassword123!',
        name: `Teacher Two ${runId}`,
        role: 'teacher',
        linkedStaff: staffB.id,
      },
    })
    console.log('✓ Test users and staff created.')

    // 2. Test Users linkedStaff Field-Level Protection
    console.log('\n--- 2. Users.linkedStaff Field-Level Protection ---')
    // Teacher 1 attempts to reassign linkedStaff to Staff B
    await payload.update({
      collection: 'users',
      id: teacher1.id,
      data: {
        name: 'Teacher One Renamed',
        linkedStaff: staffB.id as any,
      },
      user: teacher1,
      overrideAccess: false,
    })

    const reloadedTeacher1 = await payload.findByID({
      collection: 'users',
      id: teacher1.id,
    })

    assert(
      reloadedTeacher1.name === 'Teacher One Renamed',
      'Teacher can update own profile name'
    )
    assert(
      (typeof reloadedTeacher1.linkedStaff === 'object'
        ? reloadedTeacher1.linkedStaff?.id
        : reloadedTeacher1.linkedStaff) === staffA.id,
      'Teacher cannot reassign linkedStaff (privilege escalation blocked)'
    )

    // Admin can update linkedStaff
    await payload.update({
      collection: 'users',
      id: teacher1.id,
      data: {
        linkedStaff: staffB.id as any,
      },
      user: adminUser,
    })
    const adminUpdatedTeacher1 = await payload.findByID({
      collection: 'users',
      id: teacher1.id,
    })
    assert(
      (typeof adminUpdatedTeacher1.linkedStaff === 'object'
        ? adminUpdatedTeacher1.linkedStaff?.id
        : adminUpdatedTeacher1.linkedStaff) === staffB.id,
      'Admin can update linkedStaff for staff profile mapping'
    )

    // Reset linkedStaff back to staffA
    await payload.update({
      collection: 'users',
      id: teacher1.id,
      data: { linkedStaff: staffA.id as any },
      user: adminUser,
    })

    // 3. Test News Publication Status Protection & Author Forging
    console.log('\n--- 3. News Author Forgery & Status Transitions ---')
    // Teacher attempts to create News with explicit status = 'nashr_qilingan' and forged author = admin
    const teacherNews = await payload.create({
      collection: 'news',
      data: {
        title: 'Teacher Draft Article',
        summary: 'A test article created by teacher',
        category: 'akademik',
        content: {
          root: {
            type: 'root',
            children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Content text' }] }],
          },
        },
        status: 'nashr_qilingan', // Should be ignored or blocked by canSetPublicationStatus
        author: adminUser.id as any, // Should be overridden by beforeChange hook
        editorialNotes: 'Internal secret notes by editor',
      },
      user: teacher1,
      overrideAccess: false,
    })

    assert(
      teacherNews.status !== 'nashr_qilingan',
      'Teacher cannot create News directly in published status (status forced to draft)'
    )
    assert(
      (typeof teacherNews.author === 'object' ? teacherNews.author?.id : teacherNews.author) === teacher1.id,
      'Teacher cannot forge News author (forced to authenticated user id)'
    )

    // 4. Test Editorial Notes Read Access
    console.log('\n--- 4. News Editorial Notes Read Access ---')
    // Set editorial notes as admin
    await payload.update({
      collection: 'news',
      id: teacherNews.id,
      data: { editorialNotes: 'Confidential review notes' },
      user: adminUser,
    })

    // Anonymous read
    const anonRead = await payload.findByID({
      collection: 'news',
      id: teacherNews.id,
      overrideAccess: false,
      user: undefined,
    }).catch(() => null)

    assert(
      !anonRead || (anonRead as any).editorialNotes === undefined,
      'Anonymous visitor cannot read editorialNotes'
    )

    // Teacher read (non-editor)
    const teacherRead = await payload.findByID({
      collection: 'news',
      id: teacherNews.id,
      overrideAccess: false,
      user: teacher1,
    })
    assert(
      (teacherRead as any).editorialNotes === undefined,
      'Teacher (non-editor) cannot read editorialNotes'
    )

    // 5. Test Teacher Published News Locking
    console.log('\n--- 5. Published News Locking ---')
    // Editor publishes Teacher's article
    await payload.update({
      collection: 'news',
      id: teacherNews.id,
      data: { status: 'nashr_qilingan' },
      user: adminUser,
    })

    // Teacher attempts to modify published article
    let teacherUpdateFailed = false
    try {
      await payload.update({
        collection: 'news',
        id: teacherNews.id,
        data: { title: 'Malicious title change after publish' },
        overrideAccess: false,
        user: teacher1,
      })
    } catch {
      teacherUpdateFailed = true
    }

    const reloadedPublishedNews = await payload.findByID({
      collection: 'news',
      id: teacherNews.id,
    })

    assert(
      teacherUpdateFailed || reloadedPublishedNews.title === 'Teacher Draft Article',
      'Teacher cannot alter article once published by editorial team'
    )

    // 6. Test Cross-Teacher Draft Access
    console.log('\n--- 6. Cross-Teacher Draft Isolation ---')
    // Teacher 1 creates a new draft
    const draft2 = await payload.create({
      collection: 'news',
      data: {
        title: 'Teacher 1 Private Draft',
        summary: 'Work in progress',
        category: 'tadbirlar',
        content: {
          root: {
            type: 'root',
            children: [{ type: 'paragraph', children: [{ type: 'text', text: 'WIP' }] }],
          },
        },
      },
      user: teacher1,
    })

    let teacher2UpdateFailed = false
    try {
      await payload.update({
        collection: 'news',
        id: draft2.id,
        data: { title: 'Teacher 2 Hijack' },
        overrideAccess: false,
        user: teacher2,
      })
    } catch {
      teacher2UpdateFailed = true
    }

    const reloadedDraft2 = await payload.findByID({ collection: 'news', id: draft2.id })
    assert(
      teacher2UpdateFailed || reloadedDraft2.title === 'Teacher 1 Private Draft',
      'Teacher 2 cannot mutate Teacher 1 draft article'
    )

    // 7. Notice Visibility & Draft Leakage Prevention
    console.log('\n--- 7. Notice Visibility & Draft Filtering ---')
    const now = new Date()
    const pastDate = new Date(now.getTime() - 24 * 3600 * 1000).toISOString()
    const futureDate = new Date(now.getTime() + 24 * 3600 * 1000).toISOString()
    const farPastDate = new Date(now.getTime() - 48 * 3600 * 1000).toISOString()

    // Create 4 notice fixtures
    const activeNotice = await payload.create({
      collection: 'notices',
      data: {
        title: 'Active School Notice',
        content: 'This is an active notice',
        status: 'faol',
        startDate: pastDate,
        expiryDate: futureDate,
      },
    })

    const expiredNotice = await payload.create({
      collection: 'notices',
      data: {
        title: 'Expired Past Notice',
        content: 'This notice has expired',
        status: 'faol',
        startDate: farPastDate,
        expiryDate: pastDate,
      },
    })

    const draftNotice = await payload.create({
      collection: 'notices',
      data: {
        title: 'Internal Draft Notice',
        content: 'Unpublished draft',
        status: 'qoralama',
        startDate: farPastDate,
        expiryDate: pastDate, // Expired date, but status is DRAFT
      },
    })

    const archivedNotice = await payload.create({
      collection: 'notices',
      data: {
        title: 'Archived Notice',
        content: 'Manually archived',
        status: 'arxivlangan',
        startDate: farPastDate,
        expiryDate: futureDate,
      },
    })

    // Query active notices
    const activeResults = await payload.find({
      collection: 'notices',
      where: getActiveNoticesWhere(now.toISOString()),
    })
    const activeIds = activeResults.docs.map(d => d.id)
    assert(
      activeIds.includes(activeNotice.id) && !activeIds.includes(draftNotice.id) && !activeIds.includes(expiredNotice.id),
      'Active notices query returns only active non-expired notices'
    )

    // Query past notices
    const pastResults = await payload.find({
      collection: 'notices',
      where: getPastNoticesWhere(now.toISOString()),
    })
    const pastIds = pastResults.docs.map(d => d.id)
    assert(
      pastIds.includes(expiredNotice.id) && pastIds.includes(archivedNotice.id),
      'Past notices query includes expired and archived notices'
    )
    assert(
      !pastIds.includes(draftNotice.id),
      'CRITICAL: Past notices query NEVER leaks draft notices into public archive'
    )

    // 8. Sanitization & URL Security Tests
    console.log('\n--- 8. URL & Redirect Sanitization ---')
    assert(sanitizeUrl('javascript:alert(1)') === '#', 'sanitizeUrl blocks javascript: scheme')
    assert(sanitizeUrl('data:text/html,<script>alert(1)</script>') === '#', 'sanitizeUrl blocks data: scheme')
    assert(sanitizeUrl('//attacker.com/phish') === '#', 'sanitizeUrl blocks protocol-relative URLs')
    assert(sanitizeUrl('https://maktab142.uz/photo.jpg') === 'https://maktab142.uz/photo.jpg', 'sanitizeUrl allows valid https URL')
    assert(sanitizeUrl('/oqituvchilar') === '/oqituvchilar', 'sanitizeUrl allows relative paths')
    assert(sanitizeUrl('#top') === '#top', 'sanitizeUrl allows anchor hashes')

    assert(
      sanitizeRedirectTarget('/old-path', 'https://evil.com') === null,
      'sanitizeRedirectTarget blocks external open-redirects'
    )
    assert(
      sanitizeRedirectTarget('/old-path', '//evil.com') === null,
      'sanitizeRedirectTarget blocks protocol-relative open-redirects'
    )
    assert(
      sanitizeRedirectTarget('/my-path', '/my-path') === null,
      'sanitizeRedirectTarget blocks self-redirect loops'
    )
    assert(
      sanitizeRedirectTarget('/old-path', '/school-profile') === '/school-profile',
      'sanitizeRedirectTarget allows valid internal redirects'
    )

  } finally {
    // Cleanup disposable database
    try {
      if ((payload?.db as any)?.client?.close) {
        (payload.db as any).client.close()
      }
      if (fs.existsSync(disposableDbPath)) {
        fs.unlinkSync(disposableDbPath)
      }
      const walFile = `${disposableDbPath}-wal`
      const shmFile = `${disposableDbPath}-shm`
      if (fs.existsSync(walFile)) fs.unlinkSync(walFile)
      if (fs.existsSync(shmFile)) fs.unlinkSync(shmFile)
      console.log('\n✓ Cleaned up disposable security database.')
    } catch {
      process.on('exit', () => {
        try { if (fs.existsSync(disposableDbPath)) fs.unlinkSync(disposableDbPath) } catch {}
      })
      console.log('\n✓ Disposable security database scheduled for cleanup on process exit.')
    }
  }

  console.log('\n========================================================')
  console.log(`TOTAL PASSED: ${passedAssertions}`)
  console.log(`TOTAL FAILED: ${failedAssertions}`)
  console.log('========================================================')

  if (failedAssertions > 0) {
    process.exit(1)
  }
  process.exit(0)
}

runSecurityAudit().catch((err) => {
  console.error('Audit crashed:', err)
  if (err.data?.errors) {
    console.error('Field errors:', JSON.stringify(err.data.errors, null, 2))
  }
  process.exit(1)
})
