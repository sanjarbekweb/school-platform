# School platform audit and repair prompt

Copy the prompt below into a coding task with this workspace open.

---

Audit and repair `D:\Academic\schoolpage\school-platform`, the Uzbek school website built with Next.js 15, React 19, Payload 3 and SQLite/PostgreSQL. Implement the fixes and verify the result, rather than only proposing changes. Preserve the Uzbek language, school branding, existing content and URLs. The root Vite skyscraper demo and `school-website` WordPress installation are outside scope. Do not deploy or overwrite the existing database. Use an isolated database and media directory for mutation tests and recovery drills.

The following findings come from a source-code audit on 2026-09-14, not browser or exploit testing. Reproduce them and resolve their causes. Do not treat `docs/VERIFICATION-REPORT.md` as proof of correctness.

## 1. Authorization and publication — highest priority

- `src/collections/Users.ts`: users can update their own account, but `linkedStaff` has no field-level restriction. A teacher can select another staff profile and gain its update permission through `canMutateStaff`. Restrict assignment to administrators and test attempts through actual API requests.
- `src/collections/News.ts`: publication status has update access control but no create access control. `canMutateNews` in `src/access/index.ts` restricts author identity but does not restrict the existing document to editable workflow states. Teachers can change their own published articles. Protect create/update publication transitions, force teacher author identity on creation, and prevent reassignment. Test omitted status, explicit published status, forged author, and changes to published records.
- `src/collections/BlogPosts.ts`: any authenticated user can create a post whose default status is published, with no field-level publication restriction. Implement an explicit teacher draft/submission workflow and editor publication policy.
- Audit Staff status changes and Payload's `_status` alongside the custom `status` fields. Establish one consistent publication policy, including draft reads, versions, scheduled dates, and related documents. Avoid silently breaking existing published content during migration.
- `News.editorialNotes` is described as internal but has no read access restriction. Verify that anonymous API responses and populated relationships cannot reveal it or private user fields.
- Public frontend queries use Payload Local API calls without explicit access enforcement. Audit every query, including metadata and relationships; implement safe public queries with appropriate access checks and filters. Preserve intended public notice archives without exposing drafts.
- `src/payload.config.ts` contains a predictable fallback signing secret. Require a configured strong secret for production, document local setup, and fail clearly without logging secrets.
- `src/components/RichTextRenderer.tsx` inserts arbitrary string content as raw HTML. Render plain text safely; if legacy HTML is required, sanitize using a maintained allowlist. Validate link protocols. Test script/event-handler payloads and malformed content.

## 2. Data and routing correctness

- `src/app/(frontend)/oqituvchilar/[slug]/page.tsx` queries `news.authorStaff`, which does not exist in News. Resolve the actual `news.author -> users.linkedStaff` relationship without exposing user data, or introduce and migrate an intentional relationship. Verify a teacher's published articles appear.
- `src/app/(frontend)/elonlar/page.tsx`: the archive predicate matches any expired record, including a draft. Limit the archive to explicitly public states. `search/page.tsx` filters notices only by active status, ignoring start and expiry times. Share consistent scheduled/active/archive rules across lists, search, banners, and APIs; validate expiry after start.
- Search scans only the first 50 or 100 records per collection and omits Pages and Albums despite page-oriented copy and gallery suggestions. Implement complete, bounded, paginated search with Uzbek apostrophe normalization. Handle repeated `q` parameters (arrays), whitespace, punctuation-only queries, long input, and unavailable data sources. The current `.trim()` call assumes `q` is always a string.
- Listing pages impose fixed limits with no pagination. Implement pagination where needed while preserving filters, validating page values, and providing real empty states.
- Redirect records exist in `src/collections/Redirects.ts`, but the inspected source has no consumer implementing their redirects; `next.config.mjs` has no redirect configuration. Wire redirects to actual requests, validate internal destinations, avoid loops/open redirects, and test HTTP status and Location. Existing verification only checks database rows.
- Many page queries swallow errors into empty arrays or null, producing false empty states or 404s during failures. Distinguish not-found, empty, and unavailable states, add useful server logging and retry UI, and avoid leaking technical details to visitors.
- Audit publication freshness and caching so editor changes and time-dependent notices appear correctly without a rebuild.

