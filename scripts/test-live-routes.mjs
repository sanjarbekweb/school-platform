async function probeRoutes() {
  const baseUrl = 'http://localhost:3000'

  const routes = [
    { path: '/', expectedStatus: 200, label: 'Homepage' },
    { path: '/api/health', expectedStatus: 200, label: 'Health API Endpoint' },
    { path: '/maktab-haqida', expectedStatus: 200, label: 'About School' },
    { path: '/talim', expectedStatus: 200, label: 'Educational Programs' },
    { path: '/school-profile', expectedStatus: 200, label: 'Official School Profile' },
    { path: '/ota-onalar', expectedStatus: 200, label: 'Parents Guide' },
    { path: '/maktab-hayoti', expectedStatus: 200, label: 'School Life & Clubs' },
    { path: '/boglanish', expectedStatus: 200, label: 'Contact Information' },
    { path: '/maxfiylik', expectedStatus: 200, label: 'Privacy Policy' },
    { path: '/yangiliklar', expectedStatus: 200, label: 'News Archive' },
    { path: '/yangiliklar?page=1', expectedStatus: 200, label: 'News Archive (Paginated)' },
    { path: '/yangiliklar?kategoriya=akademik', expectedStatus: 200, label: 'News Filtered by Category' },
    { path: '/elonlar', expectedStatus: 200, label: 'Notices (Active)' },
    { path: '/elonlar?view=past', expectedStatus: 200, label: 'Notices (Past Archive)' },
    { path: '/oqituvchilar', expectedStatus: 200, label: 'Teachers Directory' },
    { path: '/oqituvchilar?fan=matematika', expectedStatus: 200, label: 'Teachers Filtered by Subject' },
    { path: '/yutuqlar', expectedStatus: 200, label: 'Awards & Honors' },
    { path: '/yutuqlar?daraja=xalqaro', expectedStatus: 200, label: 'Awards Filtered by Level' },
    { path: '/jurnallar', expectedStatus: 200, label: 'Magazines Index' },
    { path: '/galereya', expectedStatus: 200, label: 'Photo Gallery' },
    { path: '/blog', expectedStatus: 200, label: 'Teacher Blog' },
    { path: '/search', expectedStatus: 200, label: 'Search Page (Empty)' },
    { path: '/search?q=matematika', expectedStatus: 200, label: 'Search with Keyword' },
    { path: '/search?q=o%E2%80%98qituvchi', expectedStatus: 200, label: 'Search with Uzbek Apostrophe' },
    { path: '/search?q=test&page=1', expectedStatus: 200, label: 'Search with Pagination' },
    { path: '/non-existent-page-route-404', expectedStatus: 404, label: 'Non-existent Page (404 Not Found)' },
  ]

  console.log('========================================================')
  console.log('🌐 PRODUCTION ROUTE PROBE & HTTP VERIFICATION')
  console.log('========================================================\n')

  let passed = 0
  let failed = 0

  for (const r of routes) {
    const url = `${baseUrl}${r.path}`
    const start = performance.now()
    try {
      const res = await fetch(url, { redirect: 'manual' })
      const duration = (performance.now() - start).toFixed(1)
      if (res.status === r.expectedStatus) {
        console.log(`✓ [${res.status}] ${r.label.padEnd(35)} (${duration}ms) -> ${r.path}`)
        passed++
      } else {
        console.error(`✗ FAIL: ${r.label} expected ${r.expectedStatus}, got ${res.status} (${r.path})`)
        failed++
      }
    } catch (err) {
      console.error(`✗ NETWORK ERROR: ${r.label} (${r.path}): ${err.message}`)
      failed++
    }
  }

  // Test 301/308 Legacy Redirects
  console.log('\n--- Testing 301/308 Legacy Redirects ---')
  const redirectTests = [
    { from: '/maktab-profili', expectedDest: '/school-profile' },
    { from: '/haqimizda', expectedDest: '/maktab-haqida' },
    { from: '/pedagoglar', expectedDest: '/oqituvchilar' },
    { from: '/yangiliklar-va-elonlar', expectedDest: '/yangiliklar' },
  ]

  for (const rt of redirectTests) {
    const url = `${baseUrl}${rt.from}`
    const res = await fetch(url, { redirect: 'manual' })
    const location = res.headers.get('location')
    const isRedirect = res.status === 301 || res.status === 308 || res.status === 307 || res.status === 302
    if (isRedirect && location === rt.expectedDest) {
      console.log(`✓ [${res.status}] Redirect: ${rt.from} -> ${location}`)
      passed++
    } else {
      console.error(`✗ FAIL: Redirect ${rt.from} expected -> ${rt.expectedDest}, got ${res.status} Location: ${location}`)
      failed++
    }
  }

  console.log('\n========================================================')
  console.log(`TOTAL PASSED: ${passed}`)
  console.log(`TOTAL FAILED: ${failed}`)
  console.log('========================================================')

  if (failed > 0) process.exit(1)
}

probeRoutes().catch(err => {
  console.error('Probe crashed:', err)
  process.exit(1)
})
