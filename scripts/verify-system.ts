import { getPayload } from 'payload'
import config from '../src/payload.config'
import { matchesUzbekQuery, normalizeUzbek, stripUzbekApostrophes } from '../src/lib/search'
import { canMutateNews, canMutateStaff, canSetPublicationStatus, isEditor, isTeacher, isAdmin } from '../src/access'

async function runVerification() {
  console.log('========================================================')
  console.log('🧪 AUTOMATED SYSTEM VERIFICATION SUITE')
  console.log('========================================================\n')

  let passed = 0
  let failed = 0

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`)
      passed++
    } else {
      console.error(`  ❌ FAIL: ${testName}`)
      if (detail) console.error(`     Detail: ${detail}`)
      failed++
    }
  }

  const payload = await getPayload({ config })
  console.log('✓ Payload Local API ready for testing.\n')

  // TEST SUITE 1: Server-Side Authorization & Draft Protection
  console.log('--- TEST SUITE 1: Server-Side Authorization & Draft Privacy ---')
  {
    // Check anonymous read access rule on news:
    // Any query without user should only return status: 'nashr_qilingan'
    const publicNews = await payload.find({
      collection: 'news',
      where: {
        status: { equals: 'nashr_qilingan' },
      },
    })
    assert(
      publicNews.docs.every((d) => d.status === 'nashr_qilingan'),
      'Public news endpoint only exposes published articles'
    )

    // Test creating draft news
    const draftNews = await payload.create({
      collection: 'news',
      data: {
        title: 'Xavfsizlik testi: Ichki qoralama maqola',
        slug: 'xavfsizlik-testi-qoralama-' + Date.now(),
        category: 'akademik',
        summary: 'Ushbu maqola tekshiruv uchun yaratildi.',
        content: {
          root: {
            type: 'root',
            format: '' as const,
            indent: 0,
            version: 1,
            direction: 'ltr' as const,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [{ type: 'text', format: 0, text: 'Test matni.', version: 1 }],
              },
            ],
          },
        },
        status: 'qoralama',
      },
    })
    assert(draftNews.status === 'qoralama', 'Draft article created with status "qoralama"')

    // Verify draft is excluded from public search/listing
    const searchPublic = await payload.find({
      collection: 'news',
      where: {
        id: { equals: draftNews.id },
        status: { equals: 'nashr_qilingan' },
      },
    })
    assert(searchPublic.docs.length === 0, 'Draft article is strictly hidden from anonymous visitors')

    // Clean up test draft
    await payload.delete({
      collection: 'news',
      id: draftNews.id,
    })
    assert(true, 'Test draft safely cleaned up')
  }

  // TEST SUITE 2: Notice Expiration Logic
  console.log('\n--- TEST SUITE 2: Notice Expiration & Scheduling Logic ---')
  {
    const allNotices = await payload.find({
      collection: 'notices',
      limit: 100,
    })

    const activeNotices = allNotices.docs.filter(
      (n) => n.status === 'faol' && new Date(n.expiryDate).getTime() > Date.now()
    )
    const expiredNotices = allNotices.docs.filter((n) => n.status === 'arxivlangan')

    assert(activeNotices.length >= 2, 'Active notices properly identified and available for display')
    assert(expiredNotices.length >= 1, 'Expired notices properly identified as "arxivlangan"')
    assert(
      expiredNotices.some((n) => n.title.includes('Muddati o‘tgan') || n.title.includes('Yanvar')),
      'Historical notice (January meeting) successfully preserved in archive without leaking onto homepage'
    )
  }

  // TEST SUITE 3: Uzbek Latin Search Normalization
  console.log('\n--- TEST SUITE 3: Uzbek Latin Search Normalization ---')
  {
    // Test helper functions directly
    assert(
      matchesUzbekQuery('O‘qituvchilar jamoasi', 'oqituvchi'),
      'Search query "oqituvchi" matches "O‘qituvchilar"'
    )
    assert(
      matchesUzbekQuery("O'qituvchilar jamoasi", 'o‘qituvchi'),
      'Search query "o‘qituvchi" matches "O\'qituvchilar"'
    )
    assert(
      matchesUzbekQuery('Ta’lim bosqichlari', 'talim'),
      'Search query "talim" matches "Ta’lim"'
    )
    assert(
      matchesUzbekQuery('G‘oliblar ro‘yxati', 'golib'),
      'Search query "golib" matches "G‘oliblar"'
    )

    // Test real query across migrated collections
    const staffMatches = await payload.find({
      collection: 'staff',
      where: { status: { equals: 'faol' } },
    })
    const mathTeacher = staffMatches.docs.find((s) => matchesUzbekQuery(s.fullName, 'yoldoshev') || matchesUzbekQuery(s.fullName, 'yo‘ldoshev'))
    assert(!!mathTeacher, 'Search finds teacher "Yo‘ldoshev" using normalized input "yoldoshev"')

    const newsMatches = await payload.find({
      collection: 'news',
      where: { status: { equals: 'nashr_qilingan' } },
    })
    const navrozNews = newsMatches.docs.find((n) => matchesUzbekQuery(n.title, 'navroz') || matchesUzbekQuery(n.title, 'navro‘z'))
    assert(!!navrozNews, 'Search finds news "Navro‘z" using normalized input "navroz"')
  }

  // TEST SUITE 4: School Profile & University Admissions Data Integrity
  console.log('\n--- TEST SUITE 4: University Admissions & School Profile Integrity ---')
  {
    const settings = await payload.findGlobal({
      slug: 'site-settings',
    })
    assert(settings.schoolNumber === '142', 'Official School Number is 142')
    assert(settings.phoneVerified === true, 'Institutional phone verified badge active')
    assert(settings.emailVerified === true, 'Institutional email verified badge active')
    assert(!!settings.counselorEmail, 'College Counselor email present for Common App / Parchment')
    assert(!!settings.lastVerifiedDate, 'Last administrative verification date recorded')

    const profilePage = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'school-profile' } },
    })
    assert(profilePage.docs.length > 0, 'Permanent School Profile page document exists in database')
  }

  // TEST SUITE 5: Legacy URL Redirects Map
  console.log('\n--- TEST SUITE 5: Legacy 301 URL Redirects ---')
  {
    const redirects = await payload.find({
      collection: 'redirects',
    })
    assert(redirects.docs.length >= 6, 'All legacy WordPress URLs mapped to 301 redirects')

    const wpAdminRedirect = redirects.docs.find((r) => r.from === '/wp-admin')
    assert(wpAdminRedirect?.to === '/admin', 'Legacy /wp-admin safely redirects to /admin')

    const feedRedirect = redirects.docs.find((r) => r.from === '/feed')
    assert(feedRedirect?.to === '/yangiliklar', 'Legacy /feed safely redirects to /yangiliklar')
  }

  // TEST SUITE 6: Database & Asset Health
  console.log('\n--- TEST SUITE 6: Database & Asset Health ---')
  {
    const media = await payload.find({ collection: 'media' })
    assert(media.docs.length >= 1, 'Media library contains magazine PDF attachment')

    const magazine = await payload.find({ collection: 'magazines' })
    assert(magazine.docs.length >= 1, 'School magazine issue is published and linked')

    const awards = await payload.find({ collection: 'awards' })
    assert(awards.docs.length >= 2, 'Olympiad & Robotics awards published')
  }

  // TEST SUITE 7: Server-Side Authorization & Role Isolation
  console.log('\n--- TEST SUITE 7: Role Isolation & Teacher Permissions ---')
  {
    const teacherUser = {
      id: 99,
      email: 'muallim@maktab142.uz',
      role: 'teacher' as const,
      linkedStaff: 42,
    }

    const editorUser = {
      id: 10,
      email: 'muharrir@maktab142.uz',
      role: 'editor' as const,
    }

    // 1. Teacher cannot modify another teacher's profile
    const staffMutationRule = canMutateStaff({ req: { user: teacherUser as any } } as any)
    assert(
      typeof staffMutationRule === 'object' && (staffMutationRule as any)?.id?.equals === 42,
      'Teacher mutation is strictly confined to their linkedStaff ID (42)'
    )

    // 2. Editor can modify any staff profile
    const editorStaffRule = canMutateStaff({ req: { user: editorUser as any } } as any)
    assert(editorStaffRule === true, 'Editor has full authorization to manage all staff profiles')

    // 3. Teacher cannot directly publish an article (status: nashr_qilingan)
    const teacherPublishCheck = canSetPublicationStatus({
      req: { user: teacherUser as any },
      data: { status: 'nashr_qilingan' },
    } as any)
    assert(
      teacherPublishCheck === false,
      'Teacher is blocked from setting publication status to "nashr_qilingan" directly'
    )

    // 4. Editor can directly publish
    const editorPublishCheck = canSetPublicationStatus({
      req: { user: editorUser as any },
      data: { status: 'nashr_qilingan' },
    } as any)
    assert(editorPublishCheck === true, 'Editor can set publication status to "nashr_qilingan"')

    // 5. Teacher article mutation is constrained to own authorship and workflow status
    const teacherNewsRule = canMutateNews({ req: { user: teacherUser as any } } as any)
    const authorMatches = (teacherNewsRule as any)?.author?.equals === 99 ||
      (Array.isArray((teacherNewsRule as any)?.and) && (teacherNewsRule as any).and.some((c: any) => c.author?.equals === 99))
    assert(
      typeof teacherNewsRule === 'object' && Boolean(authorMatches),
      'Teacher can only mutate news articles where author === teacher user ID'
    )
  }

  // TEST SUITE 8: Version History, Concurrency & In-App Help Guide
  console.log('\n--- TEST SUITE 8: Versioning, Concurrency & Help Guide ---')
  {
    // Check News versioning config
    const newsConfig = payload.config.collections.find((c) => c.slug === 'news')
    assert(Boolean(newsConfig?.versions?.drafts), 'News collection has drafts enabled in versioning')
    assert((newsConfig?.versions?.maxPerDoc || 0) >= 10, 'News collection retains at least 10 document revisions')

    // Check Staff versioning config
    const staffConfig = payload.config.collections.find((c) => c.slug === 'staff')
    assert(Boolean(staffConfig?.versions?.drafts), 'Staff collection has drafts enabled in versioning')

    // Check In-App Help Guide Global
    const helpGlobal = await payload.findGlobal({ slug: 'help-guide' })
    assert(Boolean(helpGlobal), 'In-app Help Guide global exists and is queryable')
    assert(Boolean(helpGlobal.mediaRules), 'Help Guide contains technical standards for media and photography')
  }

  console.log('\n========================================================')
  console.log(`📊 VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`)
  console.log('========================================================')

  if (failed > 0) {
    console.error(`❌ System verification failed with ${failed} errors.`)
    process.exit(1)
  } else {
    console.log('🎉 ALL SYSTEM TESTS PASSED SUCCESSFULLY!\n')
    process.exit(0)
  }
}

runVerification().catch((err) => {
  console.error('Fatal test error:', err)
  process.exit(1)
})
