import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { DatabaseSync } from 'node:sqlite'

const testDir = path.resolve(process.cwd(), 'temp-drill-disposable')

try {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true })
  }
  fs.mkdirSync(testDir, { recursive: true })

  const fakeDbPath = path.join(testDir, 'disposable.db')
  const fakeMediaDir = path.join(testDir, 'media')
  fs.mkdirSync(fakeMediaDir, { recursive: true })

  // Initialize disposable database
  const db = new DatabaseSync(fakeDbPath)
  db.exec('CREATE TABLE test_data(id INTEGER PRIMARY KEY, msg TEXT);')
  db.exec("INSERT INTO test_data(msg) VALUES ('original message before backup');")
  db.close()

  // Create disposable media file
  fs.writeFileSync(path.join(fakeMediaDir, 'sample-photo.jpg'), 'JPEG_HEADER_DISPOSABLE_DATA')

  console.log('✓ Disposable fixtures created in:', testDir)

  // Run backup with isolated environment
  const backupEnv = {
    ...process.env,
    DATABASE_URI: `file:${fakeDbPath}`,
    MEDIA_DIR: fakeMediaDir,
  }

  // Backup creates files in backups/ directory
  console.log('\n--- EXECUTING BACKUP SCRIPT ---')
  execSync('node scripts/backup.mjs', { env: backupEnv, stdio: 'inherit' })

  // Verify backup created a manifest
  const backupDir = path.resolve(process.cwd(), 'backups')
  const manifests = fs.readdirSync(backupDir).filter(f => f.startsWith('manifest-')).sort().reverse()
  if (manifests.length === 0) {
    throw new Error('No manifest found after backup!')
  }
  const latestManifest = manifests[0]
  console.log(`✓ Backup created manifest: ${latestManifest}`)

  // Modify disposable database (simulating data loss / corruption)
  const corruptDb = new DatabaseSync(fakeDbPath)
  corruptDb.exec("INSERT INTO test_data(msg) VALUES ('corrupted row added');")
  corruptDb.close()

  // Run restore against disposable database
  console.log('\n--- EXECUTING RESTORE DRILL ---')
  execSync(`node scripts/restore.mjs ${latestManifest}`, { env: backupEnv, stdio: 'inherit' })

  // Verify restore brought back original state
  const restoredDb = new DatabaseSync(fakeDbPath)
  const rows = restoredDb.prepare('SELECT msg FROM test_data').all()
  restoredDb.close()

  console.log('Restored rows:', rows)
  if (rows.length !== 1 || rows[0].msg !== 'original message before backup') {
    throw new Error('Restoration verification failed: Database rows do not match original snapshot!')
  }
  console.log('✓ RESTORATION INTEGRITY VERIFIED: Database exactly matches pre-corruption state.')

} finally {
  // Clean up disposable directory
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true })
    console.log('✓ Cleaned up disposable directory.')
  }
  // Clean up any test backup files generated during drill
  const backupDir = path.resolve(process.cwd(), 'backups')
  if (fs.existsSync(backupDir)) {
    for (const f of fs.readdirSync(backupDir)) {
      if (f.includes('disposable') || (typeof latestManifest !== 'undefined' && latestManifest && f.includes(latestManifest.replace('manifest-', '').replace('.json', '')))) {
        const full = path.join(backupDir, f)
        fs.rmSync(full, { recursive: true, force: true })
      }
    }
  }
}
