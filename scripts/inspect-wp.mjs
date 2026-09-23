import { DatabaseSync } from 'node:sqlite'
import path from 'path'

const dbPath = 'D:/Academic/schoolpage/school-website/wp-content/database/.ht.sqlite'
const db = new DatabaseSync(dbPath, { readOnly: true })

const posts = db.prepare(`
  SELECT ID, post_title, post_name, post_type, post_status, post_date, post_content 
  FROM mktb_posts 
  WHERE post_type NOT IN ('wp_global_styles', 'revision') AND post_status != 'auto-draft'
  ORDER BY post_type, ID
`).all()

console.log(`Total non-system posts: ${posts.length}\n`)

for (const p of posts) {
  const meta = db.prepare('SELECT meta_key, meta_value FROM mktb_postmeta WHERE post_id = ?').all(p.ID)
  console.log(`=== [${p.post_type}] ID: ${p.ID} | Slug: ${p.post_name} | Status: ${p.post_status} ===`)
  console.log(`Title: ${p.post_title}`)
  console.log(`Date: ${p.post_date}`)
  if (p.post_content) {
    console.log(`Content length: ${p.post_content.length} chars`)
  }
  if (meta.length > 0) {
    console.log('Postmeta:')
    for (const m of meta) {
      console.log(`  - ${m.meta_key}: ${m.meta_value.slice(0, 80)}`)
    }
  }
  console.log('')
}