## 3. Responsive design and accessibility

- Preserve the existing navy/blue identity while making spacing, typography, cards, buttons, imagery and content hierarchy consistent.
- Staff and magazine detail pages hard-code two columns in inline `gridTemplateColumns`, overriding `grid-cols-1`. Stack these on narrow screens. About, contact and education grids use minimum 320px tracks that exceed some mobile content widths. Fix the layout rather than hiding horizontal overflow.
- Audit all CSS variable references. Pages use undefined tokens such as `--radius-md`, `--radius-full`, and `--shadow-sm`; map them to the shared design system or define intentional equivalents.
- `src/components/Header.tsx`: mobile dialog lacks initial focus, focus containment, background isolation, scroll locking and focus restoration. Implement accessible keyboard behavior and handle resizing to desktop while open. Give the icon-only admin link an accessible name, add current-page states, and check desktop dropdown focus/close behavior.
- Search input lacks an explicit accessible label and removes its outline inline. Supply a visible or screen-reader label and visible keyboard focus. Check all forms and interactive controls.
- Inspect header fit at intermediate widths, long Uzbek labels, small-screen action buttons, reading widths, image crops, wrapping, print output, contrast and reduced motion. Do not rely solely on source review or screenshots at one desktop size.
- Repair rich-text fidelity: nested lists, line breaks, internal links, text formatting, uploads and supported Lexical nodes. Prefer the installed Payload renderer where suitable; verify formatting flags against the installed dependency rather than trusting the handwritten comment.

## 4. Content integrity and operations

- Layout JSON-LD hard-codes contact information while other pages use CMS settings. Use one source for institutional identity, metadata and contact details. Audit seed/demo content and verification badges; do not invent or independently assert that contact details are verified.
- `scripts/restore.mjs` restores the chosen SQLite snapshot but always selects the newest media backup. Pair snapshots through their matching timestamp/manifest, validate every source and destination before writing, honor configured database locations, and fail safely on missing pairs. Make restoration explicit and preserve a pre-restore copy. Test only in a disposable directory.
- `scripts/backup.mjs` copies a live SQLite file without a database snapshot mechanism; assess WAL consistency and implement a supported consistent snapshot approach. PostgreSQL mode merely prints a dump command containing the connection string and still reports success. Perform a real backup or fail with a clear unsupported-operation result; never log connection secrets or claim verification without performing it. Missing database files must fail.
- Add usable project-level setup instructions, environment examples without real credentials, and accurate verification commands. Check the existing lint script actually works with the installed tooling.

## 5. Required verification and deliverables

1. Inspect applicable project instructions and installed versions. Record a baseline, then run type checking and a production build after fixes.
2. Use a disposable database to test anonymous, teacher, editor and admin requests. Cover ownership changes, publication transitions, private fields, draft visibility, notice time boundaries and populated relationships. Tests must exercise the application/API, not merely assert the shape of an access function.
3. Start the site and browse every public route, valid detail route, missing detail route, admin login and relevant editing workflows. Check console errors, failed requests, images, PDFs, internal links and real redirect responses.
4. Verify at 320, 375, 768, 1024 and 1440px, with keyboard-only navigation and reduced motion. Capture representative before/after screenshots and check horizontal overflow.
5. Test search with more records than the old limits, Uzbek apostrophe variants, repeated query parameters, pagination, and excluded drafts. Test errors separately from empty data.
6. Test backup/restore pairing and failure handling with temporary fixtures. Do not run the existing restore or seed scripts against the user's database.
7. Replace overbroad verification claims with an evidence-based report listing commands, results, screenshots, remaining limitations and any external prerequisites. Report exactly what was fixed and what remains. Do not claim the entire project is bug-free.

Proceed through the repairs in priority order. Resolve routine implementation decisions autonomously; ask only for information that cannot be inferred and is essential to correct behavior.
